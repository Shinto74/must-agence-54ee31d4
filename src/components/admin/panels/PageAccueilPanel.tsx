import SettingsBlock from "../SettingsBlock";
import MediaGalleryEditor from "./editors/MediaGalleryEditor";
import { useSiteSettings } from "@/hooks/useSiteContent";

/**
 * Page d'entrée (Gateway "/").
 * Édition complète : visuels, titres/sous-titres, labels CTA et caption bas de page.
 */
export default function PageAccueilPanel() {
  const { get } = useSiteSettings();
  const imgArtiste = get("gateway_image_artiste");
  const imgEntreprise = get("gateway_image_entreprise");

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="px-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Pages / Page d'entrée</p>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Page d'entrée (Gateway)</h2>
        <p className="text-xs text-slate-500 mt-1">
          Première page que voient les visiteurs ("/"). Permet de choisir entre les deux pôles.
        </p>
      </div>

      <SettingsBlock
        title="Marque centrale"
        description="Texte affiché au centre de la page, au-dessus du logo."
        fields={[
          { key: "gateway_brand_label", label: "Label central", placeholder: "MUST AGENCE" },
          { key: "gateway_bottom_caption", label: "Caption bas de page", placeholder: "Influence · Musique · Marques" },
        ]}
      />

      <MediaGalleryEditor
        ownerTable="site_settings"
        ownerId="gateway_image_artiste"
        currentUrl={imgArtiste}
        mode="setting"
        settingKey="gateway_image_artiste"
        folder="gateway"
        title="Visuel — Pôle Artiste (gauche)"
        helper="Image de fond du côté gauche/haut de la page d'entrée."
        aspect="video"
        invalidateKeys={[["site_settings"]]}
      />

      <SettingsBlock
        title="Bloc Pôle Artiste"
        description="Textes affichés sur la moitié Artiste."
        fields={[
          { key: "gateway_artiste_title", label: "Titre", placeholder: "Pôle Artiste" },
          { key: "gateway_artiste_subtitle", label: "Sous-titre", placeholder: "Musique · Influence · Lancement" },
          { key: "gateway_artiste_label", label: "Label CTA", placeholder: "Je suis un Artiste" },
        ]}
      />

      <MediaGalleryEditor
        ownerTable="site_settings"
        ownerId="gateway_image_entreprise"
        currentUrl={imgEntreprise}
        mode="setting"
        settingKey="gateway_image_entreprise"
        folder="gateway"
        title="Visuel — Pôle Entreprise (droite)"
        helper="Image de fond du côté droit/bas de la page d'entrée."
        aspect="video"
        invalidateKeys={[["site_settings"]]}
      />

      <SettingsBlock
        title="Bloc Pôle Entreprise"
        description="Textes affichés sur la moitié Entreprise."
        fields={[
          { key: "gateway_entreprise_title", label: "Titre", placeholder: "Pôle Entreprise" },
          { key: "gateway_entreprise_subtitle", label: "Sous-titre", placeholder: "Branding · Stratégie · Croissance" },
          { key: "gateway_entreprise_label", label: "Label CTA", placeholder: "Je suis une Entreprise" },
        ]}
      />
    </div>
  );
}
