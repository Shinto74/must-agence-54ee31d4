import TableEditor from "./TableEditor";
import ServiceChipsEditor from "./ServiceChipsEditor";

export default function ServicesEntrepriseEditor() {
  return (
    <TableEditor
      table="services_entreprise"
      title="Services Entreprise"
      description="Cartes affichées dans la section 'Ce qu'on fait pour vous'. Le numéro (01, 02…) est généré selon la position. L'icône peut être un nom Lucide (ex: Megaphone, Camera, Rocket) ou un emoji (ex: 🚀)."
      label="service"
      initialRecord={{ title: "", description: "", icon: "", number: "" }}
      fields={[
        { key: "title", label: "Titre" },
        { key: "description", label: "Description", type: "textarea" },
        {
          key: "icon",
          label: "Icône (nom Lucide ou emoji)",
          placeholder: "Ex : Megaphone, Camera, Rocket, ou 🚀",
          hint: "Liste des icônes disponibles : lucide.dev/icons",
        },
        { key: "number", label: "Numéro affiché (auto si vide)", placeholder: "01, 02…" },
        { key: "display_order", label: "Position", type: "number" },
      ]}
      renderItem={(item: any) => {
        const idx = (item.__index ?? 0) + 1;
        const num = item.number || String(idx).padStart(2, "0");
        return (
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs text-slate-400 w-6">{num}</span>
            {item.icon && (
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-amber-50 text-amber-700 text-xs">
                {item.icon.length <= 3 ? item.icon : "✦"}
              </span>
            )}
            <p className="text-sm text-slate-900">
              <strong>{item.title}</strong>
            </p>
          </div>
        );
      }}
      renderExtra={(row: any) => <ServiceChipsEditor serviceId={row.id} />}
    />
  );
}
