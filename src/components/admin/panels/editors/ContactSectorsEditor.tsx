import TableEditor from "./TableEditor";

/**
 * Éditeur des secteurs proposés dans le formulaire de contact (modale globale).
 * Affichés dans le menu déroulant "Secteur" — utilisés sur toutes les pages.
 */
export default function ContactSectorsEditor() {
  return (
    <TableEditor
      table="contact_sectors"
      title="Secteurs (formulaire de contact)"
      description="Options du menu déroulant 'Secteur' dans le formulaire de contact global."
      label="secteur"
      initialRecord={{ name: "", display_order: 0 }}
      fields={[
        { key: "name", label: "Nom du secteur" },
        { key: "display_order", label: "Position", type: "number" },
      ]}
      renderItem={(item: any) => (
        <p className="text-sm text-slate-900">{item.name}</p>
      )}
    />
  );
}
