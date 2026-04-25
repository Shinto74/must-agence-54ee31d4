import TableEditor from "./TableEditor";

export default function ServicesArtisteEditor() {
  return (
    <TableEditor
      table="services_artiste"
      title="Services Artiste"
      description="Le numéro affiché (01, 02…) est généré automatiquement selon la position."
      label="service"
      initialRecord={{ title: "", description: "" }}
      fields={[
        { key: "title", label: "Titre" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "display_order", label: "Position", type: "number" },
      ]}
      renderItem={(item: any) => {
        const idx = (item.__index ?? 0) + 1;
        const num = String(idx).padStart(2, "0");
        return (
          <p className="text-sm text-slate-900">
            <span className="font-mono text-xs text-slate-400">{num}</span>{" "}
            <strong>{item.title}</strong>
          </p>
        );
      }}
    />
  );
}
