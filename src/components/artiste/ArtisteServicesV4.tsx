import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Camera, Rocket, Megaphone, MessageSquare, Handshake } from "lucide-react";

const PILLARS = [
  {
    number: "01",
    timecode: "00:01",
    icon: Camera,
    title: "Création Visuelle",
    description:
      "Chaque image raconte votre histoire. On produit des visuels qui s'imposent dans le feed et marquent les esprits.",
    items: [
      "Pochettes d'album & EP",
      "Clips & vidéos virales",
      "Visuels Instagram / TikTok",
      "Showreel & portfolio vidéo",
    ],
    haloColor: "hsla(160,60%,50%,0.07)",
    accentGlow: "hsla(160,60%,50%,0.4)",
    bg: "radial-gradient(ellipse 80% 70% at 50% 50%, hsla(160,60%,10%,0.8) 0%, transparent 70%)",
  },
  {
    number: "02",
    timecode: "00:02",
    icon: Rocket,
    title: "Stratégie de Lancement",
    description:
      "Chaque sortie est un événement. On planifie chaque détail pour que votre release crée l'impact maximal.",
    items: [
      "Planification singles / albums / EPs",
      "Timing & roadmap de sortie",
      "Coordination multi-plateformes",
    ],
    haloColor: "hsla(259,94%,60%,0.07)",
    accentGlow: "hsla(259,94%,76%,0.4)",
    bg: "radial-gradient(ellipse 80% 70% at 50% 50%, hsla(260,40%,10%,0.8) 0%, transparent 70%)",
  },
  {
    number: "03",
    timecode: "00:03",
    icon: Megaphone,
    title: "Marketing & Influence",
    description:
      "Ads haute performance et relations presse pour amplifier votre portée à grande échelle.",
    items: [
      "Campagnes Meta, Google, TikTok, Snapchat",
      "YouTube Ads ciblées",
      "Relations Presse (Radios, Blogs, Médias)",
      "SEO Musique",
    ],
    haloColor: "hsla(25,95%,50%,0.07)",
    accentGlow: "hsla(25,95%,60%,0.4)",
    bg: "radial-gradient(ellipse 80% 70% at 50% 50%, hsla(25,50%,8%,0.8) 0%, transparent 70%)",
  },
  {
    number: "04",
    timecode: "00:04",
    icon: MessageSquare,
    title: "Community & Storytelling",
    description:
      "Construire une image iconique, raconter une histoire authentique sur le long terme.",
    items: [
      "Brand Content & Narratif d'artiste",
      "Community Management dédié",
      "Gestion engagement social media",
      "Content design & visuels",
    ],
    haloColor: "hsla(189,94%,40%,0.07)",
    accentGlow: "hsla(189,94%,53%,0.4)",
    bg: "radial-gradient(ellipse 80% 70% at 50% 50%, hsla(195,50%,8%,0.8) 0%, transparent 70%)",
  },
  {
    number: "05",
    timecode: "00:05",
    icon: Handshake,
    title: "Booking & Partenariats",
    description:
      "On connecte les artistes aux marques et aux opportunités qui font la différence.",
    items: [
      "Mise en relation marques / collaborations",
      "Opportunités business",
      "Partnerships stratégiques",
    ],
    haloColor: "hsla(73,100%,50%,0.08)",
    accentGlow: "hsla(73,100%,50%,0.4)",
    bg: "radial-gradient(ellipse 80% 70% at 50% 50%, hsla(73,100%,5%,0.8) 0%, transparent 70%)",
  },
];

const panelVariants = {
  enter: { opacity: 0, y: 24, scale: 0.97 },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -24,
    scale: 0.97,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  },
};

// ── Bloc VISUEL droit — icône + chips, distinct du panneau éditorial gauche ──
const VisualBlock = ({
  pillar,
  isActive,
}: {
  pillar: (typeof PILLARS)[number];
  isActive: boolean;
}) => {
  const Icon = pillar.icon;

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ height: "100vh", width: "100%" }}
    >
      {/* Fond atmosphérique par pilier */}
      <motion.div
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.7 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: pillar.bg }}
      />

      {/* Numéro géant en fond */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.span
          animate={{ opacity: isActive ? 0.05 : 0, scale: isActive ? 1 : 1.08 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-clash font-black select-none leading-none text-white"
          style={{ fontSize: "clamp(14rem, 28vw, 22rem)", letterSpacing: "-0.05em" }}
        >
          {pillar.number}
        </motion.span>
      </div>

      {/* Contenu centré : icône + timecode + chips */}
      <motion.div
        animate={{ opacity: isActive ? 1 : 0.2, y: isActive ? 0 : 20 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center gap-6 text-center px-10"
      >
        {/* Icône avec halo animé */}
        <motion.div
          animate={{
            boxShadow: isActive
              ? `0 0 32px ${pillar.accentGlow}, 0 0 64px ${pillar.accentGlow}`
              : "none",
          }}
          transition={{ duration: 0.7 }}
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{
            background: "hsla(73,100%,50%,0.1)",
            border: "1px solid hsla(73,100%,50%,0.25)",
          }}
        >
          <Icon className="w-10 h-10 text-primary" />
        </motion.div>

        {/* Timecode */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-px" style={{ background: "hsla(73,100%,50%,0.4)" }} />
          <span
            className="font-mono text-xs font-medium tracking-widest"
            style={{ color: isActive ? "hsl(73 100% 50%)" : "hsla(73,100%,50%,0.3)" }}
          >
            {pillar.timecode}
          </span>
          <div className="w-6 h-px" style={{ background: "hsla(73,100%,50%,0.4)" }} />
        </div>

        {/* Items comme chips */}
        <div className="flex flex-wrap gap-2 justify-center max-w-xs">
          {pillar.items.map((item, j) => (
            <motion.span
              key={item}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 12 }}
              transition={{ duration: 0.4, delay: isActive ? j * 0.07 : 0 }}
              className="px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wide"
              style={{
                border: "1px solid hsla(73,100%,50%,0.2)",
                background: "hsla(73,100%,50%,0.06)",
                color: "hsla(0,0%,100%,0.65)",
              }}
            >
              {item}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ── Composant principal ───────────────────────────────────────────────────────
const ArtisteServicesV4 = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const isScrolling = useRef(false);
  // Ref pour éviter les closures périmées dans le handler wheel
  const activeIndexRef = useRef(0);

  const activePillar = PILLARS[activeIndex];
  const ActiveIcon = activePillar.icon;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const navigate = useCallback((dir: 1 | -1) => {
    setActiveIndex((prev) => Math.max(0, Math.min(PILLARS.length - 1, prev + dir)));
  }, []);

  // ── Scroll capturé sur toute la fenêtre quand la section est active ─────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      // La section est "active" quand elle couvre le centre du viewport
      const sectionActive =
        rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
      if (!sectionActive) return;

      const goingDown = e.deltaY > 0;
      const current = activeIndexRef.current;

      // Aux limites → laisser le scroll page continuer
      if (!goingDown && current === 0) return;
      if (goingDown && current === PILLARS.length - 1) return;

      e.preventDefault();
      if (isScrolling.current) return;
      isScrolling.current = true;
      navigate(goingDown ? 1 : -1);
      setTimeout(() => {
        isScrolling.current = false;
      }, 700);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [navigate]);

  // Touch support
  const touchStartY = useRef(0);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#070707] overflow-hidden"
      style={{ height: "100vh" }}
      onTouchStart={(e) => {
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchEnd={(e) => {
        const delta = touchStartY.current - e.changedTouches[0].clientY;
        if (Math.abs(delta) > 40) navigate(delta > 0 ? 1 : -1);
      }}
    >
      {/* Header superposé panneau gauche */}
      <div
        ref={headerRef}
        className="absolute top-0 left-0 w-1/2 z-20 px-14 pt-10 pb-6 hidden lg:block"
        style={{ background: "linear-gradient(to bottom, #070707 60%, transparent)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-3"
        >
          <div className="w-5 h-px bg-primary" />
          <p className="font-mono text-[10px] uppercase tracking-[.5em] text-primary">
            Pôle Artiste
          </p>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-clash font-black text-foreground"
          style={{
            fontSize: "clamp(1.8rem, 3vw, 3.5rem)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          Tout ce qu&apos;on fait pour{" "}
          <span
            style={{
              color: "transparent",
              WebkitTextStroke: "1.5px hsl(73 100% 50%)",
            }}
          >
            vos carrières.
          </span>
        </motion.h2>
      </div>

      {/* Layout split */}
      <div className="flex h-full">
        {/* ── Panneau GAUCHE — éditorial ───────────────────────────────────── */}
        <div
          className="hidden lg:flex lg:w-1/2 h-full flex-col justify-center px-14 relative overflow-hidden"
          style={{ borderRight: "1px solid hsla(0,0%,100%,0.05)" }}
        >
          {/* Halo de fond animé */}
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

          {/* Grid pattern subtil */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Contenu principal */}
          <div className="relative z-10 mt-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Numéro géant */}
                <div
                  className="font-clash font-black select-none leading-none mb-6"
                  style={{
                    fontSize: "clamp(6rem, 11vw, 11rem)",
                    color: "hsla(0,0%,100%,0.04)",
                    letterSpacing: "-0.05em",
                    lineHeight: 0.85,
                  }}
                >
                  {activePillar.number}
                </div>

                {/* Icône */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: "hsla(73,100%,50%,0.12)",
                    border: "1px solid hsla(73,100%,50%,0.3)",
                    boxShadow: `0 0 28px ${activePillar.accentGlow}`,
                  }}
                >
                  <ActiveIcon className="w-7 h-7 text-primary" />
                </div>

                <h3
                  className="font-clash font-bold text-foreground mb-4"
                  style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", lineHeight: 1.15 }}
                >
                  {activePillar.title}
                </h3>

                <p
                  className="font-outfit text-white/45 leading-relaxed mb-7"
                  style={{ fontSize: 14, maxWidth: 360 }}
                >
                  {activePillar.description}
                </p>

                <div className="space-y-2.5">
                  {activePillar.items.map((item, j) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: j * 0.07 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="font-mono text-[11px] text-white/55 tracking-wide">
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Dots de progression */}
                <div className="flex gap-2 mt-10">
                  {PILLARS.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      animate={{
                        width: i === activeIndex ? 28 : 6,
                        background:
                          i === activeIndex
                            ? "hsl(73 100% 50%)"
                            : "hsla(0,0%,100%,0.18)",
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-1.5 rounded-full cursor-pointer"
                    />
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4 mt-8">
                  <motion.a
                    href="#packs"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-clash font-semibold text-xs text-background bg-primary"
                  >
                    Voir les packs <span>&#8594;</span>
                  </motion.a>
                  <span className="font-mono text-[8px] uppercase tracking-[.4em] text-white/20">
                    {activeIndex + 1} / {PILLARS.length}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Panneau DROIT — visuel, scroll virtuel ────────────────────────── */}
        <div className="w-full lg:w-1/2 h-full relative">
          {/* Gradient fondu haut/bas */}
          <div
            className="absolute top-0 left-0 right-0 h-20 pointer-events-none z-10"
            style={{ background: "linear-gradient(to bottom, #070707, transparent)" }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10"
            style={{ background: "linear-gradient(to top, #070707, transparent)" }}
          />

          {/* Indicateur dots droite */}
          <div className="absolute top-1/2 right-5 -translate-y-1/2 z-20 flex flex-col items-center gap-2">
            {PILLARS.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveIndex(i)}
                animate={{
                  height: i === activeIndex ? 20 : 4,
                  background:
                    i === activeIndex
                      ? "hsl(73 100% 50%)"
                      : "hsla(0,0%,100%,0.15)",
                }}
                transition={{ duration: 0.3 }}
                className="w-1 rounded-full cursor-pointer"
              />
            ))}
          </div>

          {/* Conteneur scroll virtuel */}
          <div className="h-full overflow-hidden">
            <motion.div
              className="flex flex-col"
              animate={{ y: `-${activeIndex * 100}vh` }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: `${PILLARS.length * 100}vh` }}
            >
              {PILLARS.map((pillar, i) => (
                <VisualBlock
                  key={pillar.number}
                  pillar={pillar}
                  isActive={activeIndex === i}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hint scroll */}
      {activeIndex < PILLARS.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center gap-1"
        >
          <span className="font-mono text-[7px] uppercase tracking-[.5em] text-white/20">
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-5 bg-primary/30"
          />
        </motion.div>
      )}
    </section>
  );
};

export default ArtisteServicesV4;
