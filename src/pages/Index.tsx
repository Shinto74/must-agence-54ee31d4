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
import { SITE, STATS } from "@/lib/constants";

const Index = () => (
  <div>
    <Hero />
    <MarqueeText words={SITE.marqueeWords} />
    <StatsCounter items={STATS.home} />
    <PolesGateway />
    <ArtistReferences />
    <CompanyReferences />
    <Vision />
    <Team />
    <Portfolio />
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

export default Index;
