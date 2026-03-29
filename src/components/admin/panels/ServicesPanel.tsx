import { useState } from "react";
import { useAdminCrud } from "../useAdminCrud";
import AdminField from "../AdminField";
import AdminList from "../AdminList";
import AdminForm from "../AdminForm";

type Pole = "artiste" | "entreprise";

export default function ServicesPanel() {
  const [pole, setPole] = useState<Pole>("artiste");

  const table = pole === "artiste" ? "services_artiste" : "services_entreprise";
  const chipsTable = pole === "artiste" ? "service_artiste_chips" : "service_entreprise_chips";

  const services = useAdminCrud(table);
  const chips = useAdminCrud(chipsTable);

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const getChips = (svcId: string) => chips.data.filter((c: any) => c.service_id === svcId);

  return (
    <div className="space-y-6">
      {/* Pole switch */}
      <div className="flex gap-2">
        {(["artiste", "entreprise"] as Pole[]).map((p) => (
          <button
            key={p}
            onClick={() => { setPole(p); setSelectedServiceId(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-mono capitalize transition-all ${
              pole === p ? "bg-primary text-primary-foreground" : "bg-surface border border-border text-muted-foreground"
            }`}
          >
            Pôle {p}
          </button>
        ))}
      </div>

      <AdminList
        items={services.data}
        isLoading={services.isLoading}
        label="service"
        onAdd={() => services.setEditing({ number: "", title: "", description: "", display_order: services.data.length } as any)}
        onEdit={(item) => services.setEditing(item)}
        onDelete={services.remove}
        renderItem={(item) => (
          <div className="flex items-center justify-between w-full">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{item.number}. {item.title}</p>
              <p className="text-xs text-muted-foreground truncate">{item.description}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedServiceId(selectedServiceId === item.id ? null : item.id); }}
              className="text-xs text-primary font-mono hover:underline shrink-0 ml-2"
            >
              {getChips(item.id).length} chips
            </button>
          </div>
        )}
      />
      {services.editing && (
        <AdminForm onSave={() => services.save(services.editing!)} onCancel={() => services.setEditing(null)} saving={services.saving}>
          <AdminField label="number" value={services.editing.number} onChange={(v) => services.setEditing({ ...services.editing!, number: v })} />
          <AdminField label="title" value={services.editing.title} onChange={(v) => services.setEditing({ ...services.editing!, title: v })} />
          <AdminField label="description" type="textarea" value={services.editing.description} onChange={(v) => services.setEditing({ ...services.editing!, description: v })} />
          <AdminField label="display_order" value={services.editing.display_order} onChange={(v) => services.setEditing({ ...services.editing!, display_order: parseInt(v) || 0 })} />
        </AdminForm>
      )}

      {/* Chips inline */}
      {selectedServiceId && (
        <div className="border border-primary/20 rounded-xl p-4 bg-primary/5">
          <h3 className="font-clash text-base font-bold text-foreground mb-3">
            Chips du service : {services.data.find((s: any) => s.id === selectedServiceId)?.title}
          </h3>
          <AdminList
            items={getChips(selectedServiceId)}
            isLoading={chips.isLoading}
            label="chip"
            onAdd={() => chips.setEditing({ text: "", service_id: selectedServiceId, display_order: getChips(selectedServiceId).length } as any)}
            onEdit={(item) => chips.setEditing(item)}
            onDelete={chips.remove}
            renderItem={(item) => <p className="text-sm text-foreground">{item.text}</p>}
          />
          {chips.editing && (
            <AdminForm onSave={() => chips.save(chips.editing!)} onCancel={() => chips.setEditing(null)} saving={chips.saving}>
              <AdminField label="text" value={chips.editing.text} onChange={(v) => chips.setEditing({ ...chips.editing!, text: v })} />
              <AdminField label="display_order" value={chips.editing.display_order} onChange={(v) => chips.setEditing({ ...chips.editing!, display_order: parseInt(v) || 0 })} />
            </AdminForm>
          )}
        </div>
      )}
    </div>
  );
}
