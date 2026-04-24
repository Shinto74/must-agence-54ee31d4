import TableEditor from "./TableEditor";

export default function PacksEditor() {
  return (
    <TableEditor
      table="packs"
      title="Packs & Tarifs"
      description="Offres affichées sur la page artiste"
      label="pack"
      initialRecord={{ number: "", name: "", subtitle: "", price: "", price_suffix: "HT", featured: false, badge: "", bonus: "", reassurance: "" }}
      fields={[
        { key: "number", label: "Numéro" },
        { key: "name", label: "Nom" },
        { key: "subtitle", label: "Sous-titre", type: "textarea" },
        { key: "price", label: "Prix" },
        { key: "price_suffix", label: "Suffixe prix" },
        { key: "badge", label: "Badge" },
        { key: "featured", label: "Mis en avant", type: "checkbox" },
        { key: "bonus", label: "Bonus" },
        { key: "reassurance", label: "Réassurance", type: "textarea" },
        { key: "display_order", label: "Ordre", type: "number" },
      ]}
      renderItem={(item) => (
        <p className="text-sm text-slate-900">
          {item.featured && "⭐ "}
          <strong>{item.name}</strong> <span className="text-slate-500">— {item.price} {item.price_suffix}</span>
        </p>
      )}
    />
  );
}
