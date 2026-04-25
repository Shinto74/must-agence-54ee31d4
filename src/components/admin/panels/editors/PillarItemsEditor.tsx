import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TableEditor from "./TableEditor";
import { useMemo, useState, useEffect } from "react";
import { Layers } from "lucide-react";

/**
 * Éditeur des puces (gauche & droite) attachées à chaque pilier.
 * UX repensée : grille de chips cliquables au lieu d'un select tronqué.
 */
export default function PillarItemsEditor() {
  const { data: pillars = [] } = useQuery({
    queryKey: ["admin_artist_pillars_lookup"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artist_pillars")
        .select("id, statement, display_order, accent_hue")
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
  });

  const [pillarId, setPillarId] = useState<string>("");

  // Auto-select premier pilier dès qu'ils sont chargés
  useEffect(() => {
    if (!pillarId && pillars.length > 0) {
      setPillarId(pillars[0].id);
    }
  }, [pillars, pillarId]);

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
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            Sélectionner un pilier à éditer
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Cliquez sur un pilier ci-dessous pour gérer ses puces gauche/droite.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {pillars.map((p, i) => {
            const num = String(i + 1).padStart(2, "0");
            const isActive = p.id === activePillarId;
            const hue = p.accent_hue ?? 73;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPillarId(p.id)}
                className={`text-left p-3 rounded-xl border-2 transition-all ${
                  isActive
                    ? "border-slate-900 bg-slate-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="font-mono text-xs font-bold px-2 py-1 rounded-md shrink-0"
                    style={{
                      background: `hsla(${hue}, 70%, 50%, 0.15)`,
                      color: `hsl(${hue}, 60%, 30%)`,
                    }}
                  >
                    {num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${isActive ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                      {p.statement || "(sans titre)"}
                    </p>
                    {isActive && (
                      <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mt-1">
                        En cours d'édition ↓
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {activePillarId && (
        <div className="grid gap-4 lg:grid-cols-2">
          <TableEditor
            key={`left-${activePillarId}`}
            table="pillar_left_items"
            title="← Bénéfices (colonne gauche)"
            description={`Puces affichées à gauche du pilier "${selectedPillar?.statement?.slice(0, 40) || ""}…"`}
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
            key={`right-${activePillarId}`}
            table="pillar_right_items"
            title="Déploiements (colonne droite) →"
            description={`Puces affichées à droite du pilier "${selectedPillar?.statement?.slice(0, 40) || ""}…"`}
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
        </div>
      )}
    </div>
  );
}
