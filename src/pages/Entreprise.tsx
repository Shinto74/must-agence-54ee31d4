import { useRef, useState, useEffect } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  ArrowRight, ChevronRight,
} from "lucide-react";
import ContactSection from "@/components/home/ContactSection";
import Orbit3DShowcase from "@/components/entreprise/Orbit3DShowcase";
import Services3DScroll from "@/components/entreprise/Services3DScroll";
import { SITE } from "@/lib/constants";
import { useEntrepriseSectors, useSiteSettings, useMarqueeItems, useClientsWithCategories } from "@/hooks/useSiteContent";
import sydneyHeroAsset from "@/assets/sydney-hero.mp4.asset.json";

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
  const { get } = useSiteSettings();
  const heroVideo = get("hero_entreprise_video_url", HERO_VIDEO_URL);
  const heroTag = get("hero_entreprise_tag", "Pôle Entreprise");
  const heroLine1 = get("hero_entreprise_title_line1", "Une stratégie digitale");
  const heroLine2 = get("hero_entreprise_title_line2", "pensée pour performer");
  const heroDesc = get("hero_entreprise_description", "Nous accompagnons les marques ambitieuses dans leur croissance grâce à une approche complète : contenu, visibilité et performance mesurable.");
  const heroCta1 = get("hero_entreprise_cta_primary", "Demander un audit gratuit");
  const heroCta2 = get("hero_entreprise_cta_secondary", "Découvrir nos services");
  const stat1Value = get("hero_entreprise_stat1_value", "150");
  const stat1Suffix = get("hero_entreprise_stat1_suffix", "+");
  const stat1Label = get("hero_entreprise_stat1_label", "Projets livrés");
  const stat2Value = get("hero_entreprise_stat2_value", "98");
  const stat2Suffix = get("hero_entreprise_stat2_suffix", "%");
  const stat2Label = get("hero_entreprise_stat2_label", "Clients satisfaits");
  const stat3Value = get("hero_entreprise_stat3_value", "3");
  const stat3Suffix = get("hero_entreprise_stat3_suffix", "M+");
  const stat3Label = get("hero_entreprise_stat3_label", "Vues générées");
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const scrollBlur = useTransform(scrollYProgress, [0.3, 0.7], [0, 6]);

  /* Phase states for cinematic text reveal */
  const [phase, setPhase] = useState(0); // 0=invisible, 1=fade+blur, 2=sharp+glow, 3=sweep

  // Wait for the initial loader to finish before starting reveal
  // Uses a fallback timeout in case the event was missed
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onLoaderComplete = () => setReady(true);
    window.addEventListener("loader-complete", onLoaderComplete);
    
    // If loader already completed (navigating from another page), start immediately
    // We check a flag set on window by the App
    if ((window as any).__loaderDone) {
      setReady(true);
    }
    
    return () => {
      window.removeEventListener("loader-complete", onLoaderComplete);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t1 = setTimeout(() => setPhase(1), 200);    // start fade-in
    const t2 = setTimeout(() => setPhase(2), 1200);    // sharp + glow
    const t3 = setTimeout(() => setPhase(3), 2200);    // light sweep
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [ready]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* ── Layer 1: Video background ── */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: videoScale }}>
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={heroVideo}
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
            {heroTag}
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
            {heroLine1}
            <br />
            <span
              className="text-burgundy-light relative inline-block"
              style={{ textShadow: phase >= 2 ? "0 0 50px hsl(43 55% 55% / 0.6)" : "none" }}
            >
              {heroLine2}
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
          {heroDesc}
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
            {heroCta1}
            <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </motion.button>
          <motion.a href="#services"
            className="group px-10 py-[1.125rem] rounded-full font-mono text-sm uppercase tracking-wider transition-all duration-500 text-white/80 hover:text-white text-center"
            style={{ border: "1.5px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.06)", backdropFilter: "blur(8px)" }}
            whileHover={{
              borderColor: "rgba(255,255,255,0.55)",
              background: "rgba(255,255,255,0.12)",
            }}
          >
            {heroCta2}
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
            { value: stat1Value, suffix: stat1Suffix, label: stat1Label },
            { value: stat2Value, suffix: stat2Suffix, label: stat2Label },
            { value: stat3Value, suffix: stat3Suffix, label: stat3Label },
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
const MarqueeSep = () => {
  const { data: items } = useMarqueeItems("entreprise");
  const words = (items || [])
    .filter((i: any) => i.kind === "word")
    .map((i: any) => i.text_value);
  if (words.length === 0) return null;
  return (
    <div className="overflow-hidden py-10" style={{ borderTop: "1px solid hsl(var(--foreground) / 0.1)", borderBottom: "1px solid hsl(var(--foreground) / 0.1)" }}>
      <div className="flex gap-14 animate-mq whitespace-nowrap">
        {[...Array(3)].flatMap((_, i) =>
          words.map((w, j) => (
            <span key={`${i}-${j}`} className="font-clash text-base md:text-lg font-bold tracking-[0.2em] uppercase flex items-center gap-8" style={{ color: "hsl(43 52% 39% / 0.55)" }}>
              {w}
              <span className="w-2 h-2 rounded-full" style={{ background: "hsl(43 55% 55%)" }} />
            </span>
          ))
        )}
      </div>
    </div>
  );
};



/* ═══ EXPERTISE TERRAIN — IMMERSIVE ═══ */
const ExpertiseSection = () => {
  const ref = useScrollReveal();
  const { get } = useSiteSettings();
  const { data: dbSectors = [] } = useEntrepriseSectors();
  const sectionTitle = get("entreprise_sectors_title", "Des secteurs que l'on maîtrise");
  const sectionSubtitle = get(
    "entreprise_sectors_subtitle",
    "Notre expertise nous permet de comprendre les enjeux spécifiques de chaque industrie et d'adapter notre stratégie en conséquence."
  );
  const sectors = (dbSectors as any[]).map((s: any) => ({
    name: s.name,
    img: s.image_url || s.icon || "",
    desc: s.description || "",
  }));
  return (
    <section ref={ref} className="py-28 md:py-40 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, hsl(43 55% 55% / 0.25), transparent)" }} />

      <div className="max-w-[1400px] mx-auto">
        <motion.div {...fadeUp()} className="rv text-center mb-8 md:mb-12">
          {get("logo_green") && (
            <div className="flex items-center justify-center mb-5">
              <img src={get("logo_green")} alt="MUST AGENCE" className="h-10 md:h-12 w-auto opacity-80" />
            </div>
          )}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1.5px] bg-burgundy-light" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-burgundy-light">Expertise terrain</span>
            <div className="w-8 h-[1.5px] bg-burgundy-light" />
          </div>
          <h2 className="font-clash text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-5">
            {sectionTitle}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {sectionSubtitle}
          </p>
        </motion.div>

        {/* Desktop: 3D Orbit */}
        <div className="hidden lg:block">
          <Orbit3DShowcase cards={sectors} centerLogo={get("logo_green")} />
        </div>

        {/* Mobile: Grid fallback */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:hidden">
          {sectors.map((sector, i) => (
            <motion.div key={sector.name} {...fadeUp(i * 0.08)}
              className="rv group relative rounded-2xl cursor-default transition-all duration-700 overflow-hidden aspect-[4/3]"
              style={{ border: "1px solid hsl(var(--foreground) / 0.08)" }}
              whileHover={{ y: -6, borderColor: "hsl(43 55% 55% / 0.3)" }}
            >
              <motion.img
                src={sector.img}
                alt={sector.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                width={800}
                height={600}
                animate={{
                  scale: [1.05, 1.14, 1.08, 1.12, 1.05],
                  x: [0, -6, 3, -2, 0],
                  y: [0, -4, 2, -1, 0],
                }}
                transition={{
                  duration: 10 + i * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
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
type ReferenceItem = { name: string; subtitle: string; initial: string; logo: string };

const ReferenceCard = ({ r, index, anyHovered, isHovered, onHover, onLeave }: {
  r: ReferenceItem; index: number;
  anyHovered: boolean; isHovered: boolean;
  onHover: () => void; onLeave: () => void;
}) => {
  const gold = "43 55% 55%";
  const goldDark = "43 52% 35%";

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.85, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="relative cursor-default"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        filter: anyHovered && !isHovered ? "saturate(0.5) brightness(0.97)" : "saturate(1) brightness(1)",
        opacity: anyHovered && !isHovered ? 0.7 : 1,
        transition: "filter 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.7s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Outer ambient glow */}
      <div
        className="absolute -inset-4 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, hsl(${gold} / 0.1) 0%, transparent 65%)`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      <motion.div
        className="relative rounded-[20px] overflow-hidden"
        style={{
          background: isHovered
            ? "linear-gradient(168deg, hsl(42 35% 97%) 0%, hsl(40 28% 91%) 100%)"
            : "linear-gradient(168deg, hsl(42 18% 96%) 0%, hsl(40 12% 93.5%) 100%)",
          border: `1.5px solid ${isHovered ? `hsl(${gold} / 0.45)` : "hsl(0 0% 0% / 0.05)"}`,
          boxShadow: isHovered
            ? `0 25px 60px hsl(0 0% 0% / 0.1), 0 8px 24px hsl(0 0% 0% / 0.06), 0 0 0 0.5px hsl(${gold} / 0.2), inset 0 1px 0 hsl(0 0% 100% / 0.7)`
            : "0 2px 10px hsl(0 0% 0% / 0.04), 0 1px 4px hsl(0 0% 0% / 0.03), inset 0 1px 0 hsl(0 0% 100% / 0.5)",
          transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        animate={{ y: isHovered ? -6 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Top gold accent line */}
        <div
          className="absolute top-0 left-[10%] right-[10%] h-[2px] z-10"
          style={{
            background: `linear-gradient(90deg, transparent, hsl(${gold}), transparent)`,
            opacity: isHovered ? 0.8 : 0,
            transition: "opacity 0.5s ease",
          }}
        />

        {/* Shimmer sweep */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 z-[3] pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 35%, hsl(0 0% 100% / 0.15) 48%, hsl(0 0% 100% / 0.08) 52%, transparent 65%)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 1, ease: "linear", delay: 0.1 }}
          />
        )}

        <div className="relative z-[5] px-6 py-10 md:px-8 md:py-12 flex flex-col items-center text-center h-[260px] md:h-[280px] justify-center gap-6">
          {/* Signature circle — neumorphic premium */}
          <motion.div
            className="relative"
            animate={{
              scale: isHovered ? 1.08 : 1,
              y: isHovered ? 0 : [0, -4, 0],
            }}
            transition={isHovered
              ? { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
              : { y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }, scale: { duration: 0.7 } }
            }
          >
            {/* Glow behind circle */}
            <div
              className="absolute inset-[-10px] rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, hsl(${gold} / 0.18) 0%, transparent 65%)`,
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.7s ease",
              }}
            />

            {/* The circle */}
            <div
              className="w-[100px] h-[100px] md:w-[110px] md:h-[110px] rounded-full flex items-center justify-center relative"
              style={{
                background: isHovered
                  ? "linear-gradient(145deg, hsl(42 25% 95%) 0%, hsl(40 20% 88%) 100%)"
                  : "linear-gradient(145deg, hsl(0 0% 95%) 0%, hsl(0 0% 89%) 100%)",
                border: `1.5px solid ${isHovered ? `hsl(${gold} / 0.45)` : "hsl(0 0% 0% / 0.07)"}`,
                boxShadow: isHovered
                  ? `8px 8px 20px hsl(0 0% 0% / 0.08), -4px -4px 12px hsl(0 0% 100% / 0.9), inset 0 1px 3px hsl(0 0% 100% / 0.6), 0 0 25px hsl(${gold} / 0.12)`
                  : "6px 6px 16px hsl(0 0% 0% / 0.06), -3px -3px 10px hsl(0 0% 100% / 0.8), inset 0 1px 2px hsl(0 0% 100% / 0.5)",
                transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Glass highlight — top crescent */}
              <div
                className="absolute top-[4px] left-[15%] right-[15%] h-[30%] rounded-[50%] pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, hsl(0 0% 100% / 0.65) 0%, transparent 100%)",
                }}
              />

              {/* Logo (avec fade lors d'un changement de logo via la rotation) */}
              <motion.img
                key={r.logo || r.name}
                src={r.logo}
                alt={r.name}
                loading="lazy"
                className="w-14 h-14 md:w-16 md:h-16 object-contain relative z-10"
                initial={{ opacity: 0, scale: 0.85, filter: "blur(4px)" }}
                animate={{
                  opacity: isHovered ? 1 : 0.8,
                  scale: 1,
                  filter: isHovered ? "grayscale(0%) contrast(1.15) blur(0px)" : "grayscale(60%) contrast(1) blur(0px)",
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </motion.div>

          {/* Typography */}
          <div>
            <motion.p
              key={r.name}
              className="font-clash font-bold text-[17px] md:text-[19px] tracking-[0.02em] mb-2 leading-tight"
              style={{
                color: isHovered ? `hsl(${goldDark})` : "hsl(0 0% 12%)",
                transition: "color 0.5s ease",
              }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {r.name}
            </motion.p>
            <p
              className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.22em] font-bold"
              style={{
                color: isHovered ? `hsl(${gold})` : `hsl(${gold} / 0.6)`,
                transition: "color 0.5s ease",
              }}
            >
              {r.subtitle}
            </p>
          </div>
        </div>

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-[12%] right-[12%] h-[1.5px]"
          style={{
            background: `linear-gradient(90deg, transparent, hsl(${gold} / 0.35), transparent)`,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

/* ═══ ROTATING REFERENCE CARD — réutilise le visuel ReferenceCard mais avec un logo qui change toutes les X secondes ═══ */
const ROTATE_INTERVAL = 3500;

const RotatingReferenceCard = ({
  categoryName,
  clients,
  index,
  anyHovered,
  isHovered,
  onHover,
  onLeave,
}: {
  categoryName: string;
  clients: Array<{ id: string; name: string; logo_url: string }>;
  index: number;
  anyHovered: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (clients.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % clients.length);
    }, ROTATE_INTERVAL + index * 350);
    return () => clearInterval(interval);
  }, [clients.length, index, isHovered]);

  const current = clients[activeIdx] || clients[0];
  if (!current) return null;

  return (
    <ReferenceCard
      r={{
        name: current.name,
        subtitle: categoryName,
        initial: current.name?.slice(0, 2)?.toUpperCase() || "??",
        logo: current.logo_url || "",
      }}
      index={index}
      anyHovered={anyHovered}
      isHovered={isHovered}
      onHover={onHover}
      onLeave={onLeave}
    />
  );
};

const ReferencesSection = () => {
  const ref = useScrollReveal();
  const { get } = useSiteSettings();
  const { data: dbCategories = [] } = useClientsWithCategories();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Fallback statique
  const fallbackCategories = [
    {
      id: "fallback",
      name: "Références",
      clients: REFERENCES.map((r) => ({ id: r.name, name: r.name, logo_url: r.logo, category_id: "fallback" })),
    },
  ];
  const allCategories = (dbCategories.length > 0 ? dbCategories : fallbackCategories) as any[];
  // Garde uniquement les catégories non vides, max 4
  const categories = allCategories.filter((c: any) => c.clients && c.clients.length > 0).slice(0, 4);

  const kicker = get("entreprise_ref_kicker", "Références");
  const titlePart1 = get("entreprise_ref_title_part1", "Ils nous font");
  const titleAccent = get("entreprise_ref_title_accent", "confiance");
  const subtitle = get("entreprise_ref_subtitle", "Des marques ambitieuses qui ont choisi l'excellence.");
  const footerNote = get("entreprise_ref_footer_note", "+ de 150 projets réalisés avec succès");

  // Grille adaptative selon le nombre de catégories (max 4)
  const gridCols =
    categories.length === 1 ? "grid-cols-1 max-w-sm mx-auto"
      : categories.length === 2 ? "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
        : categories.length === 3 ? "grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto"
          : "grid-cols-2 lg:grid-cols-4";

  return (
    <section ref={ref} className="py-28 md:py-40 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, hsl(43 55% 55% / 0.3), transparent)" }} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, hsl(43 55% 55% / 0.05) 0%, transparent 60%)" }} />

      <div className="max-w-[1400px] mx-auto">
        <motion.div className="rv text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              className="w-12 h-[1.5px]"
              style={{ background: "linear-gradient(to right, transparent, hsl(43 55% 55%))", transformOrigin: "right" }}
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.span
              className="font-mono text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "hsl(43 55% 55%)" }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {kicker}
            </motion.span>
            <motion.div
              className="w-12 h-[1.5px]"
              style={{ background: "linear-gradient(to left, transparent, hsl(43 55% 55%))", transformOrigin: "left" }}
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <motion.h2
            className="font-clash text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4"
            initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {titlePart1} <span style={{ color: "hsl(43 55% 55%)", textShadow: "0 0 40px hsl(43 55% 55% / 0.3)" }}>{titleAccent}</span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-sm max-w-md mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {categories.length > 0 ? (
          <div className={`grid ${gridCols} gap-6 md:gap-8`}>
            {categories.map((cat: any, i: number) => (
              <RotatingReferenceCard
                key={cat.id}
                categoryName={cat.name}
                clients={cat.clients}
                index={i}
                anyHovered={hoveredIdx !== null}
                isHovered={hoveredIdx === i}
                onHover={() => setHoveredIdx(i)}
                onLeave={() => setHoveredIdx(null)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-sm py-10">
            Aucune référence à afficher pour le moment.
          </p>
        )}

        <motion.div {...fadeUp(0.4)} className="rv mt-16 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">
            {footerNote}
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
  const { get } = useSiteSettings();
  const kicker = get("final_cta_kicker", "Prêt à grandir ?");
  const titleLine1 = get("final_cta_title_line1", "Faites passer votre entreprise");
  const titleLine2 = get("final_cta_title_line2", "au niveau supérieur");
  const subtitle = get("final_cta_subtitle", "Stratégie sur-mesure, exécution premium et résultats mesurables.\nChaque projet est une mission.");
  const buttonLabel = get("final_cta_button", "Contactez-nous");
  return (
    <section
      ref={ref}
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
      style={{ background: "#090909" }}
    >
      {/* Deep layered gradient background */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #0d0b08 30%, #100e0a 50%, #0d0b08 70%, #090909 100%)",
      }} />

      {/* Central warm glow — large, soft */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: "900px", height: "500px" }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-full h-full rounded-full" style={{
          background: "radial-gradient(ellipse, hsl(43 55% 55% / 0.10) 0%, hsl(43 52% 39% / 0.04) 40%, transparent 70%)",
          filter: "blur(80px)",
        }} />
      </motion.div>

      {/* Secondary accent glow — top left */}
      <div className="absolute top-[15%] left-[10%] w-[400px] h-[300px] rounded-full pointer-events-none" style={{
        background: "radial-gradient(ellipse, hsl(43 60% 50% / 0.06) 0%, transparent 65%)",
        filter: "blur(50px)",
      }} />

      {/* Secondary accent glow — bottom right */}
      <div className="absolute bottom-[15%] right-[10%] w-[350px] h-[250px] rounded-full pointer-events-none" style={{
        background: "radial-gradient(ellipse, hsl(43 50% 45% / 0.05) 0%, transparent 65%)",
        filter: "blur(50px)",
      }} />

      {/* Radial vignette */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 65% 55% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)",
      }} />

      {/* Subtle light sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 40%, hsl(43 80% 70% / 0.03) 48%, hsl(43 80% 80% / 0.06) 50%, hsl(43 80% 70% / 0.03) 52%, transparent 60%)",
        }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 6, repeat: Infinity, repeatDelay: 6, ease: "linear" }}
      />

      {/* Grain texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
      }} />

      {/* Top fade from cream */}
      <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none" style={{
        background: "linear-gradient(to bottom, #FAF9F6, transparent)",
      }} />

      {/* Bottom fade to cream */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{
        background: "linear-gradient(to top, #FAF9F6, transparent)",
      }} />

      {/* Thin gold line accents */}
      <div className="absolute top-[30%] left-0 right-0 h-[1px] pointer-events-none" style={{
        background: "linear-gradient(90deg, transparent 10%, hsl(43 55% 55% / 0.08) 50%, transparent 90%)",
      }} />
      <div className="absolute bottom-[30%] left-0 right-0 h-[1px] pointer-events-none" style={{
        background: "linear-gradient(90deg, transparent 10%, hsl(43 55% 55% / 0.06) 50%, transparent 90%)",
      }} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.p
          className="font-mono text-[10px] uppercase tracking-[0.3em] mb-6"
          style={{ color: "hsl(43 55% 55% / 0.6)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE }}
        >
          {kicker}
        </motion.p>

        <motion.h2
          className="font-clash text-3xl md:text-5xl lg:text-[3.5rem] font-black text-white leading-tight mb-6"
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.4, delay: 0.15, ease: EASE }}
          style={{ textShadow: "0 0 80px hsl(43 55% 55% / 0.15)" }}
        >
          {titleLine1}
          <br />
          <span style={{ color: "hsl(43 55% 55%)", textShadow: "0 0 50px hsl(43 55% 55% / 0.35)" }}>
            {titleLine2}
          </span>
        </motion.h2>

        <motion.p
          className="text-white/45 text-sm md:text-base max-w-lg mx-auto mb-12 leading-relaxed whitespace-pre-line"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
        >
          {subtitle}
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
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.2) 50%, transparent 60%)" }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
          />
          <span className="relative z-10">{buttonLabel}</span>
          <ChevronRight size={16} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
        </motion.button>
      </div>
    </section>
  );
};

/* ═══ PAGE ═══ */
const Entreprise = () => {
  const { get } = useSiteSettings();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-bg page-bg--entreprise relative">
      <EntrepriseHero />
      <MarqueeSep />
      <Services3DScroll />
      {/* Transition gradient: dark Services → cream Expertise */}
      <div className="h-32 pointer-events-none" style={{
        background: "linear-gradient(to bottom, #0a0a0a, #1a1714 30%, #3d3528 50%, #8a7d6a 70%, #FAF9F6)",
      }} />
      <ExpertiseSection />
      <ReferencesSection />
      <FinalCta />
      <ContactSection
        heading={get("contact_entreprise_heading", ENTREPRISE_PAGE.contact.heading)}
        text={get("contact_entreprise_text", ENTREPRISE_PAGE.contact.text)}
        subtext={get("contact_entreprise_subtext", ENTREPRISE_PAGE.contact.subtext)}
        email={get("contact_email", ENTREPRISE_PAGE.contact.email)}
        phone={get("contact_phone", SITE.contact.phone)}
        location={get("contact_location", SITE.contact.location)}
        whatsappUrl={SITE.contact.whatsappUrl}
        formOptions={ENTREPRISE_PAGE.contact.formOptions}
      />
    </div>
  );
};

export default Entreprise;
