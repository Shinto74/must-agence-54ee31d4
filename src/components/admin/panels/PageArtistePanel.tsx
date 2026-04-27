import SettingsBlock from "../SettingsBlock";
import MarqueeEditor from "./editors/MarqueeEditor";
import PacksEditor from "./editors/PacksEditor";
import TheArtistFeaturesEditor from "./editors/TheArtistFeaturesEditor";
import ClipPortugalEditor from "./editors/ClipPortugalEditor";
import PillarItemsEditor from "./editors/PillarItemsEditor";
import ArtistesEditor from "./editors/ArtistesEditor";
import TeamEditor from "./editors/TeamEditor";
import ContactFormTypesEditor from "./editors/ContactFormTypesEditor";
import MediaGalleryEditor from "./editors/MediaGalleryEditor";
import { useSiteSettings } from "@/hooks/useSiteContent";

/**
 * Page Artiste — sections affichées sur /artiste, dans l'ordre EXACT du rendu :
 *   1. Hero
 *   2. Marquee artiste
 *   3. Piliers (en-tête + items)
 *   4. Références artistes (titres + catégories + fiches + galeries)
 *   5. Packs
 *   6. TheArtist
 *   7. Clip Portugal
 *   8. Vision
 *   9. Équipe
 *  10. CtaBand
 *  11. Contact
 *
 * Vision et Équipe sont SPÉCIFIQUES à cette page (ils ne sont pas affichés sur
 * la page d'entrée Gateway, ni sur la page Entreprise).
 */
export default function PageArtistePanel() {
  const { get } = useSiteSettings();
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="px-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Site / Pages</p>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Page Artiste</h2>
        <p className="text-xs text-slate-500 mt-1">
          Pôle Music & Entertainment. Toutes les sections affichées sur la page sont éditables ici, dans l'ordre du rendu.
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

      <ArtistesEditor />

      <PacksEditor />

      <SettingsBlock
        title="6. TheArtist — Bloc partenaire"
        fields={[
          { key: "theartist_kicker", label: "Sur-titre", placeholder: "Partenaire officiel" },
          { key: "theartist_title_part1", label: "Titre — partie 1" },
          { key: "theartist_title_part2", label: "Titre — partie 2" },
          { key: "theartist_cta_label", label: "Texte du bouton" },
          { key: "theartist_cta_url", label: "URL du bouton" },
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
          { key: "clip_portugal_description", label: "Paragraphe descriptif", type: "textarea", hint: "Texte affiché sous le titre. Utilise des retours à la ligne pour structurer." },
          { key: "clip_portugal_subtitle", label: "Sous-titre (legacy)", type: "textarea" },
          { key: "clip_portugal_cta", label: "Bouton — texte court" },
          { key: "clip_portugal_cta_label", label: "Bouton — texte long" },
        ]}
      />

      <MediaGalleryEditor
        ownerTable="site_settings"
        ownerId="clip_portugal_video_url"
        currentUrl={get("clip_portugal_video_url")}
        mode="setting"
        settingKey="clip_portugal_video_url"
        folder="videos"
        title="Clip Portugal — Vidéo principale"
        helper="Upload ta/tes vidéo(s) MP4. Clique sur une vignette pour la définir comme vidéo principale du player."
        aspect="video"
        allowVideo
        invalidateKeys={[["site_settings"]]}
      />

      <MediaGalleryEditor
        ownerTable="site_settings"
        ownerId="clip_portugal_poster"
        currentUrl={get("clip_portugal_poster")}
        mode="setting"
        settingKey="clip_portugal_poster"
        folder="videos"
        title="Clip Portugal — Image poster (avant lecture)"
        helper="Image affichée tant que la vidéo n'est pas lancée."
        aspect="video"
        invalidateKeys={[["site_settings"]]}
      />
      <ClipPortugalEditor />

      <SettingsBlock
        title="8. Notre Vision"
        description="Bloc 'Notre vision' — uniquement affiché sur la page Artiste."
        fields={[
          { key: "vision_kicker", label: "Sur-titre", placeholder: "Notre vision" },
          { key: "vision_title_line1", label: "Titre — ligne 1", placeholder: "L'influence est" },
          { key: "vision_title_line2", label: "Titre — ligne 2 (en accent vert)", placeholder: "une science." },
          { key: "vision_quote", label: "Citation principale (entre guillemets)", type: "textarea", hint: "Ex : Dans un monde de bruit, nous créons le signal..." },
          { key: "vision_text", label: "Texte sous la citation", type: "textarea" },
        ]}
      />

      <div>
        <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2 px-1">
          9. Équipe (uniquement page Artiste)
        </p>
        <TeamEditor />
      </div>

      <SettingsBlock
        title="10. CTA Band — Bannière finale"
        fields={[
          { key: "ctaband_artiste_title", label: "Titre" },
          { key: "ctaband_artiste_subtitle", label: "Sous-titre" },
          { key: "ctaband_artiste_button", label: "Texte du bouton" },
        ]}
      />

      <SettingsBlock
        title="11. Section Contact (page Artiste)"
        description="Textes spécifiques au formulaire de la page Artiste."
        fields={[
          { key: "contact_artiste_heading", label: "Titre" },
          { key: "contact_artiste_text", label: "Phrase d'accroche" },
          { key: "contact_artiste_subtext", label: "Sous-texte", type: "textarea" },
        ]}
      />

      <ContactFormTypesEditor page="artiste" />
    </div>
  );
}
