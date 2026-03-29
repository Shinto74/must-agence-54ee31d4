import { useAdminCrud } from "../useAdminCrud";
import AdminField from "../AdminField";
import AdminList from "../AdminList";
import AdminForm from "../AdminForm";
import { Eye } from "lucide-react";

export default function ArtistesPanel() {
  const categories = useAdminCrud("artist_categories");
  const artists = useAdminCrud("artists");

  const catOptions = categories.data.map((c: any) => ({ label: c.name, value: c.id }));
  const getCatName = (id: string) => categories.data.find((c: any) => c.id === id)?.name || "—";

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-clash text-lg font-bold text-foreground mb-3">Catégories</h3>
        <AdminList
          items={categories.data}
          isLoading={categories.isLoading}
          label="catégorie"
          onAdd={() => categories.setEditing({ name: "", slug: "", display_order: categories.data.length } as any)}
          onEdit={(item) => categories.setEditing(item)}
          onDelete={categories.remove}
          renderItem={(item) => (
            <div>
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.slug}</p>
            </div>
          )}
        />
        {categories.editing && (
          <AdminForm onSave={() => categories.save(categories.editing!)} onCancel={() => categories.setEditing(null)} saving={categories.saving}>
            <AdminField label="name" value={categories.editing.name} onChange={(v) => categories.setEditing({ ...categories.editing!, name: v })} />
            <AdminField label="slug" value={categories.editing.slug} onChange={(v) => categories.setEditing({ ...categories.editing!, slug: v })} />
            <AdminField label="display_order" value={categories.editing.display_order} onChange={(v) => categories.setEditing({ ...categories.editing!, display_order: parseInt(v) || 0 })} />
          </AdminForm>
        )}
      </div>

      {/* Artists with visual preview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <h3 className="font-clash text-lg font-bold text-foreground mb-3">Artistes</h3>
          <AdminList
            items={artists.data}
            isLoading={artists.isLoading}
            label="artiste"
            onAdd={() => artists.setEditing({ name: "", image_url: "", category_id: "", display_order: artists.data.length } as any)}
            onEdit={(item) => artists.setEditing(item)}
            onDelete={artists.remove}
            renderItem={(item) => (
              <div className="flex items-center gap-3">
                {item.image_url && <img src={item.image_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{getCatName(item.category_id)}</p>
                </div>
              </div>
            )}
          />
          {artists.editing && (
            <AdminForm onSave={() => artists.save(artists.editing!)} onCancel={() => artists.setEditing(null)} saving={artists.saving}>
              <AdminField label="name" value={artists.editing.name} onChange={(v) => artists.setEditing({ ...artists.editing!, name: v })} />
              <AdminField label="category_id" type="select" options={catOptions} value={artists.editing.category_id} onChange={(v) => artists.setEditing({ ...artists.editing!, category_id: v })} />
              <AdminField label="image_url" type="image" value={artists.editing.image_url} onChange={(v) => artists.setEditing({ ...artists.editing!, image_url: v })} imageFolder="artistes" />
              <AdminField label="display_order" value={artists.editing.display_order} onChange={(v) => artists.setEditing({ ...artists.editing!, display_order: parseInt(v) || 0 })} />
            </AdminForm>
          )}
        </div>

        {/* Live preview */}
        {artists.editing && (
          <div className="hidden xl:block sticky top-8">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground font-mono uppercase">
              <Eye size={14} /> Aperçu carte artiste
            </div>
            <div className="bg-[#0A0A0A] rounded-xl overflow-hidden border border-border max-w-[280px]">
              {artists.editing.image_url ? (
                <img src={artists.editing.image_url} alt="" className="w-full aspect-[3/4] object-cover" />
              ) : (
                <div className="w-full aspect-[3/4] bg-gray-800 flex items-center justify-center text-gray-500">
                  <span className="text-sm font-mono">Aucune image</span>
                </div>
              )}
              <div className="p-4">
                <h4 className="text-white font-bold">{artists.editing.name || "Nom de l'artiste"}</h4>
                <p className="text-[#CCFF00] text-xs font-mono mt-1">
                  {getCatName(artists.editing.category_id)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
