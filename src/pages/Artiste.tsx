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
import {
  SITE, STATS, ARTISTE_PAGE, EXPERTISE_ARTISTE,
  SERVICES_ARTISTE, PROCESS_ARTISTE, PACKS, QUOTE_STEPS,
} from "@/lib/constants";

const Artiste = () => (
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
    <ExpertisePillars items={EXPERTISE_ARTISTE} accentColor="neon" />
    <ServiceCards services={SERVICES_ARTISTE} accentColor="neon" />
    <ProcessSteps steps={PROCESS_ARTISTE} accentColor="neon" />
    <StatsCounter items={STATS.artiste} accentColor="neon" />
    <PackCards packs={PACKS} />
    <CustomOffer
      text={ARTISTE_PAGE.customOffer.text}
      button={ARTISTE_PAGE.customOffer.button}
    />
    <QuoteWizard steps={QUOTE_STEPS} />
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

export default Artiste;
