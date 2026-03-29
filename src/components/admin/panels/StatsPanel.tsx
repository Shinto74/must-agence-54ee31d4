import { useAdminCrud } from "../useAdminCrud";
import AdminField from "../AdminField";
import AdminList from "../AdminList";
import AdminForm from "../AdminForm";

const PAGE_OPTIONS = [
  { label: "Accueil", value: "home" },
  { label: "Artiste", value: "artiste" },
  { label: "Entreprise", value: "entreprise" },
];

export default function StatsPanel() {
  const crud = useAdminCrud("stats");

  return (
    <div>
      <AdminList
        items={crud.data}
        isLoading={crud.isLoading}
        label="statistique"
        onAdd={() => crud.setEditing({ page: "home", value: "", label: "", suffix: "", display_order: crud.data.length } as any)}
        onEdit={(item) => crud.setEditing(item)}
        onDelete={crud.remove}
        renderItem={(item) => (
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-mono shrink-0">{item.page}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{item.value}{item.suffix}</p>
              <p className="text-xs text-muted-foreground truncate">{item.label}</p>
            </div>
          </div>
        )}
      />
      {crud.editing && (
        <AdminForm onSave={() => crud.save(crud.editing!)} onCancel={() => crud.setEditing(null)} saving={crud.saving}>
          <AdminField label="page" type="select" options={PAGE_OPTIONS} value={crud.editing.page} onChange={(v) => crud.setEditing({ ...crud.editing!, page: v })} />
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="value" value={crud.editing.value} onChange={(v) => crud.setEditing({ ...crud.editing!, value: v })} />
            <AdminField label="suffix" value={crud.editing.suffix} onChange={(v) => crud.setEditing({ ...crud.editing!, suffix: v })} />
          </div>
          <AdminField label="label" value={crud.editing.label} onChange={(v) => crud.setEditing({ ...crud.editing!, label: v })} />
          <AdminField label="display_order" value={crud.editing.display_order} onChange={(v) => crud.setEditing({ ...crud.editing!, display_order: parseInt(v) || 0 })} />
        </AdminForm>
      )}
    </div>
  );
}
