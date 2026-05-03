import LegalLayout from "@/components/legal/LegalLayout";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { useLegalT } from "@/lib/i18n/legalStrings";

export default function MentionsLegales() {
  const { get } = useSiteSettings();
  const t = useLegalT();
  const company = get("legal_company_name", "MUST AGENCE");
  const form = get("legal_company_form", "SASU");
  const capital = get("legal_company_capital", "1 000 €");
  const siret = get("legal_company_siret", "—");
  const rcs = get("legal_company_rcs", "Paris");
  const vat = get("legal_company_vat", "—");
  const address = get("legal_company_address", "Paris, France");
  const director = get("legal_publication_director", "—");
  const hostName = get("legal_host_name", "—");
  const hostAddress = get("legal_host_address", "—");
  const email = get("contact_email", "contact@mustagence.com");
  const phone = get("contact_phone", "");
  const intro = get("legal_mentions_intro", "");

  return (
    <LegalLayout title={t("mentions_title", "Mentions légales")} intro={intro}>
      <h2>{t("mentions_h1", "1. Éditeur du site")}</h2>
      <p>
        <strong>{company}</strong>{" "}
        {t("mentions_capital_at", "— {form} au capital de {capital}", { form, capital })}
        <br />
        {t("mentions_office", "Siège social")} : {address}
        <br />
        {t("mentions_siret", "SIRET")} : {siret} — {t("mentions_rcs", "RCS")} {rcs}
        <br />
        {t("mentions_vat", "N° TVA intracommunautaire")} : {vat}
        <br />
        {t("mentions_email", "Email")} : <a href={`mailto:${email}`}>{email}</a>
        {phone && <> — {t("mentions_phone", "Tél")} : {phone}</>}
      </p>

      <h2>{t("mentions_h2", "2. Directeur de la publication")}</h2>
      <p>{director}</p>

      <h2>{t("mentions_h3", "3. Hébergeur")}</h2>
      <p>
        <strong>{hostName}</strong>
        <br />
        {hostAddress}
      </p>

      <h2>{t("mentions_h4", "4. Propriété intellectuelle")}</h2>
      <p>
        {t(
          "mentions_p4",
          "L'ensemble des contenus présents sur le site (textes, images, vidéos, logos, marques, structure) sont la propriété exclusive de {company} ou de leurs ayants droit. Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, est interdite sans autorisation écrite préalable, sous peine de poursuites au titre de la contrefaçon.",
          { company }
        )}
      </p>

      <h2>{t("mentions_h5", "5. Responsabilité")}</h2>
      <p>
        {t(
          "mentions_p5",
          "{company} s'efforce de fournir des informations aussi précises que possible, mais ne saurait être tenue responsable des erreurs ou omissions, ni de l'utilisation faite de ces informations. Les liens hypertextes vers d'autres sites n'engagent pas la responsabilité de {company} quant à leur contenu.",
          { company }
        )}
      </p>

      <h2>{t("mentions_h6", "6. Droit applicable")}</h2>
      <p>
        {t(
          "mentions_p6",
          "Les présentes mentions légales sont régies par le droit français. En cas de litige, et après échec de toute tentative de résolution amiable, les tribunaux français seront seuls compétents."
        )}
      </p>
    </LegalLayout>
  );
}
