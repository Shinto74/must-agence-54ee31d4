import TableEditor from "./TableEditor";
import TabbedEditor from "./TabbedEditor";
import ArtistGalleryEditor from "./ArtistGalleryEditor";
import { useAdminCrud } from "../../useAdminCrud";

/**
 * Éditeur Artistes — UX repensée :
 *   - Catégories en haut (table classique, simple).
 *   - Artistes en TabbedEditor : un onglet par artiste, formulaire toujours ouvert,
 *     avec galerie multi-images intégrée (plus de perte d'image quand on en change).
 */
export default function ArtistesEditor() {
  const cats = useAdminCrud("artist_categories");
  const catOptions = (cats.data as any[]).map((c) => ({ label: c.name, value: c.id }));

  return (
    <div className="space-y-5">
      <TableEditor
        table="artist_categories"
        title="Catégories d'artistes"
        label="catégorie"
        initialRecord={{ name: "", slug: "" }}
        fields={[
          { key: "name", label: "Nom" },
          { key: "slug", label: "Slug" },
          { key: "display_order", label: "Position", type: "number" },
        ]}
        renderItem={(item) => (
          <p className="text-sm text-slate-900">
            <strong>{item.name}</strong>{" "}
            <span className="text-slate-400 font-mono text-xs">/{item.slug}</span>
          </p>
        )}
      />

      <TabbedEditor
        table="artists"
        title="Artistes"
        description="Cliquez sur un artiste pour modifier sa fiche et gérer sa galerie photos."
        itemNoun="artiste"
        accentHue={73}
        initialRecord={{
          name: "Nouvel artiste",
          image_url: "",
          category_id: catOptions[0]?.value || "",
        }}
        fields={[
          { key: "name", label: "Nom" },
          { key: "category_id", label: "Catégorie", type: "select", options: catOptions },
          { key: "display_order", label: "Position", type: "number" },
        ]}
        renderTabLabel={(a) => a.name || "(sans nom)"}
        renderSubEditors={(artist) => (
          <ArtistGalleryEditor artistId={artist.id} currentImageUrl={artist.image_url || ""} />
        )}
      />
    </div>
  );
}
