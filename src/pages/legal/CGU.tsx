import LegalLayout from "@/components/legal/LegalLayout";
import { useSiteSettings } from "@/hooks/useSiteContent";

export default function CGU() {
  const { get } = useSiteSettings();
  const company = get("legal_company_name", "MUST AGENCE");
  const intro = get("legal_cgu_intro", "");
  const rules = get("legal_cgu_rules", "");

  return (
    <LegalLayout title="Conditions Générales d'Utilisation" intro={intro}>
      <h2>1. Accès au site</h2>
      <p>
        Le site est accessible gratuitement à tout utilisateur disposant d'un accès internet. Les frais de connexion sont à la charge de l'utilisateur. {company} se réserve le droit d'interrompre, de suspendre ou de modifier l'accès au site sans préavis pour des raisons techniques ou de maintenance.
      </p>

      <h2>2. Règles d'utilisation</h2>
      <p>{rules}</p>

      <h2>3. Propriété intellectuelle</h2>
      <p>
        L'utilisateur reconnaît que les contenus du site sont protégés par le droit de la propriété intellectuelle et s'interdit toute reproduction ou exploitation sans autorisation préalable écrite.
      </p>

      <h2>4. Données personnelles</h2>
      <p>
        Le traitement des données personnelles est régi par notre <a href="/politique-confidentialite">Politique de confidentialité</a>.
      </p>

      <h2>5. Modifications</h2>
      <p>
        {company} se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs sont invités à les consulter régulièrement.
      </p>
    </LegalLayout>
  );
}
