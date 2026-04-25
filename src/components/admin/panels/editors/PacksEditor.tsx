import TabbedEditor from "./TabbedEditor";
import TableEditor from "./TableEditor";

/**
 * Éditeur Packs — UX repensée :
 *   - Onglets en haut (1 par pack), formulaire d'édition toujours ouvert.
 *   - Sous-éditeurs inline pour les features et les tooltips de CE pack.
 *   - "Devis sur mesure" est désormais un pack normal en BDD (pack 4).
 */
export default function PacksEditor() {
  return (
    <TabbedEditor
      table="packs"
      title="Packs & Tarifs"
      description="Cliquez sur un pack ci-dessous pour le modifier. La numérotation (Pack 1, 2…) est automatique selon la position."
      itemNoun="pack"
      accentHue={73}
      initialRecord={{
        name: "Nouveau pack",
        subtitle: "",
        price: "0€",
        price_suffix: "HT",
        featured: false,
        badge: "",
        bonus: "",
        reassurance: "",
      }}
      fields={[
        { key: "name", label: "Nom" },
        { key: "subtitle", label: "Sous-titre", type: "textarea" },
        { key: "price", label: "Prix", placeholder: "350€ ou Sur devis" },
        { key: "price_suffix", label: "Suffixe prix", placeholder: "HT" },
        { key: "badge", label: "Badge", placeholder: "Recommandé / Personnalisé / vide" },
        { key: "featured", label: "featured", type: "checkbox", hint: "Met le pack en avant visuellement (bordure + glow)." },
        { key: "bonus", label: "Bonus" },
        { key: "reassurance", label: "Réassurance", type: "textarea" },
        { key: "display_order", label: "Position", type: "number", hint: "Détermine l'ordre d'affichage et le numéro auto (Pack 1, 2…)." },
      ]}
      renderTabLabel={(pack) =>
        `${pack.featured ? "⭐ " : ""}${pack.name} — ${pack.price}${pack.price_suffix ? " " + pack.price_suffix : ""}`
      }
      renderSubEditors={(pack) => (
        <>
          <TableEditor
            key={`features-${pack.id}`}
            table="pack_features"
            title="Caractéristiques du pack"
            description="Liste des fonctionnalités affichées sur la carte du pack."
            label="caractéristique"
            initialRecord={{ pack_id: pack.id, text: "" }}
            filter={(row: any) => row.pack_id === pack.id}
            fields={[
              { key: "text", label: "Texte" },
              { key: "display_order", label: "Position", type: "number" },
            ]}
            renderItem={(item: any) => (
              <p className="text-sm text-slate-900">{item.text}</p>
            )}
          />

          <TableEditor
            key={`tooltips-${pack.id}`}
            table="pack_tooltips"
            title="Infobulles (info au survol)"
            description="Pour chaque caractéristique, tu peux ajouter une infobulle d'explication. Le 'préfixe' doit correspondre au début du texte de la caractéristique."
            label="infobulle"
            initialRecord={{ pack_id: pack.id, feature_prefix: "", tooltip_text: "" }}
            filter={(row: any) => row.pack_id === pack.id}
            fields={[
              { key: "feature_prefix", label: "Préfixe (début du texte de la caractéristique)" },
              { key: "tooltip_text", label: "Texte de l'infobulle", type: "textarea" },
              { key: "display_order", label: "Position", type: "number" },
            ]}
            renderItem={(item: any) => (
              <p className="text-sm text-slate-900">
                <span className="font-mono text-xs text-indigo-600">{item.feature_prefix}</span>
                <span className="text-slate-500 ml-2">→ {item.tooltip_text?.slice(0, 60)}…</span>
              </p>
            )}
          />
        </>
      )}
    />
  );
}
