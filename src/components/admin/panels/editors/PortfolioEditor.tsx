import TableEditor from "./TableEditor";

export default function PortfolioEditor() {
  return (
    <TableEditor
      table="portfolio_cases"
      title="Portfolio"
      description="Cas mis en avant sur la page d'accueil"
      label="cas"
      initialRecord={{ title: "", tag: "", description: "", icon: "" }}
      fields={[
        { key: "title", label: "Titre" },
        { key: "tag", label: "Tag" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "icon", label: "Icône (emoji)" },
        { key: "display_order", label: "Ordre", type: "number" },
      ]}
      renderItem={(item) => (
        <p className="text-sm text-slate-900">
          {item.icon} <strong>{item.title}</strong> <span className="text-slate-500">— {item.tag}</span>
        </p>
      )}
    />
  );
}
