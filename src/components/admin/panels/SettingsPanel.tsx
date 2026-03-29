import { useAdminCrud } from "../useAdminCrud";
import AdminField from "../AdminField";
import AdminList from "../AdminList";
import AdminForm from "../AdminForm";

const SETTING_GROUPS: Record<string, string> = {
  logo_white: "🎨 Logo blanc",
  logo_green: "🎨 Logo vert",
  contact_email: "📧 Email de contact",
  contact_phone: "📱 Téléphone / WhatsApp",
  social_instagram: "📸 Instagram",
  social_tiktok: "🎵 TikTok",
  social_linkedin: "💼 LinkedIn",
  hero_title_line1: "🏠 Héro — Ligne 1",
  hero_title_accent: "🏠 Héro — Accent",
  hero_subtitle: "🏠 Héro — Sous-titre",
  vision_quote: "👁️ Vision — Citation",
  vision_text: "👁️ Vision — Texte",
  cta_title: "📢 CTA — Titre",
  cta_subtitle: "📢 CTA — Sous-titre",
};

export default function SettingsPanel() {
  const crud = useAdminCrud("site_settings", { idField: "key", orderBy: "key" });

  const getLabel = (key: string) => SETTING_GROUPS[key] || key;
  const isImage = (item: any) => item.type === "image" || item.key?.startsWith("logo_");

  return (
    <div>
      <AdminList
        items={crud.data}
        isLoading={crud.isLoading}
        label="paramètre"
        onAdd={() => crud.setEditing({ key: "", value: "", type: "text" } as any)}
        onEdit={(item) => crud.setEditing(item)}
        onDelete={(pkValue) => crud.remove(pkValue)}
        idField="key"
        renderItem={(item) => (
          <div className="flex items-center gap-3">
            {isImage(item) && item.value && (
              <img src={item.value} alt="" className="w-8 h-8 rounded object-contain bg-white/5 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{getLabel(item.key)}</p>
              <p className="text-xs text-muted-foreground truncate">{isImage(item) ? "Image" : item.value}</p>
            </div>
          </div>
        )}
      />
      {crud.editing && (
        <AdminForm onSave={() => crud.save(crud.editing!)} onCancel={() => crud.setEditing(null)} saving={crud.saving}>
          <AdminField label="key" value={crud.editing.key} onChange={(v) => crud.setEditing({ ...crud.editing!, key: v })} />
          <AdminField
            label="type"
            type="select"
            options={[{ label: "Texte", value: "text" }, { label: "Image", value: "image" }, { label: "URL", value: "url" }]}
            value={crud.editing.type}
            onChange={(v) => crud.setEditing({ ...crud.editing!, type: v })}
          />
          {isImage(crud.editing) ? (
            <AdminField label="value" type="image" value={crud.editing.value} onChange={(v) => crud.setEditing({ ...crud.editing!, value: v })} imageFolder="settings" />
          ) : (
            <AdminField
              label="value"
              type={crud.editing.value?.length > 80 ? "textarea" : "text"}
              value={crud.editing.value}
              onChange={(v) => crud.setEditing({ ...crud.editing!, value: v })}
            />
          )}
        </AdminForm>
      )}
    </div>
  );
}
