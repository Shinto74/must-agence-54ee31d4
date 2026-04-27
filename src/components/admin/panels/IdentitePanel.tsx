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
        description="Affichées dans le footer, dans la section contact des pages Artiste & Entreprise"
        fields={[
          { key: "contact_email", label: "Email", placeholder: "contact@mustagence.com" },
          { key: "contact_phone", label: "Téléphone", placeholder: "+33 6 00 00 00 00" },
          { key: "contact_location", label: "Adresse", placeholder: "Paris, France" },
        ]}
      />

      <SettingsBlock
        title="Réseaux sociaux"
        description="Liens des icônes sociales du footer. Laisse vide pour masquer une icône."
        fields={[
          { key: "social_instagram", label: "Instagram", type: "url", placeholder: "https://instagram.com/..." },
          { key: "social_tiktok", label: "TikTok", type: "url", placeholder: "https://tiktok.com/@..." },
          { key: "social_linkedin", label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/company/..." },
          { key: "social_youtube", label: "YouTube", type: "url", placeholder: "https://youtube.com/@..." },
        ]}
      />

      <ContactSectorsEditor />
    </div>
  );
}
