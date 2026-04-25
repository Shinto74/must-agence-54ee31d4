import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import AdminField from "../../AdminField";
import AdminForm from "../../AdminForm";
import AdminList from "../../AdminList";
import { useAdminCrud } from "../../useAdminCrud";

/**
 * Éditeur des fiches détaillées d'artistes (popup au clic dans le carrousel).
 * Plateformes : array stocké en BDD, géré ici comme texte séparé par virgules.
 */
export default function ArtistDetailsEditor() {
  const { data: artists = [] } = useQuery({
    queryKey: ["admin_artists_lookup_details"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("id, name, display_order")
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
  });

  const [artistId, setArtistId] = useState<string>("");
  const activeArtistId = useMemo(
    () => artistId || artists[0]?.id || "",
    [artists, artistId]
  );

  const crud = useAdminCrud<any>("artist_details");
  const items = (crud.data as any[]).filter((d) => d.artist_id === activeArtistId);

  const startAdd = () => {
    crud.setEditing({
      artist_id: activeArtistId,
      strategie: "",
      description: "",
      chiffre: "",
      plateformes: [],
    });
  };

  const handleSave = () => {
    const e = crud.editing as any;
    // s'assurer que plateformes est bien un tableau
    const plateformes = Array.isArray(e.plateformes)
      ? e.plateformes
      : String(e.plateformes || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
    crud.save({ ...e, plateformes });
  };

  if (artists.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs text-slate-500">
          Aucun artiste dans la base. Ajoutez-en un dans Global › Sections partagées › Artistes.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <header className="mb-3">
          <h3 className="font-clash text-base font-bold text-slate-900">Fiches détaillées d'artistes</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Stratégie, description et plateformes affichées dans la popup au clic sur l'artiste.
          </p>
        </header>

        <p className="text-[11px] font-mono text-slate-600 uppercase tracking-wider mb-2 font-semibold">
          Artiste ciblé — cliquez pour éditer sa fiche
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((a, i) => {
            const isActive = a.id === activeArtistId;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setArtistId(a.id)}
                className={`text-left p-3 rounded-xl border-2 transition-all ${
                  isActive
                    ? "border-slate-900 bg-slate-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className={`text-sm leading-snug truncate ${isActive ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                    {a.name}
                  </p>
                </div>
                {isActive && (
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mt-1.5">
                    En cours d'édition ↓
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {activeArtistId && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <AdminList
            items={items}
            isLoading={crud.isLoading}
            label="fiche"
            onAdd={startAdd}
            onEdit={(item) => crud.setEditing(item as any)}
            onDelete={(id) => crud.remove(id)}
            renderItem={(item: any) => (
              <p className="text-sm text-slate-900">
                <strong>{item.strategie || "(sans titre)"}</strong>
                {item.chiffre && (
                  <span className="text-slate-400 text-xs ml-2">{item.chiffre}</span>
                )}
              </p>
            )}
          />

          {crud.editing && (
            <AdminForm onSave={handleSave} onCancel={() => crud.setEditing(null)} saving={crud.saving}>
              <AdminField
                label="Titre stratégie"
                value={(crud.editing as any).strategie}
                onChange={(v) => crud.setEditing({ ...(crud.editing as any), strategie: v })}
                placeholder="Direction Artistique & Lancement Album"
              />
              <AdminField
                label="Description"
                type="textarea"
                value={(crud.editing as any).description}
                onChange={(v) => crud.setEditing({ ...(crud.editing as any), description: v })}
              />
              <AdminField
                label="Chiffre clé (optionnel)"
                value={(crud.editing as any).chiffre}
                onChange={(v) => crud.setEditing({ ...(crud.editing as any), chiffre: v })}
                placeholder="+20M streams"
              />
              <AdminField
                label="Plateformes (séparées par virgules)"
                value={
                  Array.isArray((crud.editing as any).plateformes)
                    ? (crud.editing as any).plateformes.join(", ")
                    : (crud.editing as any).plateformes || ""
                }
                onChange={(v) => crud.setEditing({ ...(crud.editing as any), plateformes: v })}
                placeholder="Spotify, YouTube, TikTok"
                hint="Ces étiquettes apparaissent en bas de la popup."
              />
            </AdminForm>
          )}
        </section>
      )}
    </div>
  );
}
