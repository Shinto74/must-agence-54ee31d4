import LegalLayout from "@/components/legal/LegalLayout";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { useLegalT } from "@/lib/i18n/legalStrings";
import { Button } from "@/components/ui/button";

export default function PolitiqueCookies() {
  const { get } = useSiteSettings();
  const t = useLegalT();
  const intro = get("legal_cookies_intro", "");
  const list = get("legal_cookies_list", "");

  const reset = () => {
    localStorage.removeItem("cookie-consent");
    window.location.reload();
  };

  return (
    <LegalLayout title={t("cookies_title", "Politique cookies")} intro={intro}>
      <h2>{t("cookies_h1", "1. Qu'est-ce qu'un cookie ?")}</h2>
      <p>
        {t(
          "cookies_p1",
          "Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite d'un site. Il permet au site de reconnaître votre navigateur et de mémoriser certaines informations."
        )}
      </p>

      <h2>{t("cookies_h2", "2. Cookies utilisés sur ce site")}</h2>
      <p>{list}</p>

      <h2>{t("cookies_h3", "3. Gérer vos préférences")}</h2>
      <p>
        {t(
          "cookies_p3",
          "Vous pouvez à tout moment modifier vos préférences en cliquant sur le bouton ci-dessous, ou en supprimant les cookies depuis les paramètres de votre navigateur."
        )}
      </p>
      <div className="mt-4">
        <Button onClick={reset} variant="outline">
          {t("cookies_btn", "Modifier mes préférences cookies")}
        </Button>
      </div>

      <h2>{t("cookies_h4", "4. Durée de conservation")}</h2>
      <p>
        {t(
          "cookies_p4",
          "Les cookies sont conservés au maximum 13 mois. Au-delà, votre consentement vous sera redemandé."
        )}
      </p>
    </LegalLayout>
  );
}
