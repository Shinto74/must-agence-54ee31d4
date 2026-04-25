import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TableEditor from "./TableEditor";
import { useMemo, useState } from "react";

/**
 * Éditeur des puces (gauche & droite) attachées à chaque pilier.
 */
export default function PillarItemsEditor() {
  const { data: pillars = [] } = useQuery({
    queryKey: ["admin_artist_pillars_lookup"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artist_pillars")
        .select("id, statement, display_order")
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
  });

  const [pillarId, setPillarId] = useState<string>("");
  const selectedPillar = useMemo(
    () => pillars.find((p) => p.id === pillarId) || pillars[0],
    [pillars, pillarId]
  );
  const activePillarId = selectedPillar?.id;

  if (pillars.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs text-slate-500">
          Créez d'abord un pilier ci-dessus pour pouvoir ajouter ses puces.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Pilier ciblé
        </label>
        <select
          value={pillarId || activePillarId || ""}
          onChange={(e) => setPillarId(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
        >
          {pillars.map((p, i) => (
            <option key={p.id} value={p.id}>
              {String(i + 1).padStart(2, "0")} — {p.statement?.slice(0, 50) || "(sans titre)"}
            </option>
          ))}
        </select>
      </section>

      {activePillarId && (
        <>
          <TableEditor
            table="pillar_left_items"
            title="Puces colonne gauche (bénéfices)"
            description="Liste des bénéfices affichés à gauche pour ce pilier."
            label="puce"
            initialRecord={{ pillar_id: activePillarId, text: "" }}
            filter={(row: any) => row.pillar_id === activePillarId}
            fields={[
              { key: "text", label: "Texte" },
              { key: "display_order", label: "Position", type: "number" },
            ]}
            renderItem={(item: any) => (
              <p className="text-sm text-slate-900">{item.text}</p>
            )}
          />

          <TableEditor
            table="pillar_right_items"
            title="Puces colonne droite (déploiements)"
            description="Liste des actions déployées affichées à droite pour ce pilier."
            label="puce"
            initialRecord={{ pillar_id: activePillarId, text: "" }}
            filter={(row: any) => row.pillar_id === activePillarId}
            fields={[
              { key: "text", label: "Texte" },
              { key: "display_order", label: "Position", type: "number" },
            ]}
            renderItem={(item: any) => (
              <p className="text-sm text-slate-900">{item.text}</p>
            )}
          />
        </>
      )}
    </div>
  );
}
