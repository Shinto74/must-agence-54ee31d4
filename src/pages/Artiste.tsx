import Hero from "@/components/home/Hero";
import MarqueeText from "@/components/home/MarqueeText";
import ArtistReferences from "@/components/home/ArtistReferences";
import Vision from "@/components/home/Vision";
import Team from "@/components/home/Team";
import PackCards from "@/components/artiste/PackCards";
import ArtisteServicesV4B from "@/components/artiste/ArtisteServicesV4B";
import CtaBand from "@/components/home/CtaBand";
import ContactSection from "@/components/home/ContactSection";
import { SITE, ARTISTE_PAGE, PACKS, QUOTE_STEPS } from "@/lib/constants";
import { useTeam, useArtists } from "@/hooks/useSupabaseData";

const Artiste = () => {
  const { data: team } = useTeam();
  const { data: artists } = useArtists();

  return (
    <div className="page-bg page-bg--artiste">
      <Hero />
      <MarqueeText logos={ARTISTE_PAGE.marqueeLogos} />
      <ArtisteServicesV4B />
      <ArtistReferences categories={artists || []} />
      <PackCards packs={PACKS} quoteSteps={QUOTE_STEPS} />
      <Vision />
      <Team members={team || []} />
      <CtaBand {...ARTISTE_PAGE.ctaBand} />
      <ContactSection
        heading={ARTISTE_PAGE.contact.heading}
        text={ARTISTE_PAGE.contact.text}
        subtext={ARTISTE_PAGE.contact.subtext}
        email={ARTISTE_PAGE.contact.email}
        phone={SITE.contact.phone}
        location={SITE.contact.location}
        whatsappUrl={SITE.contact.whatsappUrl}
        formOptions={ARTISTE_PAGE.contact.formOptions}
      />
    </div>
  );
};

export default Artiste;
