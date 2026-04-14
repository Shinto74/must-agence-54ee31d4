import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Video, Share2, Rocket, Search, ArrowRight, ChevronRight } from "lucide-react";
import ContactSection from "@/components/home/ContactSection";
import { SITE, ENTREPRISE_PAGE } from "@/lib/constants";

/* ═══ ANIMATION HELPERS ═══ */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ═══ HERO ═══ */
const EntrepriseHero = () => {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Burgundy atmospheric glow */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "hsl(var(--burgundy) / 0.12)" }} />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "hsl(var(--burgundy) / 0.06)" }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-28">
        <motion.div {...fadeUp(0)} className="rv flex items-center gap-3 mb-6">
          <div className="w-10 h-[2px] rounded-full bg-burgundy" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-burgundy-light">
            Pôle Entreprise
          </span>
        </motion.div>

        <motion.h1 {...fadeUp(0.1)}
          className="rv font-clash text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[0.95] mb-6 max-w-4xl"
        >
          Une stratégie digitale pensée pour les{" "}
          <span className="text-burgundy-light">entreprises ambitieuses</span>
        </motion.h1>

        <motion.p {...fadeUp(0.2)}
          className="rv text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed mb-10"
        >
          Nous accompagnons les marques dans leur croissance grâce à une approche
          complète : contenu, visibilité et performance.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="rv flex flex-col sm:flex-row gap-4">
          <a href="#contact"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-pill bg-burgundy text-burgundy-foreground font-mono text-sm uppercase tracking-wider transition-all duration-300 hover:brightness-125 hover:shadow-[0_0_30px_hsl(var(--burgundy)/0.3)]"
          >
            Demander un audit gratuit
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#services"
            className="px-8 py-4 rounded-pill border border-border text-foreground font-mono text-sm uppercase tracking-wider hover:border-burgundy-light/40 transition-all duration-300"
          >
            Nos services
          </a>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══ SERVICES ═══ */
const SERVICES = [
  {
    icon: <Video size={28} />,
    title: "Création de Contenu Premium",
    description: "Production de photos et vidéos professionnelles haute définition pour sublimer votre image de marque.",
    chips: ["Photo HD", "Vidéo corporate", "Motion design", "Drone"],
  },
  {
    icon: <Share2 size={28} />,
    title: "Social Media Management",
    description: "Gestion professionnelle de vos réseaux sociaux pour fédérer et engager votre communauté.",
    chips: ["Instagram", "TikTok", "LinkedIn", "Planning éditorial"],
  },
  {
    icon: <Rocket size={28} />,
    title: "Campagnes Publicitaires (Ads)",
    description: "Création et pilotage de campagnes ultra-performantes sur Google Ads, Meta Ads et TikTok Ads.",
    chips: ["Meta Ads", "Google Ads", "TikTok Ads", "Retargeting"],
  },
  {
    icon: <Search size={28} />,
    title: "SEO / Référencement Naturel",
    description: "Optimisation de votre visibilité sur les moteurs de recherche pour attirer un trafic qualifié.",
    chips: ["Audit SEO", "Netlinking", "Content SEO", "Local SEO"],
  },
];

const ServicesSection = () => {
  const ref = useScrollReveal();
  return (
    <section id="services" ref={ref} className="py-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        <motion.p {...fadeUp()} className="rv font-mono text-xs uppercase tracking-[0.2em] text-burgundy-light mb-2">
          Services
        </motion.p>
        <motion.h2 {...fadeUp(0.05)} className="rv font-clash text-3xl md:text-4xl font-bold text-foreground mb-14">
          Ce qu'on <span className="text-burgundy-light">fait pour vous</span>
        </motion.h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {SERVICES.map((svc, i) => (
            <motion.div key={svc.title} {...fadeUp(i * 0.08)}
              className="rv group rounded-2xl border border-border bg-surface p-8 transition-all duration-500 hover:border-burgundy/30 hover:-translate-y-1"
              style={{ boxShadow: "none" }}
              whileHover={{ boxShadow: "0 8px 40px hsl(var(--burgundy) / 0.08)" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300"
                style={{ background: "hsl(var(--burgundy) / 0.1)", color: "hsl(var(--burgundy-light))" }}>
                {svc.icon}
              </div>
              <h3 className="font-clash font-semibold text-foreground text-xl mb-3">{svc.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{svc.description}</p>
              <div className="flex flex-wrap gap-2">
                {svc.chips.map((chip) => (
                  <span key={chip}
                    className="px-3 py-1 rounded-full text-[10px] font-mono text-muted-foreground border border-border bg-background">
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══ EXPERTISE TERRAIN ═══ */
const SECTORS = [
  { name: "Gastronomie", emoji: "🍽️", desc: "Restaurants haut de gamme" },
  { name: "Hôtellerie", emoji: "🏨", desc: "Luxe & accueil" },
  { name: "Beauté & Bien-être", emoji: "💆", desc: "Cosmétiques & spa" },
  { name: "Sport & Fitness", emoji: "🏋️", desc: "Clubs & marques sportives" },
  { name: "Automobile", emoji: "🏎️", desc: "Concessionnaires & moto" },
  { name: "Grande Distribution", emoji: "🛒", desc: "Retail & enseignes" },
];

const ExpertiseSection = () => {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        <motion.p {...fadeUp()} className="rv font-mono text-xs uppercase tracking-[0.2em] text-burgundy-light mb-2">
          Expertise
        </motion.p>
        <motion.h2 {...fadeUp(0.05)} className="rv font-clash text-3xl md:text-4xl font-bold text-foreground mb-4">
          Des secteurs que l'on <span className="text-burgundy-light">maîtrise</span>
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="rv text-muted-foreground text-sm md:text-base max-w-xl mb-14">
          Notre expertise terrain nous permet de comprendre les enjeux de chaque industrie
          et d'adapter notre stratégie en conséquence.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SECTORS.map((sector, i) => (
            <motion.div key={sector.name} {...fadeUp(i * 0.06)}
              className="rv group relative rounded-2xl border border-border bg-surface p-6 md:p-8 text-center transition-all duration-500 hover:border-burgundy/30 hover:-translate-y-1 cursor-default"
              whileHover={{ boxShadow: "0 8px 40px hsl(var(--burgundy) / 0.08)" }}
            >
              <span className="text-3xl md:text-4xl block mb-3">{sector.emoji}</span>
              <h3 className="font-clash font-semibold text-foreground text-sm md:text-base mb-1">{sector.name}</h3>
              <p className="text-[11px] md:text-xs text-muted-foreground">{sector.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══ REFERENCES ═══ */
const REFERENCES = [
  { name: "Les Grands Buffets", subtitle: "Narbonne" },
  { name: "Leclerc", subtitle: "Grande distribution" },
  { name: "Novotel", subtitle: "Hôtellerie" },
  { name: "Basic-Fit", subtitle: "Sport & Fitness" },
  { name: "Yamaha", subtitle: "Automobile & Moto" },
];

const ReferencesSection = () => {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        <motion.p {...fadeUp()} className="rv font-mono text-xs uppercase tracking-[0.2em] text-burgundy-light mb-2">
          Références
        </motion.p>
        <motion.h2 {...fadeUp(0.05)} className="rv font-clash text-3xl md:text-4xl font-bold text-foreground mb-14">
          Ils nous font <span className="text-burgundy-light">confiance</span>
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {REFERENCES.map((r, i) => (
            <motion.div key={r.name} {...fadeUp(i * 0.06)}
              className="rv group rounded-2xl border border-border bg-surface p-6 text-center transition-all duration-400 hover:border-burgundy/30"
              whileHover={{ y: -3, boxShadow: "0 6px 30px hsl(var(--burgundy) / 0.06)" }}
            >
              <p className="font-clash font-bold text-foreground text-sm md:text-base mb-1">{r.name}</p>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{r.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══ CTA FINAL ═══ */
const FinalCta = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 px-6">
      <motion.div
        className="max-w-[1400px] mx-auto rounded-3xl px-8 py-16 md:py-20 text-center relative overflow-hidden"
        style={{ background: "hsl(var(--burgundy))" }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: "hsl(var(--burgundy-light) / 0.3)" }} />

        <h2 className="font-clash text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 relative z-10">
          Faites passer votre entreprise<br />au niveau supérieur
        </h2>
        <p className="text-white/70 text-sm md:text-base max-w-lg mx-auto mb-8 relative z-10">
          Stratégie sur-mesure, exécution premium et résultats mesurables.
        </p>
        <a href="#contact"
          className="relative z-10 group inline-flex items-center gap-3 px-10 py-4 rounded-pill bg-white text-burgundy font-mono text-sm uppercase tracking-wider font-bold transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:-translate-y-0.5"
        >
          Contactez-nous
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </motion.div>
    </section>
  );
};

/* ═══ PAGE ═══ */
const Entreprise = () => {
  return (
    <div className="page-bg page-bg--entreprise">
      <EntrepriseHero />
      <ServicesSection />
      <ExpertiseSection />
      <ReferencesSection />
      <FinalCta />
      <ContactSection
        heading={ENTREPRISE_PAGE.contact.heading}
        text={ENTREPRISE_PAGE.contact.text}
        subtext={ENTREPRISE_PAGE.contact.subtext}
        email={ENTREPRISE_PAGE.contact.email}
        phone={SITE.contact.phone}
        location={SITE.contact.location}
        whatsappUrl={SITE.contact.whatsappUrl}
        formOptions={ENTREPRISE_PAGE.contact.formOptions}
      />
    </div>
  );
};

export default Entreprise;
