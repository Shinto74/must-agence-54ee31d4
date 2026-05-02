import LegalLayout from "@/components/legal/LegalLayout";
import { useSiteSettings } from "@/hooks/useSiteContent";

export default function CGV() {
  const { get } = useSiteSettings();
  const company = get("legal_company_name", "MUST AGENCE");
  const email = get("contact_email", "contact@mustagence.com");
  const intro = get("legal_cgv_intro", "");
  const prices = get("legal_cgv_prices", "");
  const withdrawal = get("legal_cgv_withdrawal", "");

  return (
    <LegalLayout title="Conditions Générales de Vente" intro={intro}>
      <h2>1. Objet</h2>
      <p>
        Les présentes CGV régissent l'ensemble des prestations vendues par <strong>{company}</strong> via son site internet. Toute commande implique l'acceptation pleine et entière des présentes CGV.
      </p>

      <h2>2. Prix et paiement</h2>
      <p>{prices}</p>

      <h2>3. Livraison des prestations</h2>
      <p>
        Les prestations débutent dès réception du paiement et de l'ensemble des éléments nécessaires à leur exécution. Les délais sont communiqués à titre indicatif et peuvent varier selon la complexité du projet.
      </p>

      <h2>4. Droit de rétractation</h2>
      <p>{withdrawal}</p>

      <h2>5. Garanties et responsabilité</h2>
      <p>
        {company} s'engage à exécuter les prestations avec tout le soin et la diligence en usage dans la profession (obligation de moyens). La responsabilité de {company} ne pourra excéder le montant total payé pour la prestation concernée.
      </p>

      <h2>6. Propriété intellectuelle</h2>
      <p>
        Les livrables deviennent la propriété du client après paiement intégral. {company} conserve le droit de mentionner les prestations dans son portfolio sauf demande contraire écrite du client.
      </p>

      <h2>7. Médiation et litiges</h2>
      <p>
        Conformément à l'article L.612-1 du Code de la consommation, le client consommateur peut recourir gratuitement au service de médiation de la consommation. Pour toute réclamation préalable : <a href={`mailto:${email}`}>{email}</a>. À défaut d'accord amiable, les tribunaux français seront compétents.
      </p>
    </LegalLayout>
  );
}
