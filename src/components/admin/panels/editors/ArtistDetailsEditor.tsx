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
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <header className="mb-3">
          <h3 className="font-clash text-base font-bold text-slate-900">Fiches détaillées d'artistes</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Stratégie, description et plateformes affichées dans la popup au clic sur l'artiste.
          </p>
        </header>

        <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1.5 font-medium">
          Artiste ciblé
        </label>
        <select
          value={activeArtistId}
          onChange={(e) => setArtistId(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
        >
          {artists.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
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
