import TableEditor from "./TableEditor";
import { useAdminCrud } from "../../useAdminCrud";

export default function ArtistesEditor() {
  const cats = useAdminCrud("artist_categories");
  const catOptions = (cats.data as any[]).map((c) => ({ label: c.name, value: c.id }));
  const getCatName = (id: string) => (cats.data as any[]).find((c) => c.id === id)?.name || "—";

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
          { key: "display_order", label: "Ordre", type: "number" },
        ]}
        renderItem={(item) => <p className="text-sm text-slate-900"><strong>{item.name}</strong> <span className="text-slate-400 font-mono text-xs">/{item.slug}</span></p>}
      />

      <TableEditor
        table="artists"
        title="Artistes"
        description="Profils affichés dans le carrousel des références artistes"
        label="artiste"
        initialRecord={{ name: "", image_url: "", category_id: catOptions[0]?.value || "" }}
        fields={[
          { key: "name", label: "Nom" },
          { key: "image_url", label: "Photo", type: "image", imageFolder: "artistes" },
          { key: "category_id", label: "Catégorie", type: "select", options: catOptions },
          { key: "display_order", label: "Ordre", type: "number" },
        ]}
        renderItem={(item) => (
          <div className="flex items-center gap-2.5">
            {item.image_url && <img src={item.image_url} alt="" className="w-8 h-10 rounded object-cover" />}
            <p className="text-sm text-slate-900">
              <strong>{item.name}</strong>{" "}
              <span className="text-indigo-600 text-xs">{getCatName(item.category_id)}</span>
            </p>
          </div>
        )}
      />
    </div>
  );
}
