import SettingsBlock from "../SettingsBlock";
import MediaGalleryEditor from "./editors/MediaGalleryEditor";
import ContactSectorsEditor from "./editors/ContactSectorsEditor";
import { useSiteSettings } from "@/hooks/useSiteContent";

export default function IdentitePanel() {
  const { get } = useSiteSettings();
  const logoWhite = get("logo_white");
  const logoGreen = get("logo_green");
  const heroVideo = get("hero_video_url");

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="px-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Site / Global</p>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Identité & Global</h2>
        <p className="text-xs text-slate-500 mt-1">
          Logos, marque et coordonnées utilisés partout sur le site.
        </p>
      </div>

      <SettingsBlock
        title="Marque"
        description="Identité de l'agence"
        fields={[
          { key: "brand_name", label: "Nom de la marque", placeholder: "MUST AGENCE" },
          { key: "footer_tagline", label: "Tagline du footer", type: "textarea" },
        ]}
      />

      <MediaGalleryEditor
        ownerTable="site_settings"
        ownerId="logo_white"
        currentUrl={logoWhite}
        mode="setting"
        settingKey="logo_white"
        folder="logos"
        title="Logo blanc (fond sombre)"
        helper="Utilisé dans la navbar des pages sombres et au centre de la page d'entrée au survol Entreprise. Ajoute plusieurs versions et clique sur une vignette pour la définir comme logo actif."
        aspect="square"
        invalidateKeys={[["site_settings"]]}
      />

      <MediaGalleryEditor
        ownerTable="site_settings"
        ownerId="logo_green"
        currentUrl={logoGreen}
        mode="setting"
        settingKey="logo_green"
        folder="logos"
        title="Logo vert (fond clair)"
        helper="Utilisé dans la navbar des pages claires et au centre de la page d'entrée par défaut."
        aspect="square"
        invalidateKeys={[["site_settings"]]}
      />

      <MediaGalleryEditor
        ownerTable="site_settings"
        ownerId="hero_video_url"
        currentUrl={heroVideo}
        mode="setting"
        settingKey="hero_video_url"
        folder="videos"
        title="Vidéo Hero principale (Pôle Artiste)"
        helper="Vidéo de fond du hero du pôle Artiste. Tu peux uploader plusieurs vidéos et basculer entre elles. Format MP4 recommandé."
        aspect="video"
        allowVideo
        invalidateKeys={[["site_settings"]]}
      />

      <SettingsBlock
        title="Coordonnées"
        description="Affichées dans le footer, dans la section contact des pages Artiste & Entreprise. Utilise les switches pour masquer une info partout sur le site."
        fields={[
          { key: "contact_email", label: "Email", placeholder: "contact@mustagence.com" },
          { key: "show_contact_email", label: "↳ Afficher l'email", type: "boolean", hint: "Masque l'email dans le footer + section contact." },
          { key: "contact_phone", label: "Téléphone", placeholder: "+33 6 00 00 00 00" },
          { key: "show_contact_phone", label: "↳ Afficher le téléphone", type: "boolean" },
          { key: "contact_location", label: "Adresse", placeholder: "Paris, France" },
          { key: "show_contact_location", label: "↳ Afficher l'adresse", type: "boolean" },
        ]}
      />

      <SettingsBlock
        title="Réseaux sociaux"
        description="Liens des icônes sociales du footer. Laisse vide ou désactive le switch pour masquer une icône."
        fields={[
          { key: "social_instagram", label: "Instagram", type: "url", placeholder: "https://instagram.com/..." },
          { key: "show_social_instagram", label: "↳ Afficher Instagram", type: "boolean" },
          { key: "social_tiktok", label: "TikTok", type: "url", placeholder: "https://tiktok.com/@..." },
          { key: "show_social_tiktok", label: "↳ Afficher TikTok", type: "boolean" },
          { key: "social_linkedin", label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/company/..." },
          { key: "show_social_linkedin", label: "↳ Afficher LinkedIn", type: "boolean" },
          { key: "social_youtube", label: "YouTube", type: "url", placeholder: "https://youtube.com/@..." },
          { key: "show_social_youtube", label: "↳ Afficher YouTube", type: "boolean" },
        ]}
      />

      <SettingsBlock
        title="Header (navigation)"
        description="Labels affichés dans la barre de navigation et bouton CTA Contact."
        fields={[
          { key: "header_nav_home", label: "Lien — Accueil", placeholder: "Accueil" },
          { key: "header_nav_artiste", label: "Lien — Pôle Artiste", placeholder: "Pôle Artiste" },
          { key: "header_nav_entreprise", label: "Lien — Pôle Entreprise", placeholder: "Pôle Entreprise" },
          { key: "header_contact_label", label: "Bouton CTA Contact", placeholder: "Contact" },
        ]}
      />

      <ContactSectorsEditor />
    </div>
  );
}
