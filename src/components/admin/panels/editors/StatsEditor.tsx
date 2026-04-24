import TableEditor from "./TableEditor";

export default function StatsEditor({ page, title, description }: { page: "home" | "artiste" | "entreprise"; title: string; description?: string }) {
  return (
    <TableEditor
      table="stats"
      title={title}
      description={description}
      label="statistique"
      filter={(r) => r.page === page}
      initialRecord={{ page, value: "", suffix: "", label: "" }}
      fields={[
        { key: "value", label: "Valeur" },
        { key: "suffix", label: "Suffixe" },
        { key: "label", label: "Libellé" },
        { key: "display_order", label: "Ordre", type: "number" },
      ]}
      renderItem={(item) => (
        <p className="text-sm text-slate-900">
          <strong>{item.value}{item.suffix}</strong> <span className="text-slate-500">— {item.label}</span>
        </p>
      )}
    />
  );
}
