import SettingsBlock from "../SettingsBlock";

export default function IdentitePanel() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="px-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Site / Global</p>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Identité & Global</h2>
        <p className="text-xs text-slate-500 mt-1">
          Logos, marque, coordonnées et images globales utilisées partout sur le site.
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

      <SettingsBlock
        title="Logos"
        description="Logo blanc utilisé sur fond sombre, vert sur fond clair"
        imageFolder="logos"
        fields={[
          { key: "logo_white", label: "Logo blanc", type: "image" },
          { key: "logo_green", label: "Logo vert", type: "image" },
        ]}
      />

      <SettingsBlock
        title="Vidéo Hero principale"
        description="Vidéo de fond du hero d'accueil et du pôle artiste"
        imageFolder="videos"
        fields={[
          { key: "hero_video_url", label: "URL vidéo MP4", type: "image", hint: "Uploader un .mp4 ou coller une URL" },
        ]}
      />

      <SettingsBlock
        title="Page Gateway (sélecteur Artiste / Entreprise)"
        description="Images de fond des deux côtés de la page d'entrée"
        imageFolder="gateway"
        fields={[
          { key: "gateway_image_artiste", label: "Image — côté Artiste", type: "image" },
          { key: "gateway_image_entreprise", label: "Image — côté Entreprise", type: "image" },
        ]}
      />

      <SettingsBlock
        title="Coordonnées"
        description="Affichées dans le footer et sur les pages contact"
        fields={[
          { key: "contact_email", label: "Email" },
          { key: "contact_phone", label: "Téléphone" },
          { key: "contact_location", label: "Adresse" },
        ]}
      />
    </div>
  );
}
