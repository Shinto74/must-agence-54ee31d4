import { useAdminCrud } from "../useAdminCrud";
import AdminField from "../AdminField";
import AdminList from "../AdminList";
import AdminForm from "../AdminForm";

export default function ArtistesPanel() {
  const categories = useAdminCrud("artist_categories");
  const artists = useAdminCrud("artists");

  const catOptions = categories.data.map((c: any) => ({ label: c.name, value: c.id }));

  const newCat = () => categories.setEditing({ name: "", slug: "", display_order: categories.data.length } as any);
  const newArtist = () => artists.setEditing({ name: "", image_url: "", category_id: "", display_order: artists.data.length } as any);

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
          onAdd={newCat}
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

      {/* Artists */}
      <div>
        <h3 className="font-clash text-lg font-bold text-foreground mb-3">Artistes</h3>
        <AdminList
          items={artists.data}
          isLoading={artists.isLoading}
          label="artiste"
          onAdd={newArtist}
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
    </div>
  );
}
