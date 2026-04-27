import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus } from "lucide-react";

interface Props {
  serviceId: string;
}

/**
 * Inline editor pour les "chips" (badges) d'un service entreprise.
 * Affiché à l'intérieur du formulaire d'édition d'un service.
 */
export default function ServiceChipsEditor({ serviceId }: Props) {
  const qc = useQueryClient();
  const { data: chips = [], isLoading } = useQuery({
    queryKey: ["service_entreprise_chips", serviceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_entreprise_chips")
        .select("*")
        .eq("service_id", serviceId)
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
    enabled: !!serviceId,
  });

  const [newChip, setNewChip] = useState("");
  const [busy, setBusy] = useState(false);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["service_entreprise_chips", serviceId] });
    qc.invalidateQueries({ queryKey: ["services_entreprise_with_chips"] });
  };

  const addChip = async () => {
    const text = newChip.trim();
    if (!text || busy) return;
    setBusy(true);
    const nextOrder = chips.length;
    const { error } = await supabase.from("service_entreprise_chips").insert({
      service_id: serviceId,
      text,
      display_order: nextOrder,
    });
    setBusy(false);
    if (!error) {
      setNewChip("");
      invalidate();
    }
  };

  const removeChip = async (id: string) => {
    setBusy(true);
    await supabase.from("service_entreprise_chips").delete().eq("id", id);
    setBusy(false);
    invalidate();
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <p className="text-xs font-semibold text-slate-700 mb-1">Badges (chips) du service</p>
      <p className="text-[11px] text-slate-500 mb-3">
        Petits libellés affichés sous la description (ex : « Photo HD », « Drone »…).
      </p>

      <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
        {isLoading && <span className="text-[11px] text-slate-400">Chargement…</span>}
        {chips.map((c: any) => (
          <span
            key={c.id}
            className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-xs text-slate-700"
          >
            {c.text}
            <button
              type="button"
              onClick={() => removeChip(c.id)}
              className="text-slate-400 hover:text-red-500 transition"
              aria-label="Supprimer"
            >
              <Trash2 size={12} />
            </button>
          </span>
        ))}
        {!isLoading && chips.length === 0 && (
          <span className="text-[11px] text-slate-400">Aucun badge — ajoute le premier ci-dessous.</span>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newChip}
          onChange={(e) => setNewChip(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addChip();
            }
          }}
          placeholder="Nouveau badge…"
          className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={addChip}
          disabled={busy || !newChip.trim()}
          className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          <Plus size={12} />
          Ajouter
        </button>
      </div>
    </div>
  );
}
