import SubHero from "@/components/shared/SubHero";
import MarqueeText from "@/components/home/MarqueeText";
import ExpertisePillars from "@/components/shared/ExpertisePillars";
import ServiceCards from "@/components/shared/ServiceCards";
import ProcessSteps from "@/components/shared/ProcessSteps";
import StatsCounter from "@/components/home/StatsCounter";
import PackCards from "@/components/artiste/PackCards";
import CustomOffer from "@/components/artiste/CustomOffer";
import QuoteWizard from "@/components/artiste/QuoteWizard";
import CtaBand from "@/components/home/CtaBand";
import ContactSection from "@/components/home/ContactSection";
import { SITE, ARTISTE_PAGE } from "@/lib/constants";
import {
  useStats, useExpertiseArtiste, useServicesArtiste,
  useProcessArtiste, usePacks, useQuoteSteps,
} from "@/hooks/useSupabaseData";

const Artiste = () => {
  const { data: stats } = useStats("artiste");
  const { data: expertise } = useExpertiseArtiste();
  const { data: services } = useServicesArtiste();
  const { data: process } = useProcessArtiste();
  const { data: packs } = usePacks();
  const { data: quoteSteps } = useQuoteSteps();

  return (
    <div>
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
      <StatsCounter items={stats || []} accentColor="neon" />
      <PackCards packs={packs || []} />
      <CustomOffer
        text={ARTISTE_PAGE.customOffer.text}
        button={ARTISTE_PAGE.customOffer.button}
      />
      <QuoteWizard steps={quoteSteps || []} />
      <CtaBand {...ARTISTE_PAGE.ctaBand} />
      <ContactSection
        heading={ARTISTE_PAGE.contact.heading}
        text={ARTISTE_PAGE.contact.text}
        subtext={ARTISTE_PAGE.contact.subtext}
        email={ARTISTE_PAGE.contact.email}
        whatsappUrl={SITE.contact.whatsappUrl}
        formOptions={ARTISTE_PAGE.contact.formOptions}
      />
    </div>
  );
};

export default Artiste;
