import TableEditor from "./TableEditor";

export default function ClipPortugalEditor() {
  return (
    <TableEditor
      table="clip_portugal_advantages"
      title="Clip Portugal — Avantages"
      label="avantage"
      initialRecord={{ title: "", description: "", icon: "" }}
      fields={[
        { key: "icon", label: "Icône (emoji)" },
        { key: "title", label: "Titre" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "display_order", label: "Ordre", type: "number" },
      ]}
      renderItem={(item) => <p className="text-sm text-slate-900">{item.icon} <strong>{item.title}</strong></p>}
    />
  );
}
