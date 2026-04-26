import Hero from "@/components/home/Hero";
import MarqueeText from "@/components/home/MarqueeText";
import ArtistReferences from "@/components/home/ArtistReferences";
import Vision from "@/components/home/Vision";
import Team from "@/components/home/Team";
import PackCards from "@/components/artiste/PackCards";
import ArtisteServicesV4B from "@/components/artiste/ArtisteServicesV4B";
import ClipPortugal from "@/components/artiste/ClipPortugal";
import TheArtistShowcase from "@/components/artiste/TheArtistShowcase";
import CtaBand from "@/components/home/CtaBand";
import ContactSection from "@/components/home/ContactSection";
import { SITE, ARTISTE_PAGE, QUOTE_STEPS } from "@/lib/constants";
import { useTeam, useArtists, usePacks } from "@/hooks/useSupabaseData";
import { useSiteSettings } from "@/hooks/useSiteContent";

const Artiste = () => {
  const { data: team } = useTeam();
  const { data: artists } = useArtists();
  const { data: packs = [] } = usePacks();
  const { get } = useSiteSettings();

  return (
    <div className="page-bg page-bg--artiste">
      <Hero />
      <MarqueeText logos={ARTISTE_PAGE.marqueeLogos} />
      <ArtisteServicesV4B />
      <ArtistReferences categories={artists || []} />
      <PackCards packs={packs as any} quoteSteps={QUOTE_STEPS} />
      <TheArtistShowcase />
      <ClipPortugal />
      <Vision />
      <Team members={team || []} />
      <CtaBand {...ARTISTE_PAGE.ctaBand} settingsPrefix="ctaband_artiste" />
      <ContactSection
        heading={get("contact_artiste_heading", ARTISTE_PAGE.contact.heading)}
        text={get("contact_artiste_text", ARTISTE_PAGE.contact.text)}
        subtext={get("contact_artiste_subtext", ARTISTE_PAGE.contact.subtext)}
        email={get("contact_email", ARTISTE_PAGE.contact.email)}
        phone={get("contact_phone", SITE.contact.phone)}
        location={get("contact_location", SITE.contact.location)}
        whatsappUrl={SITE.contact.whatsappUrl}
        formOptions={ARTISTE_PAGE.contact.formOptions}
      />
    </div>
  );
};

export default Artiste;
