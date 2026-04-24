import SettingsBlock from "../SettingsBlock";
import MarqueeEditor from "./editors/MarqueeEditor";
import StatsEditor from "./editors/StatsEditor";
import TeamEditor from "./editors/TeamEditor";
import ArtistesEditor from "./editors/ArtistesEditor";
import ClientsEditor from "./editors/ClientsEditor";
import PortfolioEditor from "./editors/PortfolioEditor";

/**
 * Page Accueil — éditeur unifié.
 * Rassemble : Hero, Marquee, Vision, Pôles, Équipe, Stats, Références, Portfolio, CtaBand, Contact.
 */
export default function PageAccueilPanel() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="px-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Site / Pages</p>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Page d'accueil</h2>
        <p className="text-xs text-slate-500 mt-1">
          Tous les contenus visibles sur la page d'accueil. Les modifications sont enregistrées automatiquement.
        </p>
      </div>

      <SettingsBlock
        title="Hero — Bannière d'accueil"
        description="Premier écran visible par vos visiteurs"
        fields={[
          { key: "hero_home_badge", label: "Badge / Tag", placeholder: "MUST AGENCE" },
          { key: "hero_home_title", label: "Titre principal", type: "textarea" },
          { key: "hero_home_subtitle", label: "Sous-titre", type: "textarea" },
        ]}
      />

      <MarqueeEditor page="home" title="Bandeau défilant" description="Mots / logos qui défilent en haut de la page" />

      <SettingsBlock
        title="Vision"
        description="Section « Notre vision »"
        fields={[
          { key: "vision_kicker", label: "Sur-titre", placeholder: "Notre vision" },
          { key: "vision_title", label: "Titre" },
          { key: "vision_text", label: "Texte", type: "textarea" },
        ]}
      />

      <StatsEditor page="home" title="Statistiques" description="Chiffres clés affichés sur la page d'accueil" />

      <TeamEditor />

      <ClientsEditor />

      <ArtistesEditor />

      <PortfolioEditor />

      <SettingsBlock
        title="CTA Band — Bannière finale"
        description="Bandeau d'appel à l'action en bas de page"
        fields={[
          { key: "ctaband_home_title", label: "Titre" },
          { key: "ctaband_home_subtitle", label: "Sous-titre" },
          { key: "ctaband_home_button", label: "Texte du bouton" },
        ]}
      />

      <SettingsBlock
        title="Contact"
        description="Coordonnées affichées en bas de page"
        fields={[
          { key: "contact_email", label: "Email" },
          { key: "contact_phone", label: "Téléphone" },
          { key: "contact_location", label: "Adresse" },
        ]}
      />
    </div>
  );
}
