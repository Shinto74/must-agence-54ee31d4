import LegalLayout from "@/components/legal/LegalLayout";
import { useSiteSettings } from "@/hooks/useSiteContent";

export default function PolitiqueConfidentialite() {
  const { get } = useSiteSettings();
  const company = get("legal_company_name", "MUST AGENCE");
  const email = get("contact_email", "contact@mustagence.com");
  const intro = get("legal_privacy_intro", "");
  const dataText = get("legal_privacy_data", "");
  const rights = get("legal_privacy_rights", "");

  return (
    <LegalLayout title="Politique de confidentialité" intro={intro}>
      <h2>1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement des données personnelles collectées sur ce site est <strong>{company}</strong>. Pour toute question, vous pouvez nous écrire à <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>2. Données collectées et finalités</h2>
      <p>{dataText}</p>

      <h2>3. Destinataires des données</h2>
      <p>
        Vos données sont destinées exclusivement aux équipes internes de {company} et, le cas échéant, à nos sous-traitants techniques (hébergeur, prestataire de paiement Stripe), liés par contrat aux mêmes obligations de confidentialité.
      </p>

      <h2>4. Sécurité</h2>
      <p>
        Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, altération, divulgation ou destruction.
      </p>

      <h2>5. Vos droits</h2>
      <p>{rights}</p>

      <h2>6. Cookies</h2>
      <p>
        Pour plus d'informations sur l'utilisation des cookies, consultez notre <a href="/politique-cookies">Politique cookies</a>.
      </p>
    </LegalLayout>
  );
}
