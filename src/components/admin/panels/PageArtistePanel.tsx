import SettingsBlock from "../SettingsBlock";
import MarqueeEditor from "./editors/MarqueeEditor";
import PacksEditor from "./editors/PacksEditor";
import PackTooltipsEditor from "./editors/PackTooltipsEditor";
import TheArtistFeaturesEditor from "./editors/TheArtistFeaturesEditor";
import ClipPortugalEditor from "./editors/ClipPortugalEditor";
import ArtistPillarsEditor from "./editors/ArtistPillarsEditor";
import PillarItemsEditor from "./editors/PillarItemsEditor";
import ArtistDetailsEditor from "./editors/ArtistDetailsEditor";

/**
 * Page Artiste — sections SPÉCIFIQUES uniquement, dans l'ordre EXACT du rendu :
 *   1. Hero
 *   2. Marquee (artiste)
 *   3. ArtisteServicesV4B (5 piliers split-screen + leurs puces)
 *   4. Références Artistes (titres + carrousel + popup détails)
 *   5. Packs & Tarifs (+ infobulles)
 *   6. TheArtist
 *   7. Clip Portugal
 *   8. CtaBand
 *   9. Contact
 *
 * Vision, Équipe → onglet "Sections partagées".
 *
 * NOTE : Les anciennes sections "Services Artiste", "Expertise Artiste",
 * "Process Artiste" et "Statistiques" ont été retirées : elles ne sont
 * plus affichées sur la page (remplacées par les piliers split-screen).
 */
export default function PageArtistePanel() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="px-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Site / Pages</p>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Page Artiste</h2>
        <p className="text-xs text-slate-500 mt-1">
          Pôle Music & Entertainment. Vision, Équipe et catégories d'artistes sont dans
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

      <SettingsBlock
        title="3. Section Piliers — En-tête"
        description="Titres affichés au-dessus du bloc split-screen des piliers."
        fields={[
          { key: "artiste_services_kicker", label: "Sur-titre", placeholder: "Notre méthode" },
          { key: "artiste_services_title_part1", label: "Titre — partie 1" },
          { key: "artiste_services_title_accent", label: "Titre — partie en accent (vert)" },
          { key: "artiste_services_subtitle", label: "Sous-titre", type: "textarea" },
        ]}
      />

      <ArtistPillarsEditor />
      <PillarItemsEditor />

      <SettingsBlock
        title="4. Références Artistes — Titres"
        description="En-tête de la section 'Ils nous ont fait confiance pour leurs sorties'."
        fields={[
          { key: "artist_ref_label", label: "Sur-titre", placeholder: "Références Artistes" },
          { key: "artist_ref_title_line1", label: "Titre — ligne 1", placeholder: "Ils nous ont fait confiance" },
          { key: "artist_ref_title_line2", label: "Titre — ligne 2", placeholder: "pour leurs sorties" },
        ]}
      />

      <ArtistDetailsEditor />

      <PacksEditor />
      <PackTooltipsEditor />

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
