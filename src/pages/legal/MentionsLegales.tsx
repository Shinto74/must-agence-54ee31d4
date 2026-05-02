import LegalLayout from "@/components/legal/LegalLayout";
import { useSiteSettings } from "@/hooks/useSiteContent";

export default function MentionsLegales() {
  const { get } = useSiteSettings();
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
    <LegalLayout title="Mentions légales" intro={intro}>
      <h2>1. Éditeur du site</h2>
      <p>
        <strong>{company}</strong> — {form} au capital de {capital}<br />
        Siège social : {address}<br />
        SIRET : {siret} — RCS {rcs}<br />
        N° TVA intracommunautaire : {vat}<br />
        Email : <a href={`mailto:${email}`}>{email}</a>{phone && <> — Tél : {phone}</>}
      </p>

      <h2>2. Directeur de la publication</h2>
      <p>{director}</p>

      <h2>3. Hébergeur</h2>
      <p>
        <strong>{hostName}</strong><br />
        {hostAddress}
      </p>

      <h2>4. Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus présents sur le site (textes, images, vidéos, logos, marques, structure) sont la propriété exclusive de {company} ou de leurs ayants droit.
        Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, est interdite sans autorisation écrite préalable, sous peine de poursuites au titre de la contrefaçon.
      </p>

      <h2>5. Responsabilité</h2>
      <p>
        {company} s'efforce de fournir des informations aussi précises que possible, mais ne saurait être tenue responsable des erreurs ou omissions, ni de l'utilisation faite de ces informations.
        Les liens hypertextes vers d'autres sites n'engagent pas la responsabilité de {company} quant à leur contenu.
      </p>

      <h2>6. Droit applicable</h2>
      <p>
        Les présentes mentions légales sont régies par le droit français. En cas de litige, et après échec de toute tentative de résolution amiable, les tribunaux français seront seuls compétents.
      </p>
    </LegalLayout>
  );
}
