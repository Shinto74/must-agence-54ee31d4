import SettingsBlock from "../SettingsBlock";

export default function IdentitePanel() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="px-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Site / Global</p>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Identité & Global</h2>
        <p className="text-xs text-slate-500 mt-1">
          Logos, marque et coordonnées qui apparaissent partout sur le site.
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
