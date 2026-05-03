import LegalLayout from "@/components/legal/LegalLayout";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { useLegalT } from "@/lib/i18n/legalStrings";

export default function PolitiqueConfidentialite() {
  const { get } = useSiteSettings();
  const t = useLegalT();
  const company = get("legal_company_name", "MUST AGENCE");
  const email = get("contact_email", "contact@mustagence.com");
  const intro = get("legal_privacy_intro", "");
  const dataText = get("legal_privacy_data", "");
  const rights = get("legal_privacy_rights", "");

  return (
    <LegalLayout title={t("privacy_title", "Politique de confidentialité")} intro={intro}>
      <h2>{t("privacy_h1", "1. Responsable du traitement")}</h2>
      <p>
        {t("privacy_p1_a", "Le responsable du traitement des données personnelles collectées sur ce site est")}{" "}
        <strong>{company}</strong>. {t("privacy_p1_b", "Pour toute question, vous pouvez nous écrire à")}{" "}
        <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>{t("privacy_h2", "2. Données collectées et finalités")}</h2>
      <p>{dataText}</p>

      <h2>{t("privacy_h3", "3. Destinataires des données")}</h2>
      <p>
        {t(
          "privacy_p3",
          "Vos données sont destinées exclusivement aux équipes internes de {company} et, le cas échéant, à nos sous-traitants techniques (hébergeur, prestataire de paiement Stripe), liés par contrat aux mêmes obligations de confidentialité.",
          { company }
        )}
      </p>

      <h2>{t("privacy_h4", "4. Sécurité")}</h2>
      <p>
        {t(
          "privacy_p4",
          "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, altération, divulgation ou destruction."
        )}
      </p>

      <h2>{t("privacy_h5", "5. Vos droits")}</h2>
      <p>{rights}</p>

      <h2>{t("privacy_h6", "6. Cookies")}</h2>
      <p>
        {t("privacy_p6_a", "Pour plus d'informations sur l'utilisation des cookies, consultez notre")}{" "}
        <a href="/politique-cookies">{t("privacy_p6_b", "Politique cookies")}</a>.
      </p>
    </LegalLayout>
  );
}
