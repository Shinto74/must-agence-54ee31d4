import TableEditor from "./TableEditor";

export default function MarqueeEditor({ page, title, description }: { page: "home" | "artiste" | "entreprise"; title: string; description?: string }) {
  return (
    <TableEditor
      table="marquee_items"
      title={title}
      description={description}
      label="élément"
      filter={(r) => r.page === page}
      initialRecord={{ page, kind: "logo", text_value: "", image_url: "" }}
      fields={[
        { key: "kind", label: "Type", type: "select", options: [
          { label: "Logo (image)", value: "logo" },
          { label: "Mot / texte", value: "word" },
        ]},
        { key: "text_value", label: "Texte / Nom de la marque", hint: "Si rempli, le nom s'affiche à côté du logo dans le bandeau (utile quand le logo est une icône seule sans wordmark). Laissez vide si le logo contient déjà le nom." },
        { key: "image_url", label: "Image / logo", type: "image", imageFolder: "marquee", hint: "Uniquement si Type = Logo." },
        { key: "display_order", label: "Ordre", type: "number" },
      ]}
      extraInvalidateKeys={[["marquee_items", page]]}
      renderItem={(item) => (
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono">{item.kind}</span>
          {item.image_url && <img src={item.image_url} alt="" className="h-6 max-w-[80px] object-contain bg-slate-900 rounded p-0.5" />}
          <p className="text-sm text-slate-900">{item.text_value || "—"}</p>
        </div>
      )}
    />
  );
}
