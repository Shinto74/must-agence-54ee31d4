import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TableEditor from "./TableEditor";
import { useMemo, useState } from "react";

/**
 * Éditeur des fiches détaillées d'artistes (popup au clic dans le carrousel).
 * Plateformes : liste séparée par virgules.
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
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Artiste ciblé
        </label>
        <select
          value={activeArtistId}
          onChange={(e) => setArtistId(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
        >
          {artists.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <p className="text-[11px] text-slate-400 mt-2">
          Une fiche détaillée apparaît dans la popup quand on clique sur l'artiste.
        </p>
      </section>

      {activeArtistId && (
        <TableEditor
          table="artist_details"
          title="Fiche détaillée"
          description="Stratégie & description affichées dans la popup. Plateformes = mots séparés par virgules."
          label="fiche"
          idField="id"
          initialRecord={{ artist_id: activeArtistId, strategie: "", description: "", chiffre: "", plateformes: [] }}
          filter={(row: any) => row.artist_id === activeArtistId}
          fields={[
            { key: "strategie", label: "Titre stratégie", placeholder: "Direction Artistique & Lancement Album" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "chiffre", label: "Chiffre clé (optionnel)", placeholder: "+20M streams" },
            { key: "plateformes_text", label: "Plateformes (séparées par virgules)", placeholder: "Spotify, YouTube, TikTok" },
          ]}
          renderItem={(item: any) => (
            <p className="text-sm text-slate-900">
              <strong>{item.strategie || "(sans titre)"}</strong>
              {item.chiffre && <span className="text-slate-400 text-xs ml-2">{item.chiffre}</span>}
            </p>
          )}
        />
      )}
    </div>
  );
}
