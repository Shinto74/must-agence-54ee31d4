import TableEditor from "./TableEditor";

export default function ProcessEntrepriseEditor() {
  return (
    <TableEditor
      table="process_entreprise"
      title="Étapes du process — Entreprise"
      description="Le numéro affiché est généré automatiquement selon la position."
      label="étape"
      initialRecord={{ title: "", text: "" }}
      fields={[
        { key: "title", label: "Titre" },
        { key: "text", label: "Texte", type: "textarea" },
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
