import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Static EN translations for legal page scaffolding (titles, fixed paragraphs).
 * Dynamic content (intros, paragraphs editable in admin) goes through site_settings translations.
 */
const EN: Record<string, string> = {
  // Common
  back_home: "Back to home",
  last_updated: "Last updated",

  // CGU
  cgu_title: "Terms of Use",
  cgu_h1: "1. Site access",
  cgu_p1:
    "The site is freely accessible to any user with internet access. Connection costs are borne by the user. {company} reserves the right to interrupt, suspend or modify access to the site without notice for technical or maintenance reasons.",
  cgu_h2: "2. Rules of use",
  cgu_h3: "3. Intellectual property",
  cgu_p3:
    "The user acknowledges that the site's content is protected by intellectual property law and refrains from any reproduction or use without prior written authorization.",
  cgu_h4: "4. Personal data",
  cgu_p4_a: "Personal data processing is governed by our",
  cgu_p4_b: "Privacy Policy",
  cgu_h5: "5. Changes",
  cgu_p5:
    "{company} reserves the right to modify these Terms at any time. Users are encouraged to review them regularly.",

  // CGV
  cgv_title: "Terms of Sale",
  cgv_h1: "1. Purpose",
  cgv_p1:
    "These Terms govern all services sold by {company} through its website. Any order implies full and unreserved acceptance of these Terms.",
  cgv_h2: "2. Pricing & payment",
  cgv_h3: "3. Service delivery",
  cgv_p3:
    "Services begin upon receipt of payment and all materials needed for execution. Timelines are indicative and may vary depending on project complexity.",
  cgv_h4: "4. Right of withdrawal",
  cgv_h5: "5. Warranties & liability",
  cgv_p5:
    "{company} undertakes to perform services with the care and diligence customary in the profession (best-efforts obligation). {company}'s liability cannot exceed the total amount paid for the relevant service.",
  cgv_h6: "6. Intellectual property",
  cgv_p6:
    "Deliverables become the client's property upon full payment. {company} retains the right to feature the work in its portfolio unless the client requests otherwise in writing.",
  cgv_h7: "7. Mediation & disputes",
  cgv_p7_a:
    "Under article L.612-1 of the French Consumer Code, consumer clients may use a free consumer mediation service. For prior claims:",
  cgv_p7_b:
    "If no amicable resolution is reached, the French courts shall have jurisdiction.",

  // Mentions légales
  mentions_title: "Legal notice",
  mentions_h1: "1. Site publisher",
  mentions_capital_at: "— {form} with share capital of {capital}",
  mentions_office: "Registered office",
  mentions_siret: "SIRET",
  mentions_rcs: "RCS",
  mentions_vat: "EU VAT number",
  mentions_email: "Email",
  mentions_phone: "Phone",
  mentions_h2: "2. Publication director",
  mentions_h3: "3. Hosting provider",
  mentions_h4: "4. Intellectual property",
  mentions_p4:
    "All content on the site (text, images, video, logos, trademarks, structure) is the exclusive property of {company} or its rights holders. Any reproduction, representation, modification, publication or adaptation, in whole or in part, is prohibited without prior written authorization, under penalty of infringement proceedings.",
  mentions_h5: "5. Liability",
  mentions_p5:
    "{company} strives to provide information that is as accurate as possible but cannot be held liable for errors, omissions or for the use made of this information. Hyperlinks to other sites do not engage {company}'s responsibility for their content.",
  mentions_h6: "6. Governing law",
  mentions_p6:
    "These legal notices are governed by French law. In the event of a dispute, and after any attempt at amicable resolution has failed, the French courts shall have exclusive jurisdiction.",

  // Politique de confidentialité
  privacy_title: "Privacy Policy",
  privacy_h1: "1. Data controller",
  privacy_p1_a: "The controller of personal data collected on this site is",
  privacy_p1_b: "For any question, write to us at",
  privacy_h2: "2. Data collected & purposes",
  privacy_h3: "3. Data recipients",
  privacy_p3:
    "Your data is intended exclusively for {company}'s internal teams and, where applicable, our technical subprocessors (hosting provider, Stripe payment provider), bound by contract to the same confidentiality obligations.",
  privacy_h4: "4. Security",
  privacy_p4:
    "We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure or destruction.",
  privacy_h5: "5. Your rights",
  privacy_h6: "6. Cookies",
  privacy_p6_a: "For more information on cookie use, see our",
  privacy_p6_b: "Cookie Policy",

  // Cookies
  cookies_title: "Cookie Policy",
  cookies_h1: "1. What is a cookie?",
  cookies_p1:
    "A cookie is a small text file placed on your device when visiting a site. It allows the site to recognize your browser and remember certain information.",
  cookies_h2: "2. Cookies used on this site",
  cookies_h3: "3. Manage your preferences",
  cookies_p3:
    "You can change your preferences at any time by clicking the button below, or by deleting cookies in your browser settings.",
  cookies_btn: "Update my cookie preferences",
  cookies_h4: "4. Retention period",
  cookies_p4:
    "Cookies are kept for a maximum of 13 months. After that, your consent will be requested again.",
};

const FR: Record<string, string> = {
  back_home: "Retour à l'accueil",
  last_updated: "Dernière mise à jour",
};

export function useLegalT() {
  const { lang } = useLanguage();
  return (key: string, frFallback: string, vars?: Record<string, string>): string => {
    let raw = lang === "en" ? EN[key] : (FR[key] ?? frFallback);
    if (raw === undefined) raw = frFallback;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        raw = raw.split(`{${k}}`).join(v);
      }
    }
    return raw;
  };
}
