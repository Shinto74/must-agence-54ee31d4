import ImageUpload from "./ImageUpload";

interface Props {
  label: string;
  type?: "text" | "textarea" | "checkbox" | "image" | "video" | "media" | "select" | "number";
  value: any;
  onChange: (val: any) => void;
  options?: { label: string; value: string }[];
  placeholder?: string;
  imageFolder?: string;
  hint?: string;
  /** Optional English translation editor — renders an EN field below the FR one */
  translation?: { value: string; onChange: (v: string) => void };
}

function EnInput({ value, onChange, multiline }: { value: string; onChange: (v: string) => void; multiline?: boolean }) {
  const cls = "w-full rounded-lg border border-dashed border-indigo-200 bg-indigo-50/30 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";
  return (
    <div className="mt-2 flex gap-2 items-start">
      <span className="mt-2 inline-block w-7 shrink-0 text-[9px] font-mono font-bold text-indigo-500 uppercase">EN</span>
      {multiline ? (
        <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={3} placeholder="English translation…" className={`${cls} resize-none`} />
      ) : (
        <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="English translation…" className={cls} />
      )}
    </div>
  );
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
  featured: "⭐ Mis en avant",
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
  display_order: "Position",
};

const inputBase =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all";

export default function AdminField({ label, type = "text", value, onChange, options, placeholder, imageFolder, hint, translation }: Props) {
  const displayLabel = LABELS[label] || label;

  const Label = () => (
    <label className="block text-[11px] font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-semibold">
      {displayLabel}
    </label>
  );

  const Hint = () => (hint ? <p className="mt-1 text-[11px] text-slate-500">{hint}</p> : null);

  if (type === "image" || type === "video" || type === "media") {
    const accept = type === "video" ? "video" : type === "media" ? "any" : "image";
    return (
      <div>
        <Label />
        <ImageUpload value={value || ""} onChange={onChange} folder={imageFolder || "uploads"} accept={accept} />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={accept === "video" ? "Uploader ou coller une URL vidéo (.mp4)" : "Uploader ou coller une URL"}
          className={`mt-2 ${inputBase} text-xs`}
        />
        <Hint />
      </div>
    );
  }

  if (type === "checkbox") {
    // Vrai switch visuel — état "actif" très visible (vert + label coloré)
    const checked = !!value;
    return (
      <div>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`flex items-center gap-3 w-full p-3 rounded-lg border-2 transition-all text-left ${
            checked
              ? "border-emerald-400 bg-emerald-50"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <span
            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
              checked ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                checked ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </span>
          <span className={`text-sm font-medium ${checked ? "text-emerald-900" : "text-slate-700"}`}>
            {displayLabel}
          </span>
        </button>
        <Hint />
      </div>
    );
  }

  if (type === "select" && options) {
    return (
      <div>
        <Label />
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputBase} appearance-none cursor-pointer pr-8 bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%23475569%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22><polyline%20points=%226%209%2012%2015%2018%209%22></polyline></svg>')] bg-no-repeat`}
          style={{ backgroundPosition: "right 10px center", colorScheme: "light", color: "#0f172a", backgroundColor: "#ffffff" }}
        >
          <option value="" style={{ color: "#94a3b8", background: "#ffffff" }}>— Choisir —</option>
          {options.map((o) => (
            <option key={o.value} value={o.value} style={{ color: "#0f172a", background: "#ffffff" }}>{o.label}</option>
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
        {translation && <EnInput value={translation.value} onChange={translation.onChange} multiline />}
        <Hint />
      </div>
    );
  }

  if (type === "number") {
    return (
      <div>
        <Label />
        <input
          type="number"
          value={value ?? 0}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          placeholder={placeholder}
          className={inputBase}
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
      {translation && <EnInput value={translation.value} onChange={translation.onChange} />}
      <Hint />
    </div>
  );
}
