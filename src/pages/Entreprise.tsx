import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Video, Share2, Rocket, Search, ArrowRight, ChevronRight,
} from "lucide-react";
import ContactSection from "@/components/home/ContactSection";
import { SITE, ENTREPRISE_PAGE } from "@/lib/constants";
import sectorGastronomie from "@/assets/sector-gastronomie.jpg";
import sectorHotellerie from "@/assets/sector-hotellerie.jpg";
import sectorBeaute from "@/assets/sector-beaute.jpg";
import sectorSport from "@/assets/sector-sport.jpg";
import sectorAutomobile from "@/assets/sector-automobile.jpg";
import sectorDistribution from "@/assets/sector-distribution.jpg";
import heroVideoAsset from "@/assets/entreprise-hero-video.mp4.asset.json";

/* ═══ ANIMATION HELPERS ═══ */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 50 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.9, delay, ease: EASE } as const,
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 } as const,
  whileInView: { opacity: 1 } as const,
  viewport: { once: true } as const,
  transition: { duration: 1, delay, ease: EASE } as const,
});

/* ═══ COUNTER ANIMATION ═══ */
const AnimatedCounter = ({ value, suffix = "" }: { value: string; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");
  const num = parseInt(value.replace(/\D/g, ""));

  useEffect(() => {
    if (!inView || isNaN(num)) return;
    let start = 0;
    const duration = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * num).toString());
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, num]);

  return <span ref={ref}>{isNaN(num) ? value : display}{suffix}</span>;
};

/* ═══ HERO WITH VIDEO ═══ */
const EntrepriseHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video background */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: videoScale }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={heroVideoAsset.url}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
        {/* Gold tint overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(43 52% 39% / 0.3) 0%, transparent 60%)" }} />
        {/* Bottom gradient fade to cream */}
        <div className="absolute bottom-0 left-0 right-0 h-40" style={{ background: "linear-gradient(to bottom, transparent, #FAF9F6)" }} />
      </motion.div>

      {/* Grain texture overlay */}
      <div className="absolute inset-0 pointer-events-none z-[2] opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

      <motion.div style={{ y: yText, opacity }} className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-32">
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <motion.div className="w-12 h-[1.5px] bg-white/70"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
            style={{ transformOrigin: "left" }}
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/80 font-medium">
            Pôle Entreprise
          </span>
        </motion.div>

        <motion.h1
          className="font-clash text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-black text-white leading-[0.92] mb-8 max-w-5xl drop-shadow-lg"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.15, ease: EASE }}
        >
          Une stratégie digitale
          <br />
          <span className="text-burgundy-light" style={{ textShadow: "0 0 40px hsl(43 55% 55% / 0.5)" }}>pensée pour performer</span>
        </motion.h1>

        <motion.p
          className="text-white/75 text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed mb-12 font-light"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: EASE }}
        >
          Nous accompagnons les marques ambitieuses dans leur croissance
          grâce à une approche complète : contenu, visibilité et performance mesurable.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
        >
          <motion.a href="#contact"
            className="group inline-flex items-center gap-3 px-10 py-4.5 rounded-full font-mono text-sm uppercase tracking-wider transition-all duration-500"
            style={{
              background: "linear-gradient(135deg, hsl(43 52% 39%), hsl(43 55% 55%))",
              color: "#fff",
              boxShadow: "0 0 0 1px hsl(43 55% 55% / 0.3), 0 8px 30px hsl(43 52% 39% / 0.25)",
            }}
            whileHover={{
              y: -2,
              boxShadow: "0 0 0 1px hsl(43 55% 55% / 0.5), 0 12px 50px hsl(43 52% 39% / 0.4), 0 0 80px hsl(43 55% 55% / 0.15)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Demander un audit gratuit
            <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </motion.a>
          <motion.a href="#services"
            className="group px-10 py-4.5 rounded-full font-mono text-sm uppercase tracking-wider transition-all duration-500 text-white/60 hover:text-white"
            style={{ border: "1px solid rgba(255,255,255,0.2)" }}
            whileHover={{
              borderColor: "rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            Découvrir nos services
          </motion.a>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="mt-20 pt-10 flex flex-wrap gap-12 md:gap-20"
          style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
        >
          {[
            { value: "150", suffix: "+", label: "Projets livrés" },
            { value: "98", suffix: "%", label: "Clients satisfaits" },
            { value: "3", suffix: "M+", label: "Vues générées" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-clash text-3xl md:text-4xl font-black text-burgundy-light mb-1 drop-shadow-md">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ═══ MARQUEE SEPARATOR ═══ */
const MarqueeSep = () => (
  <div className="overflow-hidden py-8" style={{ borderTop: "1px solid hsl(var(--border))", borderBottom: "1px solid hsl(var(--border))" }}>
    <div className="flex gap-16 animate-mq whitespace-nowrap">
      {[...Array(3)].flatMap((_, i) =>
        ["CONTENU", "SOCIAL MEDIA", "ADS", "SEO", "STRATÉGIE", "GROWTH", "INFLUENCE", "BRANDING"].map((w, j) => (
          <span key={`${i}-${j}`} className="font-clash text-sm md:text-base font-semibold tracking-[0.15em] text-foreground/10 uppercase flex items-center gap-6">
            {w}
            <span className="w-1.5 h-1.5 rounded-full bg-burgundy-light/50" />
          </span>
        ))
      )}
    </div>
  </div>
);

/* ═══ SERVICES ═══ */
const SERVICES = [
  {
    icon: <Video size={24} />,
    num: "01",
    title: "Création de Contenu Premium",
    description: "Production de photos et vidéos professionnelles haute définition pour sublimer votre image de marque.",
    chips: ["Photo HD", "Vidéo corporate", "Motion design", "Drone"],
  },
  {
    icon: <Share2 size={24} />,
    num: "02",
    title: "Social Media Management",
    description: "Gestion professionnelle de vos réseaux sociaux pour fédérer et engager votre communauté.",
    chips: ["Instagram", "TikTok", "LinkedIn", "Planning éditorial"],
  },
  {
    icon: <Rocket size={24} />,
    num: "03",
    title: "Campagnes Publicitaires",
    description: "Création et pilotage de campagnes ultra-performantes sur Google Ads, Meta Ads et TikTok Ads.",
    chips: ["Meta Ads", "Google Ads", "TikTok Ads", "Retargeting"],
  },
  {
    icon: <Search size={24} />,
    num: "04",
    title: "SEO & Référencement",
    description: "Optimisation de votre visibilité sur les moteurs de recherche pour attirer un trafic qualifié.",
    chips: ["Audit SEO", "Netlinking", "Content SEO", "Local SEO"],
  },
];

const ServicesSection = () => {
  const ref = useScrollReveal();
  return (
    <section id="services" ref={ref} className="py-28 md:py-40 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-[1fr_2fr] gap-16 md:gap-20">
          {/* Left sticky header */}
          <div className="md:sticky md:top-32 md:self-start">
            <motion.div {...fadeUp()} className="rv flex items-center gap-3 mb-4">
              <div className="w-8 h-[1.5px] bg-burgundy-light" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-burgundy-light">Services</span>
            </motion.div>
            <motion.h2 {...fadeUp(0.05)} className="rv font-clash text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight mb-5">
              Ce qu'on fait
              <br />
              <span className="text-burgundy-light">pour vous</span>
            </motion.h2>
            <motion.p {...fadeUp(0.1)} className="rv text-muted-foreground text-sm leading-relaxed max-w-sm">
              Chaque service est conçu pour maximiser votre impact digital
              et générer un retour mesurable.
            </motion.p>
          </div>

          {/* Right — cards */}
          <div className="space-y-6">
            {SERVICES.map((svc, i) => (
              <motion.div key={svc.title} {...fadeUp(i * 0.1)}
                className="rv group relative rounded-2xl p-8 md:p-10 transition-all duration-700 cursor-default overflow-hidden"
                style={{
                  background: "hsl(var(--foreground) / 0.03)",
                  border: "1px solid hsl(var(--foreground) / 0.06)",
                }}
                whileHover={{
                  borderColor: "hsl(43 52% 39% / 0.25)",
                  background: "hsl(var(--foreground) / 0.05)",
                  y: -4,
                }}
              >
                {/* Hover glow */}
                <div className="absolute -top-20 -right-20 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: "radial-gradient(circle, hsl(43 55% 55% / 0.1) 0%, transparent 70%)" }} />

                <div className="relative z-10 flex gap-6">
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105"
                      style={{
                        background: "hsl(43 52% 39% / 0.1)",
                        border: "1px solid hsl(43 55% 55% / 0.15)",
                        color: "hsl(43 55% 55%)",
                      }}>
                      {svc.icon}
                    </div>
                    <span className="block mt-3 font-mono text-[10px] text-muted-foreground/40 text-center">{svc.num}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-clash font-bold text-foreground text-lg md:text-xl mb-3 group-hover:text-burgundy-light transition-colors duration-500">
                      {svc.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{svc.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {svc.chips.map((chip) => (
                        <span key={chip}
                          className="px-3 py-1.5 rounded-full text-[10px] font-mono text-muted-foreground/60 transition-all duration-300 group-hover:text-muted-foreground"
                          style={{ border: "1px solid hsl(var(--foreground) / 0.06)", background: "hsl(var(--foreground) / 0.02)" }}>
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══ EXPERTISE TERRAIN — IMMERSIVE ═══ */
const SECTORS = [
  { name: "Gastronomie", img: sectorGastronomie, desc: "Restaurants & traiteurs haut de gamme" },
  { name: "Hôtellerie", img: sectorHotellerie, desc: "Luxe, accueil & expérience client" },
  { name: "Beauté & Bien-être", img: sectorBeaute, desc: "Cosmétiques, spa & wellness" },
  { name: "Sport & Fitness", img: sectorSport, desc: "Clubs, marques & athlètes" },
  { name: "Automobile", img: sectorAutomobile, desc: "Concessionnaires & moto" },
  { name: "Grande Distribution", img: sectorDistribution, desc: "Retail & enseignes nationales" },
];

const ExpertiseSection = () => {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="py-28 md:py-40 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, hsl(43 55% 55% / 0.25), transparent)" }} />

      <div className="max-w-[1400px] mx-auto">
        <motion.div {...fadeUp()} className="rv text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1.5px] bg-burgundy-light" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-burgundy-light">Expertise terrain</span>
            <div className="w-8 h-[1.5px] bg-burgundy-light" />
          </div>
          <h2 className="font-clash text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-5">
            Des secteurs que l'on
            <span className="text-burgundy-light"> maîtrise</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Notre expertise nous permet de comprendre les enjeux spécifiques de chaque industrie
            et d'adapter notre stratégie en conséquence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SECTORS.map((sector, i) => (
            <motion.div key={sector.name} {...fadeUp(i * 0.08)}
              className="rv group relative rounded-2xl cursor-default transition-all duration-700 overflow-hidden aspect-[4/3]"
              style={{ border: "1px solid hsl(var(--foreground) / 0.08)" }}
              whileHover={{ y: -6, borderColor: "hsl(43 55% 55% / 0.3)" }}
            >
              {/* Image */}
              <img
                src={sector.img}
                alt={sector.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                width={800}
                height={600}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/90" />
              {/* Burgundy hover tint */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: "linear-gradient(to top, hsl(43 52% 39% / 0.35), transparent 60%)" }} />

              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                <h3 className="font-clash font-bold text-white text-xl md:text-2xl mb-1 group-hover:text-burgundy-foreground transition-colors duration-500 drop-shadow-lg">
                  {sector.name}
                </h3>
                <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors duration-500">{sector.desc}</p>
              </div>
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
    <section ref={ref} className="py-28 md:py-36 px-6">
      <div className="max-w-[1400px] mx-auto text-center">
        <motion.div {...fadeUp()} className="rv mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1.5px] bg-burgundy-light" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-burgundy-light">Références</span>
            <div className="w-8 h-[1.5px] bg-burgundy-light" />
          </div>
          <h2 className="font-clash text-3xl md:text-4xl lg:text-5xl font-black text-foreground">
            Ils nous font <span className="text-burgundy-light">confiance</span>
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-5 md:gap-6">
          {REFERENCES.map((r, i) => (
            <motion.div key={r.name} {...fadeUp(i * 0.08)}
              className="rv group px-10 py-8 rounded-2xl transition-all duration-700 cursor-default min-w-[180px]"
              style={{
                background: "hsl(var(--foreground) / 0.02)",
                border: "1px solid hsl(var(--foreground) / 0.06)",
              }}
              whileHover={{
                y: -4,
                borderColor: "hsl(43 55% 55% / 0.25)",
                boxShadow: "0 12px 40px hsl(43 52% 39% / 0.1)",
              }}
            >
              <p className="font-clash font-black text-foreground text-base md:text-lg mb-1">{r.name}</p>
              <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[0.15em]">{r.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══ CTA FINAL — IMMERSIVE GOLD ═══ */
const FinalCta = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 px-6">
      <motion.div
        className="max-w-[1400px] mx-auto rounded-[2rem] px-8 md:px-16 py-20 md:py-28 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(43 60% 22%), hsl(43 52% 39%), hsl(43 60% 22%))" }}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 1, ease: EASE }}
      >
        {/* Glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "hsl(43 55% 55% / 0.25)" }} />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: "hsl(43 55% 55% / 0.15)" }} />
        {/* Grain */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

        <motion.div className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6">Prêt à grandir ?</p>
          <h2 className="font-clash text-3xl md:text-4xl lg:text-[3.5rem] font-black text-white leading-tight mb-6">
            Faites passer votre entreprise
            <br />
            au niveau supérieur
          </h2>
          <p className="text-white/50 text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed">
            Stratégie sur-mesure, exécution premium et résultats mesurables.
            Chaque projet est une mission.
          </p>
          <motion.a href="#contact"
            className="group inline-flex items-center gap-3 px-12 py-5 rounded-full font-mono text-sm uppercase tracking-wider font-bold transition-all duration-500"
            style={{
              background: "#fff",
              color: "hsl(43 52% 39%)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.2), 0 8px 40px rgba(0,0,0,0.3)",
            }}
            whileHover={{
              y: -3,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.4), 0 16px 60px rgba(0,0,0,0.4), 0 0 80px hsl(43 55% 55% / 0.2)",
              scale: 1.02,
            }}
            whileTap={{ scale: 0.97 }}
          >
            Contactez-nous
            <ChevronRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ═══ PAGE ═══ */
const Entreprise = () => {
  return (
    <div className="page-bg page-bg--entreprise">
      <EntrepriseHero />
      <MarqueeSep />
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
