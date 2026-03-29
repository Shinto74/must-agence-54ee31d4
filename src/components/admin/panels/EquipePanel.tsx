import { useAdminCrud } from "../useAdminCrud";
import AdminField from "../AdminField";
import AdminList from "../AdminList";
import AdminForm from "../AdminForm";

export default function EquipePanel() {
  const crud = useAdminCrud("team_members");

  const newItem = () =>
    crud.setEditing({
      name: "", initials: "", role: "", description: "", image_url: "",
      display_order: crud.data.length,
    } as any);

  return (
    <div>
      <AdminList
        items={crud.data}
        isLoading={crud.isLoading}
        label="membre"
        onAdd={newItem}
        onEdit={(item) => crud.setEditing(item)}
        onDelete={crud.remove}
        renderItem={(item) => (
          <div className="flex items-center gap-3">
            {item.image_url && (
              <img src={item.image_url} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
            )}
            {!item.image_url && item.initials && (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                {item.initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground truncate">{item.role}</p>
            </div>
          </div>
        )}
      />

      {crud.editing && (
        <AdminForm onSave={() => crud.save(crud.editing!)} onCancel={() => crud.setEditing(null)} saving={crud.saving}>
          <AdminField label="name" value={crud.editing.name} onChange={(v) => crud.setEditing({ ...crud.editing!, name: v })} />
          <AdminField label="initials" value={crud.editing.initials} onChange={(v) => crud.setEditing({ ...crud.editing!, initials: v })} />
          <AdminField label="role" value={crud.editing.role} onChange={(v) => crud.setEditing({ ...crud.editing!, role: v })} />
          <AdminField label="description" type="textarea" value={crud.editing.description} onChange={(v) => crud.setEditing({ ...crud.editing!, description: v })} />
          <AdminField label="image_url" type="image" value={crud.editing.image_url} onChange={(v) => crud.setEditing({ ...crud.editing!, image_url: v })} imageFolder="team" />
          <AdminField label="display_order" value={crud.editing.display_order} onChange={(v) => crud.setEditing({ ...crud.editing!, display_order: parseInt(v) || 0 })} />
        </AdminForm>
      )}
    </div>
  );
}
