import { useState } from "react";
import { useAdminCrud } from "../useAdminCrud";
import AdminField from "../AdminField";
import AdminList from "../AdminList";
import AdminForm from "../AdminForm";
import { Eye, Check } from "lucide-react";

export default function PacksPanel() {
  const packs = useAdminCrud("packs");
  const features = useAdminCrud("pack_features");

  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);

  const getFeatures = (packId: string) => features.data.filter((f: any) => f.pack_id === packId);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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

        {/* Live preview */}
        {packs.editing && (
          <div className="hidden xl:block sticky top-8">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground font-mono uppercase">
              <Eye size={14} /> Aperçu carte pack
            </div>
            <div className={`rounded-2xl p-6 border max-w-[320px] ${
              packs.editing.featured
                ? "bg-[#0A0A0A] border-[#CCFF00]/30 shadow-[0_0_30px_-10px_rgba(204,255,0,0.3)]"
                : "bg-[#0A0A0A] border-gray-800"
            }`}>
              {packs.editing.badge && (
                <span className="inline-block px-3 py-1 rounded-full bg-[#CCFF00]/10 text-[#CCFF00] text-[10px] font-mono uppercase mb-3">
                  {packs.editing.badge}
                </span>
              )}
              <p className="text-gray-500 text-xs font-mono">{packs.editing.number}</p>
              <h3 className="text-white text-xl font-bold mt-1">{packs.editing.name || "Nom du pack"}</h3>
              <p className="text-gray-400 text-sm mt-1">{packs.editing.subtitle}</p>
              <div className="mt-4">
                <span className="text-[#CCFF00] text-3xl font-bold">{packs.editing.price || "—"}</span>
                <span className="text-gray-500 text-sm ml-1">{packs.editing.price_suffix}</span>
              </div>
              <div className="mt-4 space-y-2">
                {getFeatures(packs.editing.id || "").map((f: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={14} className="text-[#CCFF00] shrink-0" /> {f.text}
                  </div>
                ))}
              </div>
              {packs.editing.bonus && (
                <p className="mt-4 text-xs text-[#CCFF00]/60 italic">🎁 {packs.editing.bonus}</p>
              )}
              {packs.editing.reassurance && (
                <p className="mt-2 text-xs text-gray-500">{packs.editing.reassurance}</p>
              )}
            </div>
          </div>
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
