import { useRef, useState, useEffect } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  ArrowRight, ChevronRight,
} from "lucide-react";
import ContactSection from "@/components/home/ContactSection";
import Orbit3DShowcase from "@/components/entreprise/Orbit3DShowcase";
import Services3DScroll from "@/components/entreprise/Services3DScroll";
import { SITE, ENTREPRISE_PAGE } from "@/lib/constants";
import sectorGastronomie from "@/assets/sector-gastronomie.jpg";
import sectorHotellerie from "@/assets/sector-hotellerie.jpg";
import sectorBeaute from "@/assets/sector-beaute.jpg";
import sectorSport from "@/assets/sector-sport.jpg";
import sectorAutomobile from "@/assets/sector-automobile.jpg";
import sectorDistribution from "@/assets/sector-distribution.jpg";
import sydneyHeroAsset from "@/assets/sydney-hero.mp4.asset.json";
import ctaDarkBg from "@/assets/cta-dark-bg.jpg";
const HERO_VIDEO_URL = sydneyHeroAsset.url;

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

/* ═══ HERO WITH VIDEO – CINEMATIC REVEAL ═══ */
const EntrepriseHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const scrollBlur = useTransform(scrollYProgress, [0.3, 0.7], [0, 6]);

  /* Phase states for cinematic text reveal */
  const [phase, setPhase] = useState(0); // 0=invisible, 1=fade+blur, 2=sharp+glow, 3=sweep

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);   // start fade-in
    const t2 = setTimeout(() => setPhase(2), 1600);   // sharp + glow
    const t3 = setTimeout(() => setPhase(3), 2800);   // light sweep
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* ── Layer 1: Video background ── */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: videoScale }}>
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={HERO_VIDEO_URL}
        />
        {/* Deeper cinematic overlay – 55% black */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.45) 100%)",
        }} />
        {/* Radial vignette for depth */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 70% 60% at 30% 50%, transparent 0%, rgba(0,0,0,0.4) 100%)",
        }} />
        {/* Gold tint – subtle warm cast */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(160deg, hsl(43 52% 39% / 0.25) 0%, transparent 50%)",
        }} />
        {/* Bottom fade to cream */}
        <div className="absolute bottom-0 left-0 right-0 h-48" style={{
          background: "linear-gradient(to bottom, transparent, rgba(250,249,246,0.6) 60%, #FAF9F6)",
        }} />
      </motion.div>

      {/* ── Layer 2: Grain texture ── */}
      <div className="absolute inset-0 pointer-events-none z-[2] opacity-[0.04]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
      />

      {/* ── Layer 3: Foreground content with cinematic reveal ── */}
      <motion.div
        style={{ y: yText, opacity: scrollOpacity }}
        className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-32"
      >
        {/* Tag line */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, x: -40 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <motion.div className="w-12 h-[1.5px] bg-white/70"
            initial={{ scaleX: 0 }}
            animate={phase >= 1 ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
            style={{ transformOrigin: "left" }}
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/80 font-medium">
            Pôle Entreprise
          </span>
        </motion.div>

        {/* Main headline with blur→sharp reveal */}
        <motion.h1
          className="font-clash text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-black text-white leading-[0.92] mb-8 max-w-5xl relative"
          initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
          animate={phase >= 1
            ? { opacity: 1, y: 0, filter: phase >= 2 ? "blur(0px)" : "blur(4px)" }
            : {}
          }
          transition={{ duration: 1.6, ease: EASE }}
          style={{
            textShadow: phase >= 2
              ? "0 0 60px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)"
              : "none",
          }}
        >
          {/* Light sweep overlay on text */}
          <span className="relative inline-block">
            Une stratégie digitale
            <br />
            <span
              className="text-burgundy-light relative inline-block"
              style={{ textShadow: phase >= 2 ? "0 0 50px hsl(43 55% 55% / 0.6)" : "none" }}
            >
              pensée pour performer
              {/* Light sweep effect */}
              <span
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{ WebkitMaskImage: "linear-gradient(to right, transparent, white, transparent)" }}
              >
                <span
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
                    transform: phase >= 3 ? "translateX(120%)" : "translateX(-120%)",
                    transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                />
              </span>
            </span>
          </span>
          {/* Subtle halo behind text */}
          <div
            className="absolute -inset-10 pointer-events-none rounded-3xl"
            style={{
              background: "radial-gradient(ellipse at 30% 50%, hsl(43 55% 55% / 0.08) 0%, transparent 70%)",
              opacity: phase >= 2 ? 1 : 0,
              transition: "opacity 1.5s ease",
            }}
          />
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-white/75 text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed mb-12 font-light"
          initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
          animate={phase >= 2 ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.2, delay: 0.1, ease: EASE }}
          style={{
            textShadow: phase >= 2 ? "0 2px 10px rgba(0,0,0,0.3)" : "none",
          }}
        >
          Nous accompagnons les marques ambitieuses dans leur croissance
          grâce à une approche complète : contenu, visibilité et performance mesurable.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
        >
          <motion.button
            onClick={() => window.dispatchEvent(new CustomEvent("open-contact-modal"))}
            className="group inline-flex items-center gap-3 px-10 py-[1.125rem] rounded-full font-mono text-sm uppercase tracking-wider transition-all duration-500 cursor-pointer"
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
          </motion.button>
          <motion.a href="#services"
            className="group px-10 py-[1.125rem] rounded-full font-mono text-sm uppercase tracking-wider transition-all duration-500 text-white/60 hover:text-white"
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
          animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
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
  <div className="overflow-hidden py-10" style={{ borderTop: "1px solid hsl(var(--foreground) / 0.1)", borderBottom: "1px solid hsl(var(--foreground) / 0.1)" }}>
    <div className="flex gap-14 animate-mq whitespace-nowrap">
      {[...Array(3)].flatMap((_, i) =>
        ["STRATÉGIE", "GROWTH", "INFLUENCE", "BRANDING", "CONTENU", "SOCIAL MEDIA", "ADS", "SEO"].map((w, j) => (
          <span key={`${i}-${j}`} className="font-clash text-base md:text-lg font-bold tracking-[0.2em] uppercase flex items-center gap-8" style={{ color: "hsl(43 52% 39% / 0.55)" }}>
            {w}
            <span className="w-2 h-2 rounded-full" style={{ background: "hsl(43 55% 55%)" }} />
          </span>
        ))
      )}
    </div>
  </div>
);



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
        <motion.div {...fadeUp()} className="rv text-center mb-8 md:mb-12">
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

        {/* Desktop: 3D Orbit */}
        <div className="hidden lg:block">
          <Orbit3DShowcase cards={SECTORS} />
        </div>

        {/* Mobile: Grid fallback */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:hidden">
          {SECTORS.map((sector, i) => (
            <motion.div key={sector.name} {...fadeUp(i * 0.08)}
              className="rv group relative rounded-2xl cursor-default transition-all duration-700 overflow-hidden aspect-[4/3]"
              style={{ border: "1px solid hsl(var(--foreground) / 0.08)" }}
              whileHover={{ y: -6, borderColor: "hsl(43 55% 55% / 0.3)" }}
            >
              <img
                src={sector.img}
                alt={sector.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                width={800}
                height={600}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/90" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: "linear-gradient(to top, hsl(43 52% 39% / 0.35), transparent 60%)" }} />
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

/* ═══ REFERENCES — PREMIUM SHOWCASE ═══ */
const REFERENCES = [
  { name: "Les Grands Buffets", subtitle: "Narbonne", initial: "GB" },
  { name: "Leclerc", subtitle: "Grande distribution", initial: "LC" },
  { name: "Novotel", subtitle: "Hôtellerie", initial: "NV" },
  { name: "Basic-Fit", subtitle: "Sport & Fitness", initial: "BF" },
  { name: "Yamaha", subtitle: "Automobile & Moto", initial: "YM" },
];

const ReferenceCard = ({ r, index }: { r: typeof REFERENCES[0]; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: EASE }}
      className="group relative cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: hovered
            ? "linear-gradient(165deg, hsl(40 30% 96%), hsl(43 35% 93%))"
            : "hsl(var(--foreground) / 0.025)",
          border: `1.5px solid ${hovered ? "hsl(43 55% 55% / 0.4)" : "hsl(var(--foreground) / 0.07)"}`,
          boxShadow: hovered
            ? "0 25px 50px hsl(43 52% 39% / 0.15), 0 0 0 1px hsl(43 55% 55% / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.5)"
            : "0 2px 8px hsl(0 0% 0% / 0.04)",
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        animate={{ y: hovered ? -10 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {/* Top gold accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, transparent 10%, hsl(43 55% 55%), hsl(43 60% 65%), hsl(43 55% 55%), transparent 90%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />

        <div className="relative z-10 p-8 md:p-10 flex flex-col items-center text-center min-h-[200px] justify-center">
          {/* Monogram circle */}
          <motion.div
            className="relative mb-6"
            animate={{ scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* Outer ring */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center relative"
              style={{
                background: hovered
                  ? "linear-gradient(135deg, hsl(43 52% 39%), hsl(43 55% 55%))"
                  : "hsl(43 52% 39% / 0.08)",
                boxShadow: hovered
                  ? "0 8px 25px hsl(43 52% 39% / 0.3), 0 0 30px hsl(43 55% 55% / 0.15)"
                  : "none",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Pulse ring */}
              {hovered && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: "2px solid hsl(43 55% 55% / 0.3)" }}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <span
                className="font-clash font-black text-base"
                style={{
                  color: hovered ? "#fff" : "hsl(43 55% 55%)",
                  transition: "color 0.4s ease",
                }}
              >
                {r.initial}
              </span>
            </div>
          </motion.div>

          {/* Name */}
          <p
            className="font-clash font-bold text-base md:text-lg mb-2"
            style={{
              color: hovered ? "hsl(43 52% 39%)" : "hsl(var(--foreground))",
              transition: "color 0.4s ease",
            }}
          >
            {r.name}
          </p>

          {/* Subtitle */}
          <p
            className="font-mono text-[9px] uppercase tracking-[0.2em]"
            style={{
              color: hovered ? "hsl(43 55% 55%)" : "hsl(43 55% 55% / 0.45)",
              transition: "color 0.4s ease",
            }}
          >
            {r.subtitle}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ReferencesSection = () => {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="py-28 md:py-40 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, hsl(43 55% 55% / 0.3), transparent)" }} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, hsl(43 55% 55% / 0.05) 0%, transparent 60%)" }} />

      <div className="max-w-[1400px] mx-auto">
        <motion.div {...fadeUp()} className="rv text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-[1.5px]" style={{ background: "linear-gradient(to right, transparent, hsl(43 55% 55%))" }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: "hsl(43 55% 55%)" }}>Références</span>
            <div className="w-12 h-[1.5px]" style={{ background: "linear-gradient(to left, transparent, hsl(43 55% 55%))" }} />
          </div>
          <h2 className="font-clash text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
            Ils nous font <span style={{ color: "hsl(43 55% 55%)", textShadow: "0 0 40px hsl(43 55% 55% / 0.3)" }}>confiance</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Des marques ambitieuses qui ont choisi l'excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6">
          {REFERENCES.map((r, i) => (
            <ReferenceCard key={r.name} r={r} index={i} />
          ))}
        </div>

        <motion.div {...fadeUp(0.4)} className="rv mt-16 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">
            + de 150 projets réalisés avec succès
          </p>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══ CTA FINAL — IMMERSIVE CINEMATIC ═══ */
const FinalCta = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <img
        src={ctaDarkBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        width={1920}
        height={1080}
        style={{ filter: "brightness(0.4) saturate(0.7)" }}
      />

      {/* Dark overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Gold halo glow — center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, hsl(43 55% 55% / 0.12) 0%, hsl(43 52% 39% / 0.04) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Subtle animated light sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 40%, hsl(43 80% 70% / 0.04) 48%, hsl(43 80% 80% / 0.08) 50%, hsl(43 80% 70% / 0.04) 52%, transparent 60%)",
        }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 5, repeat: Infinity, repeatDelay: 5, ease: "linear" }}
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Top fade from cream */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #FAF9F6, transparent)" }}
      />

      {/* Bottom fade to cream */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, #FAF9F6, transparent)" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.p
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE }}
        >
          Prêt à grandir ?
        </motion.p>

        <motion.h2
          className="font-clash text-3xl md:text-5xl lg:text-[3.5rem] font-black text-white leading-tight mb-6"
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.2, delay: 0.15, ease: EASE }}
          style={{ textShadow: "0 0 60px hsl(43 55% 55% / 0.25)" }}
        >
          Faites passer votre entreprise
          <br />
          <span style={{ color: "hsl(43 55% 55%)", textShadow: "0 0 40px hsl(43 55% 55% / 0.4)" }}>
            au niveau supérieur
          </span>
        </motion.h2>

        <motion.p
          className="text-white/50 text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
        >
          Stratégie sur-mesure, exécution premium et résultats mesurables.
          <br />
          Chaque projet est une mission.
        </motion.p>

        <motion.button
          onClick={() => window.dispatchEvent(new CustomEvent("open-contact-modal"))}
          className="group inline-flex items-center gap-3 px-12 py-5 rounded-full font-mono text-sm uppercase tracking-wider font-bold cursor-pointer relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
          style={{
            background: "linear-gradient(135deg, hsl(43 52% 39%), hsl(43 55% 55%))",
            color: "#fff",
            boxShadow: "0 0 0 1px hsl(43 55% 55% / 0.3), 0 8px 40px hsl(43 52% 39% / 0.4), 0 0 80px hsl(43 55% 55% / 0.1)",
          }}
          whileHover={{
            y: -3,
            boxShadow: "0 0 0 1px hsl(43 55% 55% / 0.5), 0 16px 60px hsl(43 52% 39% / 0.5), 0 0 100px hsl(43 55% 55% / 0.2)",
            scale: 1.02,
          }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.2) 50%, transparent 60%)" }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
          />
          <span className="relative z-10">Contactez-nous</span>
          <ChevronRight size={16} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
        </motion.button>
      </div>
    </section>
  );
};

/* ═══ PAGE ═══ */
const Entreprise = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-bg page-bg--entreprise">
      <EntrepriseHero />
      <MarqueeSep />
      <Services3DScroll />
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
