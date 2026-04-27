import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CrudOptions {
  idField?: string;
  orderBy?: string;
  /** Additional react-query keys to invalidate after a mutation. */
  extraInvalidateKeys?: string[][];
}

export function useAdminCrud<T extends Record<string, any>>(table: string, options?: CrudOptions | string) {
  const opts: CrudOptions = typeof options === "string" ? { orderBy: options } : options || {};
  const idField = opts.idField || "id";
  const orderBy = opts.orderBy || "display_order";

  const qc = useQueryClient();
  const [editing, setEditing] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: [`admin_${table}`],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table as any)
        .select("*")
        .order(orderBy);
      if (error) throw error;
      return data as unknown as T[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: [`admin_${table}`] });
    qc.invalidateQueries({ queryKey: [table] });
  };

  const save = async (record: T) => {
    setSaving(true);
    try {
      const clean = { ...record };
      delete (clean as any).created_at;
      delete (clean as any).updated_at;

      const pkValue = clean[idField];
      const isExisting = pkValue && data.some((item) => item[idField] === pkValue);

      if (isExisting) {
        const updateData = { ...clean };
        // Don't send PK in update body for uuid-type PKs
        if (idField === "id") delete (updateData as any).id;

        const { error, count } = await supabase
          .from(table as any)
          .update(updateData)
          .eq(idField, pkValue as any)
          .select();
        if (error) throw error;
        toast.success("Modifications enregistrées ✓");
      } else {
        // INSERT new
        if (idField === "id") delete (clean as any).id;

        const { error } = await supabase
          .from(table as any)
          .insert(clean as any)
          .select();
        if (error) throw error;
        toast.success("Élément ajouté ✓");
      }
      setEditing(null);
      invalidate();
    } catch (err: any) {
      console.error(`[Admin] Save error on ${table}:`, err);
      toast.error("Erreur : " + (err.message || "Impossible de sauvegarder"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (pkValue: string) => {
    console.log(`[Admin] Deleting from ${table} where ${idField} = ${pkValue}`);
    try {
      const { data: deleted, error } = await supabase
        .from(table as any)
        .delete()
        .eq(idField, pkValue as any)
        .select();

      console.log(`[Admin] Delete result:`, { deleted, error });

      if (error) throw error;

      if (!deleted || deleted.length === 0) {
        toast.error("Suppression refusée — vérifiez vos permissions");
        return;
      }

      toast.success("Élément supprimé ✓");
      invalidate();
    } catch (err: any) {
      console.error(`[Admin] Delete error on ${table}:`, err);
      toast.error("Erreur : " + (err.message || "Impossible de supprimer"));
    }
  };

  return { data, isLoading, editing, setEditing, saving, save, remove, idField };
}
