import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CrudOptions {
  idField?: string;
  orderBy?: string;
}

export function useAdminCrud<T extends Record<string, any>>(table: string, options?: CrudOptions | string) {
  // backward compat: if options is a string, treat as orderBy
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

  const save = async (record: T) => {
    setSaving(true);
    try {
      const clean = { ...record };
      delete (clean as any).created_at;
      delete (clean as any).updated_at;

      const pkValue = clean[idField];

      if (pkValue && data.some((item) => item[idField] === pkValue)) {
        // UPDATE existing
        const updateData = { ...clean };
        // Don't send the PK in the update body if it's "id"
        if (idField === "id") delete (updateData as any).id;
        
        const { error } = await supabase
          .from(table as any)
          .update(updateData)
          .eq(idField as any, pkValue);
        if (error) throw error;
        toast.success("Modifications enregistrées ✓");
      } else {
        // INSERT new
        if (idField === "id") delete (clean as any).id;
        
        const { error } = await supabase
          .from(table as any)
          .insert(clean as any);
        if (error) throw error;
        toast.success("Élément ajouté ✓");
      }
      setEditing(null);
      qc.invalidateQueries({ queryKey: [`admin_${table}`] });
      // Also invalidate the public query keys so the site updates
      qc.invalidateQueries({ queryKey: [table] });
    } catch (err: any) {
      console.error(`[Admin] Save error on ${table}:`, err);
      toast.error("Erreur : " + (err.message || "Impossible de sauvegarder"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (pkValue: string) => {
    try {
      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq(idField as any, pkValue);
      if (error) throw error;
      toast.success("Élément supprimé ✓");
      qc.invalidateQueries({ queryKey: [`admin_${table}`] });
      qc.invalidateQueries({ queryKey: [table] });
    } catch (err: any) {
      console.error(`[Admin] Delete error on ${table}:`, err);
      toast.error("Erreur : " + (err.message || "Impossible de supprimer"));
    }
  };

  return { data, isLoading, editing, setEditing, saving, save, remove, idField };
}
