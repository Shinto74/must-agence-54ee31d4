import SettingsBlock from "../SettingsBlock";

/**
 * Pages légales & obligatoires (RGPD français).
 * Tous les champs alimentent les pages /mentions-legales, /politique-confidentialite,
 * /cgv, /cgu, /politique-cookies via site_settings.
 */
export default function PagesLegalesPanel() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="px-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Site / Légal</p>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Pages légales & RGPD</h2>
        <p className="text-xs text-slate-500 mt-1">
          Mentions obligatoires, politique de confidentialité, CGV/CGU, cookies. Renseigne tes informations société et hébergeur — elles sont injectées dans toutes les pages légales du site.
        </p>
      </div>

      <SettingsBlock
        title="Société (éditeur du site)"
        description="Identité juridique affichée dans les mentions légales et la facturation."
        fields={[
          { key: "legal_company_name", label: "Raison sociale", placeholder: "MUST AGENCE" },
          { key: "legal_company_form", label: "Forme juridique", placeholder: "SASU" },
          { key: "legal_company_capital", label: "Capital social", placeholder: "1 000 €" },
          { key: "legal_company_siret", label: "SIRET" },
          { key: "legal_company_rcs", label: "Ville RCS", placeholder: "Paris" },
          { key: "legal_company_vat", label: "N° TVA intracommunautaire", placeholder: "FR12345678901" },
          { key: "legal_company_address", label: "Adresse du siège social", type: "textarea" },
          { key: "legal_publication_director", label: "Directeur de la publication" },
        ]}
      />

      <SettingsBlock
        title="Hébergeur"
        description="Nom et adresse de l'hébergeur du site (mention obligatoire). Renseigne ici ton propre hébergeur — c'est une mention légale requise."
        fields={[
          { key: "legal_host_name", label: "Nom de l'hébergeur", placeholder: "Ex : OVH SAS" },
          { key: "legal_host_address", label: "Adresse de l'hébergeur", type: "textarea", placeholder: "Ex : 2 rue Kellermann, 59100 Roubaix, France" },
        ]}
      />

      <SettingsBlock
        title="Mentions légales — Texte d'introduction"
        fields={[
          { key: "legal_mentions_intro", label: "Introduction", type: "textarea", hint: "Optionnel — affiché en haut de la page /mentions-legales." },
        ]}
      />

      <SettingsBlock
        title="Politique de confidentialité (RGPD)"
        description="Texte affiché sur /politique-confidentialite. Tu peux décrire les données collectées, finalités, durées et droits utilisateurs."
        fields={[
          { key: "legal_privacy_intro", label: "Introduction", type: "textarea" },
          { key: "legal_privacy_data_collected", label: "Données collectées", type: "textarea" },
          { key: "legal_privacy_purposes", label: "Finalités du traitement", type: "textarea" },
          { key: "legal_privacy_retention", label: "Durée de conservation", type: "textarea" },
          { key: "legal_privacy_rights", label: "Droits de l'utilisateur", type: "textarea" },
          { key: "legal_privacy_dpo_contact", label: "Contact DPO / délégué", placeholder: "dpo@mustagence.com" },
        ]}
      />

      <SettingsBlock
        title="CGV — Conditions générales de vente"
        description="Texte affiché sur /cgv (obligatoire pour les packs payants)."
        fields={[
          { key: "legal_cgv_intro", label: "Introduction", type: "textarea" },
          { key: "legal_cgv_prices", label: "Prix & paiement", type: "textarea" },
          { key: "legal_cgv_delivery", label: "Livraison / exécution des prestations", type: "textarea" },
          { key: "legal_cgv_withdrawal", label: "Droit de rétractation", type: "textarea" },
          { key: "legal_cgv_warranty", label: "Garanties", type: "textarea" },
          { key: "legal_cgv_disputes", label: "Litiges & droit applicable", type: "textarea" },
        ]}
      />

      <SettingsBlock
        title="CGU — Conditions générales d'utilisation"
        fields={[
          { key: "legal_cgu_intro", label: "Introduction", type: "textarea" },
          { key: "legal_cgu_access", label: "Accès au site", type: "textarea" },
          { key: "legal_cgu_obligations", label: "Obligations de l'utilisateur", type: "textarea" },
          { key: "legal_cgu_ip", label: "Propriété intellectuelle", type: "textarea" },
        ]}
      />

      <SettingsBlock
        title="Politique cookies"
        fields={[
          { key: "legal_cookies_intro", label: "Introduction", type: "textarea" },
          { key: "legal_cookies_essential", label: "Cookies essentiels", type: "textarea" },
          { key: "legal_cookies_analytics", label: "Cookies analytiques", type: "textarea" },
          { key: "legal_cookies_marketing", label: "Cookies marketing", type: "textarea" },
          { key: "legal_cookies_management", label: "Gestion du consentement", type: "textarea" },
        ]}
      />

      <SettingsBlock
        title="Bandeau de consentement cookies"
        description="Texte du bandeau affiché à la première visite."
        fields={[
          { key: "cookie_banner_text", label: "Message principal", type: "textarea", placeholder: "Nous utilisons des cookies pour améliorer votre expérience." },
          { key: "cookie_banner_accept", label: "Bouton — Accepter", placeholder: "Accepter" },
          { key: "cookie_banner_refuse", label: "Bouton — Refuser", placeholder: "Refuser" },
        ]}
      />
    </div>
  );
}
