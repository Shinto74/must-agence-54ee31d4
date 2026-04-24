import ImageUpload from "./ImageUpload";

interface Props {
  label: string;
  type?: "text" | "textarea" | "checkbox" | "image" | "select";
  value: any;
  onChange: (val: any) => void;
  options?: { label: string; value: string }[];
  placeholder?: string;
  imageFolder?: string;
  hint?: string;
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

const inputBase =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";

export default function AdminField({ label, type = "text", value, onChange, options, placeholder, imageFolder, hint }: Props) {
  const displayLabel = LABELS[label] || label;

  const Label = () => (
    <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1.5 font-medium">
      {displayLabel}
    </label>
  );

  const Hint = () => (hint ? <p className="mt-1 text-[11px] text-slate-400">{hint}</p> : null);

  if (type === "image") {
    return (
      <div>
        <Label />
        <ImageUpload value={value || ""} onChange={onChange} folder={imageFolder || "uploads"} />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Uploader ou coller une URL"
          className={`mt-2 ${inputBase} text-xs`}
        />
        <Hint />
      </div>
    );
  }

  if (type === "checkbox") {
    return (
      <label className="flex items-center gap-3 py-2 cursor-pointer group">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2 focus:ring-offset-0"
        />
        <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">{displayLabel}</span>
      </label>
    );
  }

  if (type === "select" && options) {
    return (
      <div>
        <Label />
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputBase}
        >
          <option value="">— Choisir —</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <Hint />
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div>
        <Label />
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${inputBase} resize-none`}
        />
        <Hint />
      </div>
    );
  }

  return (
    <div>
      <Label />
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputBase}
      />
      <Hint />
    </div>
  );
}
