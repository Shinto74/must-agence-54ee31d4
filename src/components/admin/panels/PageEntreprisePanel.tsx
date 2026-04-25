import SettingsBlock from "../SettingsBlock";
import MarqueeEditor from "./editors/MarqueeEditor";
import SectorsEditor from "./editors/SectorsEditor";
import ClientsEditor from "./editors/ClientsEditor";
import ServicesEntrepriseEditor from "./editors/ServicesEntrepriseEditor";

/**
 * Page Entreprise — sections dans l'ordre EXACT du rendu front (Entreprise.tsx) :
 *   1. Hero (+ stats)
 *   2. Marquee
 *   3. Services 3D — "Ce qu'on fait pour vous"
 *   4. Secteurs (titres + Orbit3D)
 *   5. Références (titres + catégories + clients)
 *   6. Section finale — "Prêt à grandir"
 *   7. Contact (page Entreprise)
 */
export default function PageEntreprisePanel() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="px-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Site / Pages</p>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Page Entreprise</h2>
        <p className="text-xs text-slate-500 mt-1">Pôle Corporate & Business — sections dans l'ordre du rendu.</p>
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
        title="3. Services — Ce qu'on fait pour vous"
        description="En-tête de la section services 3D (composant Services3DScroll)."
        fields={[
          { key: "entreprise_services_kicker", label: "Sur-titre", placeholder: "Services" },
          { key: "entreprise_services_title", label: "Titre", placeholder: "Ce qu'on fait pour vous" },
          { key: "entreprise_services_subtitle", label: "Sous-titre", type: "textarea" },
        ]}
      />
      <ServicesEntrepriseEditor />

      <SettingsBlock
        title="4. Secteurs — En-tête de section"
        fields={[
          { key: "entreprise_sectors_title", label: "Titre" },
          { key: "entreprise_sectors_subtitle", label: "Sous-titre", type: "textarea" },
          { key: "entreprise_orbit_title", label: "Titre orbite 3D" },
        ]}
      />
      <SectorsEditor />

      <SettingsBlock
        title="5. Références — En-tête de section"
        description="Bloc 'Ils nous font confiance' avec carrousel de logos."
        fields={[
          { key: "entreprise_ref_kicker", label: "Sur-titre", placeholder: "Références" },
          { key: "entreprise_ref_title_part1", label: "Titre — partie 1", placeholder: "Ils nous font" },
          { key: "entreprise_ref_title_accent", label: "Titre — accent (en doré)", placeholder: "confiance" },
          { key: "entreprise_ref_subtitle", label: "Sous-titre", type: "textarea" },
          { key: "entreprise_ref_footer_note", label: "Note de bas de section", placeholder: "+ de 150 projets réalisés avec succès" },
        ]}
      />
      <ClientsEditor />

      <SettingsBlock
        title="6. Section finale — Prêt à grandir"
        description="Bandeau immersif sombre juste avant le formulaire de contact."
        fields={[
          { key: "final_cta_kicker", label: "Sur-titre", placeholder: "Prêt à grandir ?" },
          { key: "final_cta_title_line1", label: "Titre — ligne 1", placeholder: "Faites passer votre entreprise" },
          { key: "final_cta_title_line2", label: "Titre — ligne 2 (en doré)", placeholder: "au niveau supérieur" },
          { key: "final_cta_subtitle", label: "Sous-titre", type: "textarea" },
          { key: "final_cta_button", label: "Texte du bouton", placeholder: "Contactez-nous" },
        ]}
      />

      <SettingsBlock
        title="7. Section Contact (page Entreprise)"
        description="Textes du formulaire. Email / téléphone / adresse se gèrent dans Identité &amp; Global."
        fields={[
          { key: "contact_entreprise_heading", label: "Titre" },
          { key: "contact_entreprise_text", label: "Phrase d'accroche" },
          { key: "contact_entreprise_subtext", label: "Sous-texte", type: "textarea" },
        ]}
      />
    </div>
  );
}
