import SettingsBlock from "../SettingsBlock";
import MediaGalleryEditor from "./editors/MediaGalleryEditor";
import { useSiteSettings } from "@/hooks/useSiteContent";

/**
 * Page d'entrée (Gateway) — la VRAIE page d'accueil du site.
 * C'est l'écran scindé : "Pôle Artiste" à gauche / "Pôle Entreprise" à droite,
 * avec le logo central. Aucune autre section n'est rendue ici.
 */
export default function PageAccueilPanel() {
  const { get } = useSiteSettings();
  const currentArtiste = get("gateway_image_artiste");
  const currentEntreprise = get("gateway_image_entreprise");

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="px-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Site / Pages</p>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Page d'entrée (Gateway)</h2>
        <p className="text-xs text-slate-500 mt-1">
          Écran d'accueil du site avec le choix entre Pôle Artiste et Pôle Entreprise.
        </p>
      </div>

      <SettingsBlock
        title="1. Côté Pôle Artiste — Textes & boutons"
        description="Textes affichés à gauche (le côté qui s'agrandit au survol)."
        fields={[
          { key: "gateway_artiste_subtitle", label: "Sous-titre", placeholder: "Musique · Influence · Lancement" },
          { key: "gateway_artiste_label", label: "Libellé du bouton", placeholder: "Je suis un Artiste" },
        ]}
      />
      <MediaGalleryEditor
        ownerTable="site_settings"
        ownerId="gateway_image_artiste"
        currentUrl={currentArtiste}
        mode="setting"
        settingKey="gateway_image_artiste"
        folder="gateway"
        title="Image de fond — Côté Pôle Artiste"
        helper="Garde plusieurs visuels en réserve. Clique sur une vignette pour la définir comme image de fond active."
        aspect="landscape"
        invalidateKeys={[["site_settings"]]}
      />

      <SettingsBlock
        title="2. Côté Pôle Entreprise — Textes & boutons"
        description="Textes affichés à droite."
        fields={[
          { key: "gateway_entreprise_subtitle", label: "Sous-titre", placeholder: "Branding · Stratégie · Croissance" },
          { key: "gateway_entreprise_label", label: "Libellé du bouton", placeholder: "Je suis une Entreprise" },
        ]}
      />
      <MediaGalleryEditor
        ownerTable="site_settings"
        ownerId="gateway_image_entreprise"
        currentUrl={currentEntreprise}
        mode="setting"
        settingKey="gateway_image_entreprise"
        folder="gateway"
        title="Image de fond — Côté Pôle Entreprise"
        helper="Garde plusieurs visuels en réserve. Clique sur une vignette pour la définir comme image de fond active."
        aspect="landscape"
        invalidateKeys={[["site_settings"]]}
      />

      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-xs text-amber-900">
        <p className="font-semibold mb-1">Logo central</p>
        <p>Le logo affiché au centre de la page d'entrée se gère depuis l'onglet <strong>Identité &amp; Logos</strong> (logos vert et blanc).</p>
      </div>
    </div>
  );
}
