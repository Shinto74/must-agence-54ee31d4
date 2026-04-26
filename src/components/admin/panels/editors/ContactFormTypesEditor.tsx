import TableEditor from "./TableEditor";

interface Props {
  page: "artiste" | "entreprise";
}

/**
 * Éditeur des types de demande proposés dans le formulaire de contact.
 * Distincts par page (artiste / entreprise).
 */
export default function ContactFormTypesEditor({ page }: Props) {
  return (
    <TableEditor
      table="contact_form_types"
      title="Types de demande (formulaire de contact)"
      description={`Boutons de type de projet affichés dans le formulaire de contact de la page ${page === "artiste" ? "Artiste" : "Entreprise"}.`}
      label="type"
      filter={{ column: "page", value: page }}
      initialRecord={{ page, label: "", display_order: 0 }}
      fields={[
        { key: "label", label: "Libellé" },
        { key: "display_order", label: "Position", type: "number" },
      ]}
      renderItem={(item: any) => (
        <p className="text-sm text-slate-900">{item.label}</p>
      )}
    />
  );
}
