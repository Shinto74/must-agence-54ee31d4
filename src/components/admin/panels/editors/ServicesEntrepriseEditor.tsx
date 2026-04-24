import TableEditor from "./TableEditor";

export default function ServicesEntrepriseEditor() {
  return (
    <TableEditor
      table="services_entreprise"
      title="Services Entreprise"
      label="service"
      initialRecord={{ number: "01", title: "", description: "" }}
      fields={[
        { key: "number", label: "Numéro" },
        { key: "title", label: "Titre" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "display_order", label: "Ordre", type: "number" },
      ]}
      renderItem={(item) => <p className="text-sm text-slate-900"><span className="font-mono text-xs text-slate-400">{item.number}</span> <strong>{item.title}</strong></p>}
    />
  );
}
