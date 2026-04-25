import SettingsBlock from "../SettingsBlock";
import MediaGalleryEditor from "./editors/MediaGalleryEditor";
import { useSiteSettings } from "@/hooks/useSiteContent";

/**
 * Page d'entrée (Gateway) — la VRAIE page d'accueil du site.
 * C'est l'écran scindé : "Pôle Artiste" à gauche / "Pôle Entreprise" à droite,
 * avec le logo central. Aucune autre section n'est rendue ici.
 *
 * Composants concernés : src/pages/GatewayPage.tsx
 * Ne PAS y mettre Vision, Équipe, Hero, Marquee, Références — ils n'apparaissent
 * que sur les pages /artiste et /entreprise.
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
          Seuls les éléments visibles sur cet écran sont éditables ici.
        </p>
      </div>

      <SettingsBlock
        title="Image de fond — Côté Pôle Artiste"
        description="L'image qui s'affiche en fond du côté gauche (qui s'agrandit au survol)."
        fields={[
          { key: "gateway_image_artiste", label: "Image active", type: "image", imageFolder: "gateway" },
        ]}
      />
      <MediaGalleryEditor
        ownerTable="site_settings"
        ownerId="gateway_image_artiste"
        currentUrl={currentArtiste}
        mode="setting"
        settingKey="gateway_image_artiste"
        folder="gateway"
        title="Galerie — Côté Pôle Artiste"
        helper="Garde plusieurs visuels en réserve. Clique sur une vignette pour la définir comme image de fond."
        aspect="landscape"
        invalidateKeys={[["site_settings"]]}
      />

      <SettingsBlock
        title="Image de fond — Côté Pôle Entreprise"
        description="L'image qui s'affiche en fond du côté droit."
        fields={[
          { key: "gateway_image_entreprise", label: "Image active", type: "image", imageFolder: "gateway" },
        ]}
      />
      <MediaGalleryEditor
        ownerTable="site_settings"
        ownerId="gateway_image_entreprise"
        currentUrl={currentEntreprise}
        mode="setting"
        settingKey="gateway_image_entreprise"
        folder="gateway"
        title="Galerie — Côté Pôle Entreprise"
        helper="Garde plusieurs visuels en réserve. Clique sur une vignette pour la définir comme image de fond."
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
