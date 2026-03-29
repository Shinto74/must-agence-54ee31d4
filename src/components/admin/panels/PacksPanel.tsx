import { useState } from "react";
import { useAdminCrud } from "../useAdminCrud";
import AdminField from "../AdminField";
import AdminList from "../AdminList";
import AdminForm from "../AdminForm";

export default function PacksPanel() {
  const packs = useAdminCrud("packs");
  const features = useAdminCrud("pack_features");

  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);

  const getFeatures = (packId: string) => features.data.filter((f: any) => f.pack_id === packId);

  return (
    <div className="space-y-8">
      <div>
        <AdminList
          items={packs.data}
          isLoading={packs.isLoading}
          label="pack"
          onAdd={() => packs.setEditing({
            number: "", name: "", subtitle: "", price: "", price_suffix: "HT",
            featured: false, badge: "", bonus: "", reassurance: "", display_order: packs.data.length,
          } as any)}
          onEdit={(item) => packs.setEditing(item)}
          onDelete={packs.remove}
          renderItem={(item) => (
            <div className="flex items-center justify-between w-full">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.price} {item.price_suffix}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedPackId(selectedPackId === item.id ? null : item.id); }}
                className="text-xs text-primary font-mono hover:underline shrink-0 ml-2"
              >
                {getFeatures(item.id).length} features
              </button>
            </div>
          )}
        />
        {packs.editing && (
          <AdminForm onSave={() => packs.save(packs.editing!)} onCancel={() => packs.setEditing(null)} saving={packs.saving}>
            <div className="grid grid-cols-2 gap-3">
              <AdminField label="number" value={packs.editing.number} onChange={(v) => packs.setEditing({ ...packs.editing!, number: v })} />
              <AdminField label="name" value={packs.editing.name} onChange={(v) => packs.setEditing({ ...packs.editing!, name: v })} />
            </div>
            <AdminField label="subtitle" type="textarea" value={packs.editing.subtitle} onChange={(v) => packs.setEditing({ ...packs.editing!, subtitle: v })} />
            <div className="grid grid-cols-2 gap-3">
              <AdminField label="price" value={packs.editing.price} onChange={(v) => packs.setEditing({ ...packs.editing!, price: v })} />
              <AdminField label="price_suffix" value={packs.editing.price_suffix} onChange={(v) => packs.setEditing({ ...packs.editing!, price_suffix: v })} />
            </div>
            <AdminField label="badge" value={packs.editing.badge} onChange={(v) => packs.setEditing({ ...packs.editing!, badge: v })} />
            <AdminField label="featured" type="checkbox" value={packs.editing.featured} onChange={(v) => packs.setEditing({ ...packs.editing!, featured: v })} />
            <AdminField label="bonus" type="textarea" value={packs.editing.bonus} onChange={(v) => packs.setEditing({ ...packs.editing!, bonus: v })} />
            <AdminField label="reassurance" type="textarea" value={packs.editing.reassurance} onChange={(v) => packs.setEditing({ ...packs.editing!, reassurance: v })} />
            <AdminField label="display_order" value={packs.editing.display_order} onChange={(v) => packs.setEditing({ ...packs.editing!, display_order: parseInt(v) || 0 })} />
          </AdminForm>
        )}
      </div>

      {/* Pack features inline */}
      {selectedPackId && (
        <div className="border border-primary/20 rounded-xl p-4 bg-primary/5">
          <h3 className="font-clash text-base font-bold text-foreground mb-3">
            Features du pack : {packs.data.find((p: any) => p.id === selectedPackId)?.name}
          </h3>
          <AdminList
            items={getFeatures(selectedPackId)}
            isLoading={features.isLoading}
            label="feature"
            onAdd={() => features.setEditing({ text: "", pack_id: selectedPackId, display_order: getFeatures(selectedPackId).length } as any)}
            onEdit={(item) => features.setEditing(item)}
            onDelete={features.remove}
            renderItem={(item) => <p className="text-sm text-foreground">{item.text}</p>}
          />
          {features.editing && (
            <AdminForm onSave={() => features.save(features.editing!)} onCancel={() => features.setEditing(null)} saving={features.saving}>
              <AdminField label="text" value={features.editing.text} onChange={(v) => features.setEditing({ ...features.editing!, text: v })} />
              <AdminField label="display_order" value={features.editing.display_order} onChange={(v) => features.setEditing({ ...features.editing!, display_order: parseInt(v) || 0 })} />
            </AdminForm>
          )}
        </div>
      )}
    </div>
  );
}
