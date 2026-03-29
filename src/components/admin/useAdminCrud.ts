import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAdminCrud<T extends Record<string, any>>(table: string, orderBy = "display_order") {
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

      if (clean.id) {
        const { error } = await supabase.from(table as any).update(clean).eq("id", clean.id);
        if (error) throw error;
        toast.success("Modifications enregistrées");
      } else {
        delete (clean as any).id;
        const { error } = await supabase.from(table as any).insert(clean as any);
        if (error) throw error;
        toast.success("Élément ajouté");
      }
      setEditing(null);
      qc.invalidateQueries({ queryKey: [`admin_${table}`] });
    } catch (err: any) {
      toast.error("Erreur : " + (err.message || "Impossible de sauvegarder"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      const { error } = await supabase.from(table as any).delete().eq("id", id);
      if (error) throw error;
      toast.success("Élément supprimé");
      qc.invalidateQueries({ queryKey: [`admin_${table}`] });
    } catch (err: any) {
      toast.error("Erreur : " + (err.message || "Impossible de supprimer"));
    }
  };

  return { data, isLoading, editing, setEditing, saving, save, remove };
}
