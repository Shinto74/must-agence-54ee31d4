import TableEditor from "./TableEditor";

export default function ExpertiseEntrepriseEditor() {
  return (
    <TableEditor
      table="expertise_entreprise"
      title="Piliers d'expertise — Entreprise"
      label="pilier"
      initialRecord={{ number: "01", title: "", text: "" }}
      fields={[
        { key: "number", label: "Numéro" },
        { key: "title", label: "Titre" },
        { key: "text", label: "Texte", type: "textarea" },
        { key: "display_order", label: "Ordre", type: "number" },
      ]}
      renderItem={(item) => <p className="text-sm text-slate-900"><span className="font-mono text-xs text-slate-400">{item.number}</span> <strong>{item.title}</strong></p>}
    />
  );
}
