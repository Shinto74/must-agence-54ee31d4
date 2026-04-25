import SettingsBlock from "../SettingsBlock";
import MarqueeEditor from "./editors/MarqueeEditor";

/**
 * Page Accueil — sections SPÉCIFIQUES uniquement.
 * Ordre d'apparition réel : Hero → Marquee (home) → PolesGateway → ArtistRef* → CompanyRef* → Vision* → Team* → CtaBand → Contact*
 *  *Sections partagées avec d'autres pages → éditables dans l'onglet "Sections partagées".
 */
export default function PageAccueilPanel() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="px-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Site / Pages</p>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Page d'accueil</h2>
        <p className="text-xs text-slate-500 mt-1">
          Sections propres à la page d'accueil. Vision, Équipe et Références sont gérées dans
          <strong> Global › Sections partagées</strong> (utilisées aussi sur d'autres pages).
        </p>
      </div>

      <SettingsBlock
        title="1. Hero — Bannière d'accueil"
        description="Premier écran visible par vos visiteurs"
        fields={[
          { key: "hero_home_badge", label: "Badge / Tag", placeholder: "MUST AGENCE" },
          { key: "hero_home_title", label: "Titre principal", type: "textarea" },
          { key: "hero_home_subtitle", label: "Sous-titre", type: "textarea" },
        ]}
      />

      <MarqueeEditor
        page="home"
        title="2. Bandeau défilant — Accueil"
        description="Mots / logos qui défilent sous le hero de l'accueil"
      />

      <SettingsBlock
        title="3. Pôles Gateway — Cartes Artiste / Entreprise"
        description="Section qui invite à choisir entre les deux pôles"
        fields={[
          { key: "polesgateway_kicker", label: "Sur-titre", placeholder: "Nos univers" },
          { key: "polesgateway_title", label: "Titre" },
          { key: "polesgateway_subtitle", label: "Sous-titre", type: "textarea" },
        ]}
      />

      <SettingsBlock
        title="4. Références Artistes — Titres"
        description="En-tête du carrousel des artistes sur la page d'accueil."
        fields={[
          { key: "artist_ref_label", label: "Sur-titre", placeholder: "Références Artistes" },
          { key: "artist_ref_title_line1", label: "Titre — ligne 1", placeholder: "Ils nous ont fait confiance" },
          { key: "artist_ref_title_line2", label: "Titre — ligne 2", placeholder: "pour leurs sorties" },
        ]}
      />

      <SettingsBlock
        title="5. Références Entreprises — Titres"
        description="En-tête du carrousel des marques accompagnées."
        fields={[
          { key: "company_ref_label", label: "Sur-titre", placeholder: "Références Entreprises" },
          { key: "company_ref_title_line1", label: "Titre — ligne 1", placeholder: "Ils nous accompagnent" },
          { key: "company_ref_title_line2", label: "Titre — ligne 2", placeholder: "au quotidien" },
        ]}
      />

      <SettingsBlock
        title="4. CTA Band — Bannière finale"
        description="Bandeau d'appel à l'action en bas de page"
        fields={[
          { key: "ctaband_home_title", label: "Titre" },
          { key: "ctaband_home_subtitle", label: "Sous-titre" },
          { key: "ctaband_home_button", label: "Texte du bouton" },
        ]}
      />

      <SettingsBlock
        title="5. Section Contact"
        description="Spécifique à la page d'accueil. Coordonnées globales : voir Identité."
        fields={[
          { key: "contact_home_heading", label: "Titre" },
          { key: "contact_home_text", label: "Phrase d'accroche" },
          { key: "contact_home_subtext", label: "Sous-texte", type: "textarea" },
        ]}
      />
    </div>
  );
}
