import TableEditor from "./TableEditor";
import MediaGalleryEditor from "./MediaGalleryEditor";

export default function SectorsEditor() {
  return (
    <TableEditor
      table="entreprise_sectors"
      title="Secteurs d'expertise"
      description="Cards affichées dans l'orbite 3D côté entreprise"
      label="secteur"
      initialRecord={{ name: "", description: "", icon: "", image_url: "" }}
      fields={[
        { key: "name", label: "Nom" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "icon", label: "Icône (emoji)" },
        { key: "image_url", label: "Image active", type: "image", imageFolder: "sectors" },
        { key: "display_order", label: "Ordre", type: "number" },
      ]}
      renderItem={(item) => (
        <div className="flex items-center gap-2.5">
          {item.image_url && <img src={item.image_url} alt="" className="w-10 h-10 rounded object-cover" />}
          <p className="text-sm text-slate-900">{item.icon} <strong>{item.name}</strong></p>
        </div>
      )}
      renderExtra={(row) => (
        <MediaGalleryEditor
          ownerTable="entreprise_sectors"
          ownerId={row.id}
          currentUrl={row.image_url || ""}
          mode="row"
          targetTable="entreprise_sectors"
          targetColumn="image_url"
          folder="sectors"
          title="Galerie d'images"
          helper="Garde plusieurs visuels en réserve. Clique sur une vignette pour la définir comme image affichée."
          aspect="landscape"
          invalidateKeys={[["admin_entreprise_sectors"], ["entreprise_sectors"]]}
        />
      )}
    />
  );
}
