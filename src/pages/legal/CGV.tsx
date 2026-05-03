import LegalLayout from "@/components/legal/LegalLayout";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { useLegalT } from "@/lib/i18n/legalStrings";

export default function CGV() {
  const { get } = useSiteSettings();
  const t = useLegalT();
  const company = get("legal_company_name", "MUST AGENCE");
  const email = get("contact_email", "contact@mustagence.com");
  const intro = get("legal_cgv_intro", "");
  const prices = get("legal_cgv_prices", "");
  const withdrawal = get("legal_cgv_withdrawal", "");

  return (
    <LegalLayout title={t("cgv_title", "Conditions Générales de Vente")} intro={intro}>
      <h2>{t("cgv_h1", "1. Objet")}</h2>
      <p>
        {t(
          "cgv_p1",
          "Les présentes CGV régissent l'ensemble des prestations vendues par {company} via son site internet. Toute commande implique l'acceptation pleine et entière des présentes CGV.",
          { company: "§§§" }
        )
          .split("§§§")
          .map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && <strong>{company}</strong>}
            </span>
          ))}
      </p>

      <h2>{t("cgv_h2", "2. Prix et paiement")}</h2>
      <p>{prices}</p>

      <h2>{t("cgv_h3", "3. Livraison des prestations")}</h2>
      <p>
        {t(
          "cgv_p3",
          "Les prestations débutent dès réception du paiement et de l'ensemble des éléments nécessaires à leur exécution. Les délais sont communiqués à titre indicatif et peuvent varier selon la complexité du projet."
        )}
      </p>

      <h2>{t("cgv_h4", "4. Droit de rétractation")}</h2>
      <p>{withdrawal}</p>

      <h2>{t("cgv_h5", "5. Garanties et responsabilité")}</h2>
      <p>
        {t(
          "cgv_p5",
          "{company} s'engage à exécuter les prestations avec tout le soin et la diligence en usage dans la profession (obligation de moyens). La responsabilité de {company} ne pourra excéder le montant total payé pour la prestation concernée.",
          { company }
        )}
      </p>

      <h2>{t("cgv_h6", "6. Propriété intellectuelle")}</h2>
      <p>
        {t(
          "cgv_p6",
          "Les livrables deviennent la propriété du client après paiement intégral. {company} conserve le droit de mentionner les prestations dans son portfolio sauf demande contraire écrite du client.",
          { company }
        )}
      </p>

      <h2>{t("cgv_h7", "7. Médiation et litiges")}</h2>
      <p>
        {t(
          "cgv_p7_a",
          "Conformément à l'article L.612-1 du Code de la consommation, le client consommateur peut recourir gratuitement au service de médiation de la consommation. Pour toute réclamation préalable :"
        )}{" "}
        <a href={`mailto:${email}`}>{email}</a>.{" "}
        {t(
          "cgv_p7_b",
          "À défaut d'accord amiable, les tribunaux français seront compétents."
        )}
      </p>
    </LegalLayout>
  );
}
