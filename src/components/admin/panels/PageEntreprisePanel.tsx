import SettingsBlock from "../SettingsBlock";
import MarqueeEditor from "./editors/MarqueeEditor";
import SectorsEditor from "./editors/SectorsEditor";
import ClientsEditor from "./editors/ClientsEditor";

/**
 * Page Entreprise — sections SPÉCIFIQUES uniquement, dans l'ordre EXACT du rendu :
 *   1. Hero (+ stats hero hardcodées dans 3 settings)
 *   2. Marquee (entreprise)
 *   3. Sectors (Orbit3D + grille mobile)
 *   4. Services3DScroll (titre dans settings)
 *   5. CtaBand
 *   6. Contact
 *
 * NOTE : "Services Entreprise", "Expertise Entreprise", "Process Entreprise"
 * et "Statistiques (page entreprise)" ont été retirés : ces tables ne sont pas
 * rendues sur la page (la page utilise des composants 3D dédiés).
 */
export default function PageEntreprisePanel() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="px-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Site / Pages</p>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Page Entreprise</h2>
        <p className="text-xs text-slate-500 mt-1">Pôle Corporate & Business.</p>
      </div>

      <SettingsBlock
        title="1. Hero — Bannière Entreprise"
        fields={[
          { key: "hero_entreprise_tag", label: "Tag / Badge", placeholder: "Pôle Entreprise" },
          { key: "hero_entreprise_title_line1", label: "Titre — ligne 1" },
          { key: "hero_entreprise_title_line2", label: "Titre — ligne 2 (accent)" },
          { key: "hero_entreprise_description", label: "Description", type: "textarea" },
          { key: "hero_entreprise_cta_primary", label: "Bouton principal" },
          { key: "hero_entreprise_cta_secondary", label: "Bouton secondaire" },
          { key: "hero_entreprise_video_url", label: "Vidéo de fond", type: "image", hint: "URL d'une vidéo MP4" },
        ]}
      />

      <SettingsBlock
        title="1bis. Hero — Statistiques affichées"
        description="Trois chiffres-clés affichés sous le hero entreprise."
        fields={[
          { key: "hero_entreprise_stat1_value", label: "Stat 1 — valeur" },
          { key: "hero_entreprise_stat1_suffix", label: "Stat 1 — suffixe" },
          { key: "hero_entreprise_stat1_label", label: "Stat 1 — libellé" },
          { key: "hero_entreprise_stat2_value", label: "Stat 2 — valeur" },
          { key: "hero_entreprise_stat2_suffix", label: "Stat 2 — suffixe" },
          { key: "hero_entreprise_stat2_label", label: "Stat 2 — libellé" },
          { key: "hero_entreprise_stat3_value", label: "Stat 3 — valeur" },
          { key: "hero_entreprise_stat3_suffix", label: "Stat 3 — suffixe" },
          { key: "hero_entreprise_stat3_label", label: "Stat 3 — libellé" },
        ]}
      />

      <MarqueeEditor
        page="entreprise"
        title="2. Bandeau défilant — Entreprise"
        description="Mots-clés / logos qui défilent (TikTok, Instagram, YouTube…)"
      />

      <SettingsBlock
        title="3. Secteurs — Titres de la section"
        fields={[
          { key: "entreprise_sectors_title", label: "Titre" },
          { key: "entreprise_sectors_subtitle", label: "Sous-titre", type: "textarea" },
          { key: "entreprise_orbit_title", label: "Titre orbite 3D" },
        ]}
      />
      <SectorsEditor />

      <ClientsEditor />

      <SettingsBlock
        title="4. CTA Band — Bannière finale"
        fields={[
          { key: "ctaband_entreprise_title", label: "Titre" },
          { key: "ctaband_entreprise_subtitle", label: "Sous-titre" },
          { key: "ctaband_entreprise_button", label: "Texte du bouton" },
        ]}
      />

      <SettingsBlock
        title="5. Section Contact (page Entreprise)"
        fields={[
          { key: "contact_entreprise_heading", label: "Titre" },
          { key: "contact_entreprise_text", label: "Phrase d'accroche" },
          { key: "contact_entreprise_subtext", label: "Sous-texte", type: "textarea" },
        ]}
      />
    </div>
  );
}
