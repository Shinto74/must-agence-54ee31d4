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
          <motion.button
            onClick={() => window.dispatchEvent(new CustomEvent("open-contact-modal"))}
            className="group inline-flex items-center gap-3 px-10 py-4.5 rounded-full font-mono text-sm uppercase tracking-wider transition-all duration-500 cursor-pointer"
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

/* ═══ SERVICES — 3D IMMERSIVE ═══ */
const SERVICES = [
  {
    icon: <Video size={28} />,
    num: "01",
    title: "Création de Contenu Premium",
    description: "Production de photos et vidéos professionnelles haute définition pour sublimer votre image de marque.",
    chips: ["Photo HD", "Vidéo corporate", "Motion design", "Drone"],
    gradient: "from-amber-900/20 to-yellow-800/10",
  },
  {
    icon: <Share2 size={28} />,
    num: "02",
    title: "Social Media Management",
    description: "Gestion professionnelle de vos réseaux sociaux pour fédérer et engager votre communauté.",
    chips: ["Instagram", "TikTok", "LinkedIn", "Planning éditorial"],
    gradient: "from-orange-900/15 to-amber-800/10",
  },
  {
    icon: <Rocket size={28} />,
    num: "03",
    title: "Campagnes Publicitaires",
    description: "Création et pilotage de campagnes ultra-performantes sur Google Ads, Meta Ads et TikTok Ads.",
    chips: ["Meta Ads", "Google Ads", "TikTok Ads", "Retargeting"],
    gradient: "from-yellow-900/20 to-orange-800/10",
  },
  {
    icon: <Search size={28} />,
    num: "04",
    title: "SEO & Référencement",
    description: "Optimisation de votre visibilité sur les moteurs de recherche pour attirer un trafic qualifié.",
    chips: ["Audit SEO", "Netlinking", "Content SEO", "Local SEO"],
    gradient: "from-amber-800/15 to-yellow-900/10",
  },
];

/* 3D Tilt Card */
const ServiceCard3D = ({ svc, index }: { svc: typeof SERVICES[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const isInView = useInView(cardRef, { once: true, margin: "-15%" });
  const isLit = isInView || isHovered;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="rv group relative cursor-default"
      style={{ perspective: "1200px" }}
      initial={{ opacity: 0, y: 80, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay: index * 0.15, ease: EASE }}
    >
      <motion.div
        className="relative rounded-[1.5rem] overflow-hidden"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.4s cubic-bezier(0.03,0.98,0.52,0.99)",
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card surface */}
        <div
          className="relative p-8 md:p-10 lg:p-12"
          style={{
            background: isHovered
              ? "linear-gradient(145deg, hsl(40 20% 96%) 0%, hsl(43 25% 93%) 100%)"
              : "linear-gradient(145deg, hsl(40 15% 96%) 0%, hsl(40 10% 94%) 100%)",
            border: `1px solid ${isHovered ? "hsl(43 55% 55% / 0.35)" : "hsl(var(--foreground) / 0.07)"}`,
            boxShadow: isHovered
              ? "0 30px 60px -15px hsl(43 52% 39% / 0.2), 0 0 50px hsl(43 55% 55% / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.5)"
              : "0 4px 20px -5px hsl(0 0% 0% / 0.06), inset 0 1px 0 hsl(0 0% 100% / 0.4)",
            transition: "all 0.6s cubic-bezier(0.03,0.98,0.52,0.99)",
          }}
        >
          {/* Spotlight follow cursor */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none opacity-60 transition-opacity duration-500"
              style={{
                background: `radial-gradient(600px circle at ${(tilt.y / 12 + 0.5) * 100}% ${(-tilt.x / 12 + 0.5) * 100}%, hsl(43 55% 55% / 0.12), transparent 50%)`,
              }}
            />
          )}

          {/* Decorative orb */}
          <div
            className="absolute -top-16 -right-16 w-[200px] h-[200px] rounded-full pointer-events-none transition-all duration-700"
            style={{
              background: `radial-gradient(circle, hsl(43 55% 55% / ${isHovered ? 0.12 : 0.04}) 0%, transparent 70%)`,
              transform: `translate(${tilt.y * 2}px, ${tilt.x * -2}px)`,
            }}
          />

          {/* Top accent line */}
          <div
            className="absolute top-0 left-8 right-8 h-[2px] rounded-full transition-all duration-700"
            style={{
              background: isHovered
                ? "linear-gradient(90deg, transparent, hsl(43 55% 55%), hsl(43 60% 70%), hsl(43 55% 55%), transparent)"
                : "linear-gradient(90deg, transparent, hsl(43 55% 55% / 0.15), transparent)",
              opacity: isHovered ? 1 : 0.5,
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Left — icon + number */}
            <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-3 shrink-0">
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                style={{
                  background: isHovered
                    ? "linear-gradient(135deg, hsl(43 52% 39%), hsl(43 55% 55%))"
                    : "hsl(43 52% 39% / 0.1)",
                  border: `1px solid ${isHovered ? "hsl(43 55% 55% / 0.5)" : "hsl(43 55% 55% / 0.15)"}`,
                  color: isHovered ? "#fff" : "hsl(43 55% 55%)",
                  boxShadow: isHovered ? "0 8px 30px hsl(43 52% 39% / 0.3), 0 0 20px hsl(43 55% 55% / 0.15)" : "none",
                  transition: "all 0.5s cubic-bezier(0.03,0.98,0.52,0.99)",
                  transform: `translateZ(${isHovered ? 30 : 0}px)`,
                }}
              >
                {svc.icon}
                {/* Pulse ring on hover */}
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{ border: "2px solid hsl(43 55% 55% / 0.4)" }}
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
              </motion.div>
              <span
                className="font-clash text-3xl md:text-4xl font-black transition-colors duration-500"
                style={{
                  color: isHovered ? "hsl(43 55% 55%)" : "hsl(var(--foreground) / 0.08)",
                  textShadow: isHovered ? "0 0 30px hsl(43 55% 55% / 0.3)" : "none",
                  transform: `translateZ(${isHovered ? 20 : 0}px)`,
                }}
              >
                {svc.num}
              </span>
            </div>

            {/* Right — content */}
            <div className="flex-1" style={{ transform: `translateZ(${isHovered ? 15 : 0}px)` }}>
              <h3
                className="font-clash font-black text-xl md:text-2xl mb-3 transition-all duration-500"
                style={{
                  color: isHovered ? "hsl(43 52% 39%)" : "hsl(var(--foreground))",
                }}
              >
                {svc.title}
              </h3>
              <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-6">{svc.description}</p>
              <div className="flex flex-wrap gap-2.5">
                {svc.chips.map((chip, ci) => (
                  <motion.span
                    key={chip}
                    className="px-4 py-2 rounded-xl text-[11px] font-mono font-medium transition-all duration-500"
                    style={{
                      background: isHovered ? "hsl(43 55% 55% / 0.12)" : "hsl(var(--foreground) / 0.03)",
                      border: `1px solid ${isHovered ? "hsl(43 55% 55% / 0.25)" : "hsl(var(--foreground) / 0.06)"}`,
                      color: isHovered ? "hsl(43 52% 39%)" : "hsl(var(--foreground) / 0.45)",
                      transform: `translateZ(${isHovered ? 10 : 0}px)`,
                    }}
                    initial={false}
                    animate={isHovered ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
                  >
                    {chip}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ServicesSection = () => {
  const ref = useScrollReveal();
  return (
    <section id="services" ref={ref} className="py-28 md:py-44 px-6 relative">
      {/* Background decorative elements */}
      <div className="absolute top-40 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
        style={{ background: "radial-gradient(circle, hsl(43 55% 55% / 0.06) 0%, transparent 60%)" }} />
      <div className="absolute bottom-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, hsl(43 55% 55% / 0.08) 0%, transparent 60%)" }} />

      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_2.2fr] gap-16 md:gap-24">
          {/* Left sticky header */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.div {...fadeUp()} className="rv flex items-center gap-3 mb-5">
              <div className="w-12 h-[1.5px]" style={{ background: "linear-gradient(to right, hsl(43 55% 55%), transparent)" }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: "hsl(43 55% 55%)" }}>Services</span>
            </motion.div>
            <motion.h2 {...fadeUp(0.05)} className="rv font-clash text-4xl md:text-5xl lg:text-[3.5rem] font-black text-foreground leading-[0.95] mb-6">
              Ce qu'on fait
              <br />
              <span style={{ color: "hsl(43 55% 55%)", textShadow: "0 0 40px hsl(43 55% 55% / 0.2)" }}>pour vous</span>
            </motion.h2>
            <motion.p {...fadeUp(0.1)} className="rv text-muted-foreground text-sm md:text-[15px] leading-relaxed max-w-sm mb-8">
              Chaque service est conçu pour maximiser votre impact digital
              et générer un retour mesurable.
            </motion.p>
            {/* Decorative vertical line */}
            <motion.div
              className="hidden lg:block w-[1px] h-24 ml-1"
              style={{ background: "linear-gradient(to bottom, hsl(43 55% 55% / 0.3), transparent)" }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
            />
          </div>

          {/* Right — 3D cards */}
          <div className="space-y-8">
            {SERVICES.map((svc, i) => (
              <ServiceCard3D key={svc.title} svc={svc} index={i} />
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
          <motion.button
            onClick={() => window.dispatchEvent(new CustomEvent("open-contact-modal"))}
            className="group inline-flex items-center gap-3 px-12 py-5 rounded-full font-mono text-sm uppercase tracking-wider font-bold transition-all duration-500 cursor-pointer"
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
          </motion.button>
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
