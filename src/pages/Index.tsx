import Hero from "@/components/home/Hero";
import MarqueeText from "@/components/home/MarqueeText";
import StatsCounter from "@/components/home/StatsCounter";
import PolesGateway from "@/components/home/PolesGateway";
import ArtistReferences from "@/components/home/ArtistReferences";
import CompanyReferences from "@/components/home/CompanyReferences";
import Vision from "@/components/home/Vision";
import Team from "@/components/home/Team";
import Portfolio from "@/components/home/Portfolio";
import CtaBand from "@/components/home/CtaBand";
import ContactSection from "@/components/home/ContactSection";
import { SITE } from "@/lib/constants";
import { useStats, useTeam, useArtists, useClients, usePortfolio } from "@/hooks/useSupabaseData";

const Index = () => {
  const { data: stats } = useStats("home");
  const { data: team } = useTeam();
  const { data: artists } = useArtists();
  const { data: clients } = useClients();
  const { data: portfolio } = usePortfolio();

  return (
    <div>
      <Hero />
      <MarqueeText words={SITE.marqueeWords} />
      <StatsCounter items={stats || []} />
      <PolesGateway />
      <ArtistReferences categories={artists || []} />
      <CompanyReferences categories={clients || []} />
      <Vision />
      <Team members={team || []} />
      <Portfolio items={portfolio || []} />
      <CtaBand {...SITE.ctaBand} />
      <ContactSection
        heading={SITE.contact.heading}
        text={SITE.contact.text}
        subtext={SITE.contact.subtext}
        email={SITE.contact.email}
        whatsappUrl={SITE.contact.whatsappUrl}
        formOptions={["Pôle Artiste / Musique", "Pôle Corporate / Marque", "Autre"]}
      />
    </div>
  );
};

export default Index;
