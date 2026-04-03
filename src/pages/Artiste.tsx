import Hero from "@/components/home/Hero";
import MarqueeText from "@/components/home/MarqueeText";
import StatsCounter from "@/components/home/StatsCounter";
import ArtistReferences from "@/components/home/ArtistReferences";
import Vision from "@/components/home/Vision";
import Team from "@/components/home/Team";
import Portfolio from "@/components/home/Portfolio";
import SubHero from "@/components/shared/SubHero";
import ExpertisePillars from "@/components/shared/ExpertisePillars";
import ServiceCards from "@/components/shared/ServiceCards";
import ProcessSteps from "@/components/shared/ProcessSteps";
import PackCards from "@/components/artiste/PackCards";
import CustomOffer from "@/components/artiste/CustomOffer";
import QuoteWizard from "@/components/artiste/QuoteWizard";
import CtaBand from "@/components/home/CtaBand";
import ContactSection from "@/components/home/ContactSection";
import { SITE, ARTISTE_PAGE } from "@/lib/constants";
import {
  useStats, useTeam, useArtists, usePortfolio,
  useExpertiseArtiste, useServicesArtiste,
  useProcessArtiste, usePacks, useQuoteSteps,
} from "@/hooks/useSupabaseData";

const Artiste = () => {
  const { data: statsHome } = useStats("home");
  const { data: statsArtiste } = useStats("artiste");
  const { data: team } = useTeam();
  const { data: artists } = useArtists();
  const { data: portfolio } = usePortfolio();
  const { data: expertise } = useExpertiseArtiste();
  const { data: services } = useServicesArtiste();
  const { data: process } = useProcessArtiste();
  const { data: packs } = usePacks();
  const { data: quoteSteps } = useQuoteSteps();

  return (
    <div>
      <Hero />
      <MarqueeText words={SITE.marqueeWords} />
      <StatsCounter items={statsHome || []} />
      <SubHero
        logo={SITE.logoWhite}
        tag={ARTISTE_PAGE.hero.tag}
        titleLine1={ARTISTE_PAGE.hero.titleLine1}
        titleAccent={ARTISTE_PAGE.hero.titleAccent}
        description={ARTISTE_PAGE.hero.description}
        ctaPrimary={ARTISTE_PAGE.hero.ctaPrimary}
        ctaSecondary={ARTISTE_PAGE.hero.ctaSecondary}
        accentColor="neon"
      />
      <MarqueeText words={ARTISTE_PAGE.marqueeWords} />
      <ExpertisePillars items={expertise || []} accentColor="neon" />
      <ServiceCards services={services || []} accentColor="neon" />
      <ProcessSteps steps={process || []} accentColor="neon" />
      <StatsCounter items={statsArtiste || []} accentColor="neon" />
      <ArtistReferences categories={artists || []} />
      <PackCards packs={packs || []} />
      <CustomOffer
        text={ARTISTE_PAGE.customOffer.text}
        button={ARTISTE_PAGE.customOffer.button}
      />
      <QuoteWizard steps={quoteSteps || []} />
      <Vision />
      <Team members={team || []} />
      <Portfolio items={portfolio || []} />
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
