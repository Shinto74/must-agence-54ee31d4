import TableEditor from "./TableEditor";

export default function PacksEditor() {
  return (
    <TableEditor
      table="packs"
      title="Packs & Tarifs"
      description="Le numéro de pack (Pack 1, 2…) est généré automatiquement selon la position."
      label="pack"
      initialRecord={{ name: "", subtitle: "", price: "", price_suffix: "HT", featured: false, badge: "", bonus: "", reassurance: "" }}
      fields={[
        { key: "name", label: "Nom" },
        { key: "subtitle", label: "Sous-titre", type: "textarea" },
        { key: "price", label: "Prix" },
        { key: "price_suffix", label: "Suffixe prix" },
        { key: "badge", label: "Badge" },
        { key: "featured", label: "Mis en avant", type: "checkbox" },
        { key: "bonus", label: "Bonus" },
        { key: "reassurance", label: "Réassurance", type: "textarea" },
        { key: "display_order", label: "Position", type: "number" },
      ]}
      renderItem={(item: any) => {
        const idx = (item.__index ?? 0) + 1;
        return (
          <p className="text-sm text-slate-900">
            <span className="font-mono text-xs text-slate-400">Pack {idx}</span>{" "}
            {item.featured && "⭐ "}
            <strong>{item.name}</strong>{" "}
            <span className="text-slate-500">— {item.price} {item.price_suffix}</span>
          </p>
        );
      }}
    />
  );
}
