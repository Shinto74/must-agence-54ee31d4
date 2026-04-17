import Hero from "@/components/home/Hero";
import MarqueeText from "@/components/home/MarqueeText";
import PolesGateway from "@/components/home/PolesGateway";
import ArtistReferences from "@/components/home/ArtistReferences";
import CompanyReferences from "@/components/home/CompanyReferences";
import Vision from "@/components/home/Vision";
import Team from "@/components/home/Team";
import CtaBand from "@/components/home/CtaBand";
import ContactSection from "@/components/home/ContactSection";
import { SITE } from "@/lib/constants";
import { useTeam, useArtists, useClients } from "@/hooks/useSupabaseData";

const Index = () => {
  const { data: team } = useTeam();
  const { data: artists } = useArtists();
  const { data: clients } = useClients();

  return (
    <div className="page-bg page-bg--home">
      <Hero />
      <MarqueeText words={SITE.marqueeWords} />
      <PolesGateway />
      <ArtistReferences categories={artists || []} />
      <CompanyReferences categories={clients || []} />
      <Vision />
      <Team members={team || []} />
      <CtaBand {...SITE.ctaBand} settingsPrefix="ctaband_home" />
      <ContactSection
        heading={SITE.contact.heading}
        text={SITE.contact.text}
        subtext={SITE.contact.subtext}
        email={SITE.contact.email}
        phone={SITE.contact.phone}
        location={SITE.contact.location}
        whatsappUrl={SITE.contact.whatsappUrl}
        formOptions={["Pôle Artiste / Musique", "Pôle Corporate / Marque", "Autre"]}
      />
    </div>
  );
};

export default Index;
