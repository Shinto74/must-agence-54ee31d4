import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TableEditor from "./TableEditor";
import { useMemo, useState } from "react";

/**
 * Éditeur des infobulles (tooltips) affichées au survol des features de packs.
 */
export default function PackTooltipsEditor() {
  const { data: packs = [] } = useQuery({
    queryKey: ["admin_packs_lookup_tooltips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packs")
        .select("id, name, display_order")
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
  });

  const [packId, setPackId] = useState<string>("");
  const activePackId = useMemo(
    () => packId || packs[0]?.id || "",
    [packs, packId]
  );

  if (packs.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs text-slate-500">
          Créez d'abord un pack pour pouvoir ajouter ses infobulles.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Pack ciblé
        </label>
        <select
          value={activePackId}
          onChange={(e) => setPackId(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
        >
          {packs.map((p, i) => (
            <option key={p.id} value={p.id}>
              Pack {i + 1} — {p.name}
            </option>
          ))}
        </select>
      </section>

      {activePackId && (
        <TableEditor
          table="pack_tooltips"
          title="Infobulles des features"
          description={`Le préfixe doit correspondre au début du texte d'une feature pour déclencher l'infobulle au survol. Exemple : préfixe "Promotion Playlisting" matche la feature "Promotion Playlisting (1 mois)".`}
          label="infobulle"
          initialRecord={{ pack_id: activePackId, feature_prefix: "", tooltip_text: "" }}
          filter={(row: any) => row.pack_id === activePackId}
          fields={[
            { key: "feature_prefix", label: "Préfixe de la feature", placeholder: "Promotion Playlisting" },
            { key: "tooltip_text", label: "Texte de l'infobulle", type: "textarea" },
            { key: "display_order", label: "Position", type: "number" },
          ]}
          renderItem={(item: any) => (
            <p className="text-sm text-slate-900">
              <strong>{item.feature_prefix}</strong>
              <span className="text-slate-500 text-xs ml-2">→ {item.tooltip_text?.slice(0, 60)}</span>
            </p>
          )}
        />
      )}
    </div>
  );
}
