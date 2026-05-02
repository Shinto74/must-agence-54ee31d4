import LegalLayout from "@/components/legal/LegalLayout";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { Button } from "@/components/ui/button";

export default function PolitiqueCookies() {
  const { get } = useSiteSettings();
  const intro = get("legal_cookies_intro", "");
  const list = get("legal_cookies_list", "");

  const reset = () => {
    localStorage.removeItem("cookie-consent");
    window.location.reload();
  };

  return (
    <LegalLayout title="Politique cookies" intro={intro}>
      <h2>1. Qu'est-ce qu'un cookie ?</h2>
      <p>
        Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite d'un site. Il permet au site de reconnaître votre navigateur et de mémoriser certaines informations.
      </p>

      <h2>2. Cookies utilisés sur ce site</h2>
      <p>{list}</p>

      <h2>3. Gérer vos préférences</h2>
      <p>
        Vous pouvez à tout moment modifier vos préférences en cliquant sur le bouton ci-dessous, ou en supprimant les cookies depuis les paramètres de votre navigateur.
      </p>
      <div className="mt-4">
        <Button onClick={reset} variant="outline">
          Modifier mes préférences cookies
        </Button>
      </div>

      <h2>4. Durée de conservation</h2>
      <p>
        Les cookies sont conservés au maximum 13 mois. Au-delà, votre consentement vous sera redemandé.
      </p>
    </LegalLayout>
  );
}
