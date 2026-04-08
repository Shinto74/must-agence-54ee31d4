import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Zap, Camera, Rocket, Megaphone, Handshake } from "lucide-react";

// ── Données des 5 piliers ─────────────────────────────────────────────────────
const PILLARS = [
  {
    number: "01",
    timecode: "00:01",
    icon: Zap,
    leftTitle: "Activation Créateurs",
    statement: "Nous activons votre musique auprès des créateurs qui comprennent votre univers, pour qu'elle soit intégrée de manière naturelle et suscite de l'engagement réel.",
    leftItems: ["Réseau exclusif de créateurs TikTok & Reels", "Sound seeding ciblé sur votre genre", "Viral engineering mesuré"],
    rightTitle: "Influence & TikTok Activation",
    description: "Campagnes d'influence sur-mesure avec notre réseau exclusif de créateurs TikTok, Instagram Reels et YouTube Shorts.",
    rightItems: ["TikTok Activation", "Creator Network", "Sound Seeding", "Viral Engineering"],
    haloColor: "hsla(50,100%,50%,0.08)",
    accentGlow: "hsla(50,100%,60%,0.4)",
    bg: "radial-gradient(ellipse 70% 60% at 30% 60%, hsla(50,80%,8%,0.6) 0%, transparent 70%)",
  },
  {
    number: "02",
    timecode: "00:02",
    icon: Camera,
    leftTitle: "Direction Artistique",
    statement: "L'image est le premier contact. On fait en sorte qu'il soit inoubliable.",
    leftItems: ["Identité visuelle cohérente et premium", "Contenu natif pour chaque plateforme", "Production photo & vidéo professionnelle"],
    rightTitle: "Création Visuelle",
    description: "Pochettes d'album, clips musicaux, visuels Instagram et contenus lifestyle premium pensés pour performer.",
    rightItems: ["Pochettes & EP", "Clips & Courts-métrages", "Visuels Instagram / TikTok", "Showreel & Portfolio"],
    haloColor: "hsla(160,60%,50%,0.08)",
    accentGlow: "hsla(160,60%,50%,0.4)",
    bg: "radial-gradient(ellipse 70% 60% at 70% 50%, hsla(160,60%,8%,0.6) 0%, transparent 70%)",
  },
  {
    number: "03",
    timecode: "00:03",
    icon: Rocket,
    leftTitle: "Release Strategy",
    statement: "Chaque sortie est un événement. On orchestre l'impact avant, pendant et après.",
    leftItems: ["Roadmap de lancement sur-mesure", "Teasing coordonné multi-plateformes", "Maximisation du premier jour"],
    rightTitle: "Stratégie de Lancement",
    description: "Planification complète de vos sorties : singles, EPs, albums. Chaque détail pensé pour créer l'impact maximal.",
    rightItems: ["Rollout Planning", "Teasing Stratégique", "Release Multi-plateforme", "Timing Optimisé"],
    haloColor: "hsla(259,94%,60%,0.08)",
    accentGlow: "hsla(259,94%,76%,0.4)",
    bg: "radial-gradient(ellipse 70% 60% at 30% 50%, hsla(259,60%,8%,0.6) 0%, transparent 70%)",
  },
  {
    number: "04",
    timecode: "00:04",
    icon: Megaphone,
    leftTitle: "Ads & Relations Presse",
    statement: "La portée sans frontières. Performance publicitaire, presse nationale, visibilité 360°.",
    leftItems: ["Meta, Google, TikTok, Snapchat Ads", "Relations Presse — Radios, Blogs, Médias", "SEO Musique & Streaming"],
    rightTitle: "Campagnes Ads & RP",
    description: "Ads haute performance sur toutes les plateformes. Campagnes RP pour amplifier votre portée auprès des médias qui comptent.",
    rightItems: ["Meta & Google Ads", "TikTok & Snapchat Ads", "Relations Presse", "SEO Musique"],
    haloColor: "hsla(25,95%,50%,0.08)",
    accentGlow: "hsla(25,95%,60%,0.4)",
    bg: "radial-gradient(ellipse 70% 60% at 70% 60%, hsla(25,60%,8%,0.6) 0%, transparent 70%)",
  },
  {
    number: "05",
    timecode: "00:05",
    icon: Handshake,
    leftTitle: "Brand & Partenariats",
    statement: "Votre musique est une marque. On construit l'histoire et on ouvre les portes.",
    leftItems: ["Narratif d'artiste & identité long terme", "Connexion aux marques et sponsors", "Opportunités business & placements"],
    rightTitle: "Brand Content & Booking",
    description: "Community management, storytelling éditorial et mise en relation avec les marques pour transformer votre notoriété en revenus.",
    rightItems: ["Brand Content", "Storytelling", "Booking & Placements", "Partenariats Marques"],
    haloColor: "hsla(73,100%,50%,0.09)",
    accentGlow: "hsla(73,100%,50%,0.4)",
    bg: "radial-gradient(ellipse 70% 60% at 50% 60%, hsla(73,100%,5%,0.6) 0%, transparent 70%)",
  },
];

// ── Hook scroll index ────────────────────────────────────────────────────────
function useScrollIndex(ref: React.RefObject<HTMLDivElement>, count: number) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const { top } = el.getBoundingClientRect();
      const scrolledIn = -top;
      const idx = Math.max(0, Math.min(count - 1, Math.floor(scrolledIn / window.innerHeight)));
      setIndex(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref, count]);
  return index;
}

const panelVariants = {
  enter: { opacity: 0, y: 32, scale: 0.96, filter: "blur(6px)" },
  center: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0, y: -32, scale: 0.96, filter: "blur(6px)",
    transition: { duration: 0.35, ease: [0.4, 0, 1, 1] as const },
  },
};

// ── Carte droite ──────────────────────────────────────────────────────────────
const InfoCard = ({
  pillar,
  isActive,
}: {
  pillar: (typeof PILLARS)[number];
  isActive: boolean;
}) => {
  const Icon = pillar.icon;

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0 px-10 py-8"
      style={{ height: "100vh", width: "100%" }}
    >
      <motion.div
        animate={{
          opacity: isActive ? 1 : 0.2,
          scale: isActive ? 1 : 0.94,
          y: isActive ? 0 : 20,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative rounded-2xl p-8 overflow-hidden"
        style={{
          background: isActive ? "hsla(0,0%,100%,0.04)" : "hsla(0,0%,100%,0.01)",
          border: isActive ? "1px solid hsla(73,100%,50%,0.25)" : "1px solid hsla(0,0%,100%,0.05)",
          boxShadow: isActive
            ? `0 0 50px hsla(73,100%,50%,0.08), 0 20px 60px -20px hsla(0,0%,0%,0.5)`
            : "none",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <motion.div
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: pillar.bg }}
        />

        {/* Top accent line */}
        <motion.div
          animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute top-0 left-0 right-0 h-[2px] origin-left"
          style={{ background: "linear-gradient(to right, hsl(73 100% 50%), transparent)" }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-7">
            <motion.div
              animate={{
                scale: isActive ? 1 : 0.85,
                rotate: isActive ? 0 : -10,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: isActive ? "hsla(73,100%,50%,0.15)" : "hsla(0,0%,100%,0.04)",
                border: isActive ? "1px solid hsla(73,100%,50%,0.35)" : "1px solid hsla(0,0%,100%,0.07)",
                boxShadow: isActive ? `0 0 20px ${pillar.accentGlow}` : "none",
                transition: "all 0.5s",
              }}
            >
              <Icon
                className="w-5 h-5"
                style={{ color: isActive ? "hsl(73 100% 50%)" : "hsla(0,0%,100%,0.25)", transition: "color 0.45s" }}
              />
            </motion.div>

            {/* Number badge */}
            <span
              className="font-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: isActive ? "hsl(73 100% 50%)" : "hsla(0,0%,100%,0.2)", transition: "color 0.45s" }}
            >
              {pillar.number}
            </span>
          </div>

          {/* Titre */}
          <h3
            className="font-clash font-bold mb-3"
            style={{
              fontSize: "clamp(1.3rem, 1.8vw, 1.7rem)",
              color: isActive ? "white" : "hsla(0,0%,100%,0.4)",
              transition: "color 0.45s",
            }}
          >
            {pillar.rightTitle}
          </h3>

          {/* Description */}
          <p className="font-outfit leading-relaxed mb-6" style={{ fontSize: 14, color: isActive ? "hsla(0,0%,100%,0.55)" : "hsla(0,0%,100%,0.25)", transition: "color 0.45s" }}>
            {pillar.description}
          </p>

          {/* Livrables */}
          <div className="flex flex-wrap gap-2">
            {pillar.rightItems.map((item, j) => (
              <motion.span
                key={item}
                animate={{ opacity: isActive ? 1 : 0.3, y: isActive ? 0 : 4 }}
                transition={{ duration: 0.3, delay: isActive ? j * 0.05 : 0 }}
                className="px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wide"
                style={{
                  border: "1px solid hsla(73,100%,50%,0.2)",
                  background: "hsla(73,100%,50%,0.06)",
                  color: isActive ? "hsla(0,0%,100%,0.7)" : "hsla(0,0%,100%,0.2)",
                  transition: "color 0.45s, border-color 0.45s",
                }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ── Composant principal ───────────────────────────────────────────────────────
const ArtisteServicesV4B = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const activeIndex = useScrollIndex(wrapperRef, PILLARS.length);
  const activePillar = PILLARS[activeIndex];
  const ActiveIcon = activePillar.icon;

  return (
    <div ref={wrapperRef} style={{ height: `${PILLARS.length * 100}vh` }}>
      <div
        className="sticky top-0 overflow-hidden bg-background"
        style={{ height: "100vh" }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          className="absolute top-0 left-0 w-1/2 z-20 px-14 pt-24 pb-6 hidden lg:block"
          style={{ background: "linear-gradient(to bottom, hsl(var(--background)) 65%, transparent)" }}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-3"
          >
            Services
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-clash font-black text-foreground"
            style={{ fontSize: "clamp(1.8rem, 3vw, 3.5rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
          >
            Notre expertise{" "}
            <span className="text-primary">à votre service</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-outfit text-muted-foreground mt-3 leading-relaxed"
            style={{ fontSize: 14, maxWidth: 360 }}
          >
            De la création à la réussite, nous vous accompagnons à chaque étape pour structurer et développer votre carrière artistique.
          </motion.p>
        </div>

        <div className="flex h-full">
          {/* ── Panneau GAUCHE ────────────────────────────────── */}
          <div
            className="hidden lg:flex lg:w-1/2 h-full flex-col justify-center px-14 relative overflow-hidden"
            style={{ borderRight: "1px solid hsla(0,0%,100%,0.06)" }}
          >
            <AnimatePresence>
              <motion.div
                key={`halo-${activeIndex}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 80% 80% at 35% 65%, ${activePillar.haloColor} 0%, transparent 65%)`,
                }}
              />
            </AnimatePresence>

            {/* Grid subtle */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.015]"
              style={{
                backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative z-10 mt-48">
              <AnimatePresence mode="wait">
                <motion.div key={activeIndex} variants={panelVariants} initial="enter" animate="center" exit="exit">

                  {/* Numéro géant — très subtil */}
                  <div
                    className="font-clash font-black select-none leading-none mb-6"
                    style={{ fontSize: "clamp(6rem, 11vw, 11rem)", color: "hsla(0,0%,100%,0.03)", letterSpacing: "-0.05em", lineHeight: 0.85 }}
                  >
                    {activePillar.number}
                  </div>

                  {/* Icône */}
                  <motion.div
                    initial={{ scale: 0.5, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                      background: "hsla(73,100%,50%,0.12)",
                      border: "1px solid hsla(73,100%,50%,0.3)",
                      boxShadow: `0 0 30px ${activePillar.accentGlow}`,
                    }}
                  >
                    <ActiveIcon className="w-6 h-6 text-primary" />
                  </motion.div>

                  {/* Titre éditorial */}
                  <h3
                    className="font-clash font-bold text-foreground mb-3"
                    style={{ fontSize: "clamp(1.8rem, 2.6vw, 2.6rem)", lineHeight: 1.1 }}
                  >
                    {activePillar.leftTitle}
                  </h3>

                  {/* Statement */}
                  <p
                    className="font-outfit leading-relaxed mb-6"
                    style={{ fontSize: 16, color: "hsla(0,0%,100%,0.55)", maxWidth: 400, fontStyle: "italic" }}
                  >
                    {activePillar.statement}
                  </p>

                  {/* Bénéfices */}
                  <div className="space-y-3">
                    {activePillar.leftItems.map((item, j) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: j * 0.08 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" style={{ boxShadow: "0 0 8px hsl(73 100% 50% / 0.4)" }} />
                        <span className="font-mono text-[12px] text-foreground/70 tracking-wide">{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Dots de progression */}
                  <div className="flex gap-2 mt-10">
                    {PILLARS.map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          width: i === activeIndex ? 32 : 6,
                          background: i === activeIndex ? "hsl(73 100% 50%)" : "hsla(0,0%,100%,0.15)",
                        }}
                        transition={{ duration: 0.35 }}
                        className="h-1.5 rounded-full"
                        style={{ boxShadow: i === activeIndex ? "0 0 10px hsl(73 100% 50% / 0.3)" : "none" }}
                      />
                    ))}
                  </div>

                  {/* Counter */}
                  <div className="mt-8">
                    <span className="font-mono text-[10px] uppercase tracking-[.35em] text-muted-foreground/50">
                      {activeIndex + 1} / {PILLARS.length}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Panneau DROIT ──────────────────────────────── */}
          <div className="w-full lg:w-1/2 h-full relative">
            <div
              className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-10"
              style={{ background: "linear-gradient(to bottom, hsl(var(--background)), transparent)" }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
              style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }}
            />

            {/* Indicateur vertical */}
            <div className="absolute top-1/2 right-5 -translate-y-1/2 z-20 flex flex-col items-center gap-2.5">
              {PILLARS.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: i === activeIndex ? 24 : 4,
                    background: i === activeIndex ? "hsl(73 100% 50%)" : "hsla(0,0%,100%,0.12)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-1 rounded-full"
                  style={{ boxShadow: i === activeIndex ? "0 0 8px hsl(73 100% 50% / 0.4)" : "none" }}
                />
              ))}
            </div>

            <div className="h-full overflow-hidden">
              <motion.div
                className="flex flex-col"
                animate={{ y: `-${activeIndex * 100}vh` }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: `${PILLARS.length * 100}vh` }}
              >
                {PILLARS.map((pillar, i) => (
                  <InfoCard key={pillar.number} pillar={pillar} isActive={activeIndex === i} />
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {activeIndex < PILLARS.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center gap-1"
          >
            <span className="font-mono text-[7px] uppercase tracking-[.5em] text-muted-foreground/40">scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-6 bg-primary/30"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ArtisteServicesV4B;
