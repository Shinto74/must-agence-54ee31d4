import { useAdminCrud } from "../useAdminCrud";
import AdminField from "../AdminField";
import AdminList from "../AdminList";
import AdminForm from "../AdminForm";

export default function ClientsPanel() {
  const categories = useAdminCrud("client_categories");
  const clients = useAdminCrud("clients");

  const catOptions = categories.data.map((c: any) => ({ label: c.name, value: c.id }));
  const getCatName = (id: string) => categories.data.find((c: any) => c.id === id)?.name || "—";

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-clash text-lg font-bold text-foreground mb-3">Catégories</h3>
        <AdminList
          items={categories.data}
          isLoading={categories.isLoading}
          label="catégorie"
          onAdd={() => categories.setEditing({ name: "", display_order: categories.data.length } as any)}
          onEdit={(item) => categories.setEditing(item)}
          onDelete={categories.remove}
          renderItem={(item) => <p className="text-sm font-medium text-foreground">{item.name}</p>}
        />
        {categories.editing && (
          <AdminForm onSave={() => categories.save(categories.editing!)} onCancel={() => categories.setEditing(null)} saving={categories.saving}>
            <AdminField label="name" value={categories.editing.name} onChange={(v) => categories.setEditing({ ...categories.editing!, name: v })} />
            <AdminField label="display_order" value={categories.editing.display_order} onChange={(v) => categories.setEditing({ ...categories.editing!, display_order: parseInt(v) || 0 })} />
          </AdminForm>
        )}
      </div>

      <div>
        <h3 className="font-clash text-lg font-bold text-foreground mb-3">Clients</h3>
        <AdminList
          items={clients.data}
          isLoading={clients.isLoading}
          label="client"
          onAdd={() => clients.setEditing({ name: "", logo_url: "", category_id: "", display_order: clients.data.length } as any)}
          onEdit={(item) => clients.setEditing(item)}
          onDelete={clients.remove}
          renderItem={(item) => (
            <div className="flex items-center gap-3">
              {item.logo_url && <img src={item.logo_url} alt="" className="w-8 h-8 rounded object-contain bg-white/5 shrink-0" />}
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{getCatName(item.category_id)}</p>
              </div>
            </div>
          )}
        />
        {clients.editing && (
          <AdminForm onSave={() => clients.save(clients.editing!)} onCancel={() => clients.setEditing(null)} saving={clients.saving}>
            <AdminField label="name" value={clients.editing.name} onChange={(v) => clients.setEditing({ ...clients.editing!, name: v })} />
            <AdminField label="category_id" type="select" options={catOptions} value={clients.editing.category_id} onChange={(v) => clients.setEditing({ ...clients.editing!, category_id: v })} />
            <AdminField label="logo_url" type="image" value={clients.editing.logo_url} onChange={(v) => clients.setEditing({ ...clients.editing!, logo_url: v })} imageFolder="clients" />
            <AdminField label="display_order" value={clients.editing.display_order} onChange={(v) => clients.setEditing({ ...clients.editing!, display_order: parseInt(v) || 0 })} />
          </AdminForm>
        )}
      </div>
    </div>
  );
}
