import ImageUpload from "./ImageUpload";

interface Props {
  label: string;
  type?: "text" | "textarea" | "checkbox" | "image" | "select";
  value: any;
  onChange: (val: any) => void;
  options?: { label: string; value: string }[];
  placeholder?: string;
  imageFolder?: string;
}

const LABELS: Record<string, string> = {
  name: "Nom",
  title: "Titre",
  description: "Description",
  role: "Rôle",
  initials: "Initiales",
  image_url: "Image",
  logo_url: "Logo",
  number: "Numéro",
  subtitle: "Sous-titre",
  price: "Prix",
  price_suffix: "Suffixe prix",
  featured: "Mis en avant",
  badge: "Badge",
  bonus: "Bonus",
  reassurance: "Réassurance",
  value: "Valeur",
  label: "Label",
  suffix: "Suffixe",
  page: "Page",
  slug: "Slug",
  icon: "Icône",
  tag: "Tag",
  text: "Texte",
  key: "Clé",
  type: "Type",
  category_id: "Catégorie",
  display_order: "Ordre d'affichage",
};

export default function AdminField({ label, type = "text", value, onChange, options, placeholder, imageFolder }: Props) {
  const displayLabel = LABELS[label] || label;

  if (type === "image") {
    return (
      <div>
        <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">{displayLabel}</label>
        <ImageUpload value={value || ""} onChange={onChange} folder={imageFolder || "uploads"} />
        {value && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ou collez une URL"
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground focus:outline-none focus:border-primary/40"
          />
        )}
      </div>
    );
  }

  if (type === "checkbox") {
    return (
      <label className="flex items-center gap-3 py-2 cursor-pointer">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-border accent-primary"
        />
        <span className="text-sm text-foreground">{displayLabel}</span>
      </label>
    );
  }

  if (type === "select" && options) {
    return (
      <div>
        <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">{displayLabel}</label>
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40"
        >
          <option value="">— Choisir —</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div>
        <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">{displayLabel}</label>
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40 resize-none"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">{displayLabel}</label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40"
      />
    </div>
  );
}
