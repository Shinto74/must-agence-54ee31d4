import TabbedEditor from "./TabbedEditor";
import MediaGalleryEditor from "./MediaGalleryEditor";

export default function MarqueeEditor({ page, title, description }: { page: "home" | "artiste" | "entreprise"; title: string; description?: string }) {
  return (
    <TabbedEditor
      table="marquee_items"
      title={title}
      description={description || "Cliquez sur un élément pour modifier son contenu et gérer plusieurs versions de logo."}
      itemNoun="élément"
      accentHue={73}
      filter={(r) => r.page === page}
      initialRecord={{ page, kind: "logo", text_value: "", image_url: "", freeze_on_hover: false }}
      fields={[
        { key: "kind", label: "Type", type: "select", options: [
          { label: "Logo (image)", value: "logo" },
          { label: "Mot / texte", value: "word" },
        ]},
        { key: "text_value", label: "Texte / Nom de la marque", hint: "Si rempli, le nom s'affiche à côté du logo dans le bandeau (utile quand le logo est une icône seule sans wordmark). Laissez vide si le logo contient déjà le nom." },
        { key: "freeze_on_hover", label: "Figer au survol (logo blanc, aucune animation)", type: "checkbox", hint: "Active si le logo rend mal au survol (ex : Universal Music). Le logo reste blanc et figé, sans changement de couleur ni de taille." },
        { key: "display_order", label: "Ordre", type: "number" },
      ]}
      renderTabLabel={(item) => item.text_value || (item.kind === "logo" ? "Logo" : "Texte")}
      renderSubEditors={(item) => (
        <MediaGalleryEditor
          ownerTable="marquee_items"
          ownerId={item.id}
          currentUrl={item.image_url || ""}
          mode="row"
          targetTable="marquee_items"
          targetColumn="image_url"
          folder="marquee"
          title="Versions du logo"
          helper="Upload plusieurs versions de ce logo et clique sur une vignette pour la définir comme logo affiché dans le bandeau. L'ancien logo reste disponible — tu peux basculer à tout moment sans perte."
          aspect="square"
          invalidateKeys={[["marquee_items"], ["marquee_items", page]]}
        />
      )}
    />
  );
}
