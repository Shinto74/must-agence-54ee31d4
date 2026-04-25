import SettingsBlock from "../SettingsBlock";
import MarqueeEditor from "./editors/MarqueeEditor";
import StatsEditor from "./editors/StatsEditor";
import PacksEditor from "./editors/PacksEditor";
import ServicesArtisteEditor from "./editors/ServicesArtisteEditor";
import ExpertiseArtisteEditor from "./editors/ExpertiseArtisteEditor";
import ProcessArtisteEditor from "./editors/ProcessArtisteEditor";
import TheArtistFeaturesEditor from "./editors/TheArtistFeaturesEditor";
import ClipPortugalEditor from "./editors/ClipPortugalEditor";

/**
 * Page Artiste — sections SPÉCIFIQUES uniquement.
 * Ordre réel : Hero → Marquee (artiste) → ArtisteServicesV4B → ArtistRef* → Packs → TheArtist
 *              → ClipPortugal → Vision* → Team* → CtaBand → Contact
 *  *Sections partagées → onglet "Sections partagées".
 */
export default function PageArtistePanel() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="px-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Site / Pages</p>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Page Artiste</h2>
        <p className="text-xs text-slate-500 mt-1">
          Pôle Music & Entertainment. Vision, Équipe et Références artistes sont dans
          <strong> Global › Sections partagées</strong>.
        </p>
      </div>

      <SettingsBlock
        title="1. Hero — Bannière Artiste"
        fields={[
          { key: "hero_artiste_badge", label: "Badge / Tag", placeholder: "Pôle Artiste" },
          { key: "hero_artiste_label", label: "Label", placeholder: "Influence Artistique" },
          { key: "hero_artiste_title_line1", label: "Titre — ligne 1" },
          { key: "hero_artiste_title_accent", label: "Titre — accent" },
          { key: "hero_artiste_subtitle", label: "Sous-titre", type: "textarea" },
          { key: "hero_artiste_cta_primary", label: "Bouton principal" },
          { key: "hero_artiste_cta_secondary", label: "Bouton secondaire" },
          { key: "hero_artiste_video_url", label: "Vidéo de fond", type: "image", hint: "URL d'une vidéo MP4 ou laisser vide" },
        ]}
      />

      <MarqueeEditor
        page="artiste"
        title="2. Bandeau défilant — Artiste"
        description="Logos partenaires / mots-clés (Spotify, TikTok, YouTube…)"
      />

      <ServicesArtisteEditor />
      <ExpertiseArtisteEditor />
      <ProcessArtisteEditor />

      <StatsEditor page="artiste" title="Statistiques affichées sur la page Artiste" />

      <PacksEditor />

      <SettingsBlock
        title="6. TheArtist — Bloc partenaire"
        fields={[
          { key: "theartist_kicker", label: "Sur-titre", placeholder: "Partenaire officiel" },
          { key: "theartist_title_part1", label: "Titre — partie 1" },
          { key: "theartist_title_part2", label: "Titre — partie 2" },
          { key: "theartist_cta_label", label: "Texte du bouton" },
          { key: "theartist_cta_url", label: "URL du bouton", type: "url" },
          { key: "theartist_footer_text", label: "Mention sous le bouton" },
        ]}
      />
      <TheArtistFeaturesEditor />

      <SettingsBlock
        title="7. Clip Portugal — Section vidéo"
        fields={[
          { key: "clip_portugal_kicker", label: "Sur-titre" },
          { key: "clip_portugal_title_line1", label: "Titre — ligne 1" },
          { key: "clip_portugal_title_line2", label: "Titre — ligne 2" },
          { key: "clip_portugal_subtitle", label: "Sous-titre", type: "textarea" },
          { key: "clip_portugal_cta", label: "Bouton — texte court" },
          { key: "clip_portugal_cta_label", label: "Bouton — texte long" },
          { key: "clip_portugal_video_url", label: "URL vidéo MP4", type: "image", imageFolder: "videos" },
          { key: "clip_portugal_poster", label: "Image poster (avant lecture)", type: "image", imageFolder: "videos" },
        ]}
      />
      <ClipPortugalEditor />

      <SettingsBlock
        title="8. CTA Band — Bannière finale"
        fields={[
          { key: "ctaband_artiste_title", label: "Titre" },
          { key: "ctaband_artiste_subtitle", label: "Sous-titre" },
          { key: "ctaband_artiste_button", label: "Texte du bouton" },
        ]}
      />

      <SettingsBlock
        title="9. Section Contact (page Artiste)"
        description="Textes spécifiques au formulaire de la page Artiste."
        fields={[
          { key: "contact_artiste_heading", label: "Titre" },
          { key: "contact_artiste_text", label: "Phrase d'accroche" },
          { key: "contact_artiste_subtext", label: "Sous-texte", type: "textarea" },
        ]}
      />
    </div>
  );
}
