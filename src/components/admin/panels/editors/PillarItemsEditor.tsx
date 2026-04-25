import TabbedEditor from "./TabbedEditor";
import TableEditor from "./TableEditor";

/**
 * Éditeur Piliers Artiste (split-screen) — UX repensée :
 *   - Onglets en haut (1 par pilier).
 *   - Édition inline + sous-éditeurs gauche/droite intégrés.
 *
 * Remplace l'ancien duo ArtistPillarsEditor + PillarItemsEditor.
 */
export default function PillarItemsEditor() {
  return (
    <TabbedEditor
      table="artist_pillars"
      title="Piliers artiste (section split-screen)"
      description="Cliquez sur un pilier pour modifier son contenu et ses puces. La numérotation est automatique."
      itemNoun="pilier"
      accentHue={73}
      initialRecord={{
        statement: "Nouveau pilier",
        description: "",
        left_title: "Bénéfices",
        right_title: "Déploiement",
        accent_hue: 73,
        icon: "Zap",
      }}
      fields={[
        { key: "statement", label: "Phrase d'accroche (titre du pilier)", type: "textarea" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "left_title", label: "Titre colonne gauche", placeholder: "Bénéfices" },
        { key: "right_title", label: "Titre colonne droite", placeholder: "Déploiement" },
        { key: "icon", label: "Nom de l'icône Lucide", placeholder: "Zap, Music, Megaphone…" },
        { key: "accent_hue", label: "Teinte d'accent (0-360)", type: "number", hint: "73 = vert néon, 200 = bleu, 30 = orange…" },
        { key: "display_order", label: "Position", type: "number" },
      ]}
      renderTabLabel={(p) => p.statement?.slice(0, 60) || "(sans titre)"}
      renderSubEditors={(pillar) => (
        <div className="grid gap-4 lg:grid-cols-2">
          <TableEditor
            key={`left-${pillar.id}`}
            table="pillar_left_items"
            title="← Bénéfices (colonne gauche)"
            label="puce"
            initialRecord={{ pillar_id: pillar.id, text: "" }}
            filter={(row: any) => row.pillar_id === pillar.id}
            fields={[
              { key: "text", label: "Texte" },
              { key: "display_order", label: "Position", type: "number" },
            ]}
            renderItem={(item: any) => (
              <p className="text-sm text-slate-900">{item.text}</p>
            )}
          />

          <TableEditor
            key={`right-${pillar.id}`}
            table="pillar_right_items"
            title="Déploiements (colonne droite) →"
            label="puce"
            initialRecord={{ pillar_id: pillar.id, text: "" }}
            filter={(row: any) => row.pillar_id === pillar.id}
            fields={[
              { key: "text", label: "Texte" },
              { key: "display_order", label: "Position", type: "number" },
            ]}
            renderItem={(item: any) => (
              <p className="text-sm text-slate-900">{item.text}</p>
            )}
          />
        </div>
      )}
    />
  );
}
