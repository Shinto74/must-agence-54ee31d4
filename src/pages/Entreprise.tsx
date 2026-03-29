import SubHero from "@/components/shared/SubHero";
import MarqueeText from "@/components/home/MarqueeText";
import ExpertisePillars from "@/components/shared/ExpertisePillars";
import ServiceCards from "@/components/shared/ServiceCards";
import ProcessSteps from "@/components/shared/ProcessSteps";
import StatsCounter from "@/components/home/StatsCounter";
import CtaBand from "@/components/home/CtaBand";
import ContactSection from "@/components/home/ContactSection";
import { SITE, ENTREPRISE_PAGE } from "@/lib/constants";
import {
  useStats, useExpertiseEntreprise, useServicesEntreprise, useProcessEntreprise,
} from "@/hooks/useSupabaseData";

const Entreprise = () => {
  const { data: stats } = useStats("entreprise");
  const { data: expertise } = useExpertiseEntreprise();
  const { data: services } = useServicesEntreprise();
  const { data: process } = useProcessEntreprise();

  return (
    <div>
      <SubHero
        logo={SITE.logoGreen}
        tag={ENTREPRISE_PAGE.hero.tag}
        titleLine1={ENTREPRISE_PAGE.hero.titleLine1}
        titleAccent={ENTREPRISE_PAGE.hero.titleAccent}
        description={ENTREPRISE_PAGE.hero.description}
        ctaPrimary={ENTREPRISE_PAGE.hero.ctaPrimary}
        ctaSecondary={ENTREPRISE_PAGE.hero.ctaSecondary}
        accentColor="white"
      />
      <MarqueeText words={ENTREPRISE_PAGE.marqueeWords} />
      <ExpertisePillars items={expertise || []} accentColor="white" />
      <ServiceCards services={services || []} accentColor="white" />
      <ProcessSteps steps={process || []} accentColor="white" />
      <StatsCounter items={stats || []} accentColor="white" />
      <CtaBand {...ENTREPRISE_PAGE.ctaBand} />
      <ContactSection
        heading={ENTREPRISE_PAGE.contact.heading}
        text={ENTREPRISE_PAGE.contact.text}
        subtext={ENTREPRISE_PAGE.contact.subtext}
        email={ENTREPRISE_PAGE.contact.email}
        whatsappUrl={SITE.contact.whatsappUrl}
        formOptions={ENTREPRISE_PAGE.contact.formOptions}
      />
    </div>
  );
};

export default Entreprise;
