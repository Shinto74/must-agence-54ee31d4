import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Video, Share2, Rocket, Search } from "lucide-react";
import svcBgContent from "@/assets/svc-bg-content.jpg";
import svcBgSocial from "@/assets/svc-bg-social.jpg";
import svcBgAds from "@/assets/svc-bg-ads.jpg";
import svcBgSeo from "@/assets/svc-bg-seo.jpg";
import svcSectionBg from "@/assets/svc-section-bg.jpg";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SERVICES = [
  {
    icon: <Video size={28} />,
    num: "01",
    title: "Création de Contenu Premium",
    description: "Production de photos et vidéos professionnelles haute définition pour sublimer votre image de marque.",
    chips: ["Photo HD", "Vidéo corporate", "Motion design", "Drone"],
    bgGradient: "radial-gradient(ellipse 60% 50% at 70% 30%, hsl(30 40% 60% / 0.06) 0%, transparent 70%)",
    bgImage: svcBgContent,
  },
  {
    icon: <Share2 size={28} />,
    num: "02",
    title: "Social Media Management",
    description: "Gestion professionnelle de vos réseaux sociaux pour fédérer et engager votre communauté.",
    chips: ["Instagram", "TikTok", "LinkedIn", "Planning éditorial"],
    bgGradient: "radial-gradient(ellipse 55% 45% at 30% 60%, hsl(280 30% 50% / 0.04) 0%, transparent 70%)",
    bgImage: svcBgSocial,
  },
  {
    icon: <Rocket size={28} />,
    num: "03",
    title: "Campagnes Publicitaires",
    description: "Création et pilotage de campagnes ultra-performantes sur Google Ads, Meta Ads et TikTok Ads.",
    chips: ["Meta Ads", "Google Ads", "TikTok Ads", "Retargeting"],
    bgGradient: "radial-gradient(ellipse 50% 50% at 60% 40%, hsl(20 50% 55% / 0.05) 0%, transparent 70%)",
    bgImage: svcBgAds,
  },
  {
    icon: <Search size={28} />,
    num: "04",
    title: "SEO & Référencement",
    description: "Optimisation de votre visibilité sur les moteurs de recherche pour attirer un trafic qualifié.",
    chips: ["Audit SEO", "Netlinking", "Content SEO", "Local SEO"],
    bgGradient: "radial-gradient(ellipse 50% 55% at 40% 50%, hsl(200 30% 50% / 0.04) 0%, transparent 70%)",
    bgImage: svcBgSeo,
  },
];

const SPRING_CONFIG = { stiffness: 60, damping: 20, mass: 0.8 };

interface CardLayerProps {
  svc: (typeof SERVICES)[0];
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  hoveredCard: number | null;
  onHover: (index: number | null) => void;
}

const CardLayer = ({ svc, index, total, scrollYProgress, hoveredCard, onHover }: CardLayerProps) => {
  const segmentSize = 1 / total;
  const center = (index + 0.5) * segmentSize;
  const [showRipple, setShowRipple] = useState(false);
  const [showSweep, setShowSweep] = useState(false);

  const rawDistance = useTransform(scrollYProgress, (v) => (v - center) / segmentSize);
  const distance = useSpring(rawDistance, SPRING_CONFIG);

  const z = useTransform(distance, [-2, -1, 0, 1, 2], [-600, -300, 0, 200, 400]);
  const scale = useTransform(distance, [-2, -1, 0, 1, 2], [0.5, 0.7, 1, 0.85, 0.6]);
  const opacity = useTransform(distance, [-2, -1, 0, 1, 2], [0, 0.4, 1, 0.5, 0]);
  const blur = useTransform(distance, [-2, -1, 0, 1, 2], [8, 4, 0, 3, 8]);
  const rotateX = useTransform(distance, [-2, -1, 0, 1, 2], [12, 6, 0, -4, -10]);
  const y = useTransform(distance, [-2, -1, 0, 1, 2], [120, 50, 0, -30, -80]);
  const glowOpacity = useTransform(distance, [-1, 0, 1], [0, 1, 0]);
  const borderOpacity = useTransform(distance, [-1, 0, 1], [0.06, 0.5, 0.06]);

  const isHovered = hoveredCard === index;
  const isSiblingHovered = hoveredCard !== null && hoveredCard !== index;

  const handleMouseEnter = useCallback(() => {
    onHover(index);
    setShowRipple(true);
    setShowSweep(true);
    setTimeout(() => setShowRipple(false), 800);
    setTimeout(() => setShowSweep(false), 700);
  }, [index, onHover]);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        zIndex: useTransform(distance, (d) => Math.round((1 - Math.abs(d)) * 100) + (isHovered ? 50 : 0)),
        perspective: "1200px",
      }}
    >
      {/* Multi-layer glow behind card */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(95vw, 900px)",
          height: 500,
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, hsl(43 55% 55% / 0.18) 0%, hsl(43 52% 39% / 0.06) 45%, transparent 72%)",
          filter: "blur(50px)",
          opacity: glowOpacity,
        }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(110vw, 1200px)",
          height: 600,
          background: "radial-gradient(ellipse 80% 70% at 50% 45%, hsl(35 40% 70% / 0.08) 0%, transparent 65%)",
          filter: "blur(80px)",
          opacity: useTransform(glowOpacity, (o) => o * 0.6),
        }}
      />

      {/* Contextual atmosphere */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: svc.bgGradient,
          opacity: useTransform(glowOpacity, (o) => o * 0.8),
        }}
      />

      <motion.div
        className="relative pointer-events-auto"
        style={{
          width: "min(88vw, 780px)",
          translateZ: z,
          scale,
          opacity: useTransform(opacity, (o) => isSiblingHovered ? o * 0.5 : o),
          rotateX,
          y,
          filter: useTransform(blur, (b) => {
            const extraBlur = isSiblingHovered ? 2 : 0;
            return `blur(${b + extraBlur}px)`;
          }),
          transformStyle: "preserve-3d",
          transition: "filter 0.5s ease",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="relative overflow-hidden rounded-[1.5rem] p-8 md:p-10 lg:p-12"
          animate={isHovered ? { y: -6 } : { y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          style={{
            background: "linear-gradient(155deg, hsl(40 20% 97%) 0%, hsl(40 15% 95%) 40%, hsl(40 10% 92%) 100%)",
            borderWidth: 1.5,
            borderStyle: "solid",
            borderColor: useTransform(borderOpacity, (o) => `hsl(43 55% 55% / ${isHovered ? Math.max(o, 0.6) : o})`),
            boxShadow: isHovered
              ? "0 50px 120px -20px hsl(43 52% 39% / 0.3), 0 0 100px hsl(43 55% 55% / 0.18), 0 25px 70px -10px hsl(0 0% 0% / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.5)"
              : undefined,
          }}
        >
          {/* Top accent line */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: "linear-gradient(90deg, transparent 5%, hsl(43 55% 55% / 0.6) 50%, transparent 95%)",
              opacity: glowOpacity,
              transformOrigin: "center",
              scaleX: useTransform(glowOpacity, [0, 1], [0, 1]),
            }}
          />

          {/* ── Ripple effect on hover ── */}
          <AnimatePresence>
            {showRipple && (
              <motion.div
                className="absolute pointer-events-none rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  x: "-50%",
                  y: "-50%",
                  border: "1.5px solid hsl(43 55% 55% / 0.25)",
                }}
                initial={{ width: 0, height: 0, opacity: 0.6 }}
                animate={{ width: 800, height: 800, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            )}
          </AnimatePresence>

          {/* ── Light sweep on hover ── */}
          <AnimatePresence>
            {showSweep && (
              <motion.div
                className="absolute inset-0 pointer-events-none z-30"
                initial={{ x: "-120%" }}
                animate={{ x: "220%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  background: "linear-gradient(105deg, transparent 30%, hsl(43 55% 55% / 0.06) 42%, hsl(0 0% 100% / 0.18) 50%, hsl(43 55% 55% / 0.08) 58%, transparent 70%)",
                  width: "60%",
                }}
              />
            )}
          </AnimatePresence>

          {/* Contextual background image */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[1.5rem]">
            <img
              src={svc.bgImage}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: "blur(12px) saturate(0.6) brightness(1.1)",
                opacity: isHovered ? 0.45 : 0.35,
                transform: "scale(1.15)",
                transition: "opacity 0.6s ease",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(155deg, hsl(40 20% 97% / 0.45) 0%, hsl(40 15% 95% / 0.35) 50%, hsl(40 10% 92% / 0.5) 100%)",
              }}
            />
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{
              background: "linear-gradient(90deg, transparent 15%, hsl(43 55% 55% / 0.15) 50%, transparent 85%)",
              opacity: glowOpacity,
            }}
          />

          {/* Grain texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-[1.5rem]"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Decorative corner lines — top-right */}
          <motion.div
            className="absolute top-6 right-6 pointer-events-none"
            style={{ opacity: useTransform(glowOpacity, (o) => o * 0.25) }}
          >
            <div className="w-12 h-[1px]" style={{ background: "linear-gradient(to left, hsl(43 55% 55% / 0.5), transparent)" }} />
            <div className="w-[1px] h-12 ml-auto -mt-[1px]" style={{ background: "linear-gradient(to bottom, hsl(43 55% 55% / 0.5), transparent)" }} />
          </motion.div>

          {/* Decorative corner lines — bottom-left */}
          <motion.div
            className="absolute bottom-6 left-6 pointer-events-none"
            style={{ opacity: useTransform(glowOpacity, (o) => o * 0.2) }}
          >
            <div className="w-[1px] h-10" style={{ background: "linear-gradient(to top, hsl(43 55% 55% / 0.4), transparent)" }} />
            <div className="w-10 h-[1px] -mt-[1px]" style={{ background: "linear-gradient(to right, hsl(43 55% 55% / 0.4), transparent)" }} />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:gap-8">
            <div className="flex shrink-0 items-center gap-4 md:flex-col md:items-start md:gap-3">
              {/* Icon with pulse on hover */}
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                animate={isHovered ? { scale: [1, 1.12, 1.06], boxShadow: "0 18px 52px hsl(43 52% 39% / 0.4), 0 0 40px hsl(43 55% 55% / 0.3)" } : { scale: 1 }}
                transition={isHovered ? { duration: 0.6, ease: EASE } : { duration: 0.4 }}
                style={{
                  background: "linear-gradient(135deg, hsl(43 52% 39%), hsl(43 55% 55%))",
                  border: "1.5px solid hsl(43 55% 55% / 0.6)",
                  color: "hsl(0 0% 100%)",
                  boxShadow: "0 14px 42px hsl(43 52% 39% / 0.3), 0 0 30px hsl(43 55% 55% / 0.2)",
                }}
              >
                {svc.icon}
                {/* Pulse ring on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{ border: "2px solid hsl(43 55% 55% / 0.3)" }}
                      initial={{ scale: 1, opacity: 0.7 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity, ease: EASE }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              <span
                className="font-clash text-3xl font-black md:text-4xl"
                style={{
                  color: "hsl(43 55% 55%)",
                  textShadow: "0 0 40px hsl(43 55% 55% / 0.35)",
                }}
              >
                {svc.num}
              </span>
            </div>

            <div className="flex-1">
              <h3
                className="mb-3 font-clash text-xl font-black md:text-2xl transition-colors duration-500"
                style={{ color: isHovered ? "hsl(43 50% 32%)" : "hsl(43 52% 39%)" }}
              >
                {svc.title}
              </h3>
              <p
                className="mb-6 text-sm leading-relaxed md:text-[15px]"
                style={{ color: "hsl(0 0% 10% / 0.55)" }}
              >
                {svc.description}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {svc.chips.map((chip, ci) => (
                  <motion.span
                    key={chip}
                    className="rounded-xl px-4 py-2 text-[11px] font-mono font-medium"
                    animate={isHovered ? { y: -2, scale: 1.03 } : { y: 0, scale: 1 }}
                    transition={{ duration: 0.35, delay: ci * 0.04, ease: EASE }}
                    style={{
                      background: isHovered ? "hsl(43 55% 55% / 0.18)" : "hsl(43 55% 55% / 0.12)",
                      border: `1px solid ${isHovered ? "hsl(43 55% 55% / 0.4)" : "hsl(43 55% 55% / 0.25)"}`,
                      color: "hsl(43 52% 39%)",
                      transition: "background 0.4s ease, border-color 0.4s ease",
                    }}
                  >
                    {chip}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative orb — top right */}
          <div
            className="absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, hsl(43 55% 55% / 0.1) 0%, hsl(35 40% 70% / 0.04) 40%, transparent 72%)",
            }}
          />
          {/* Decorative orb — bottom left */}
          <div
            className="absolute -bottom-16 -left-16 h-[200px] w-[200px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, hsl(43 52% 39% / 0.06) 0%, transparent 70%)",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/* ── Progress dots ── */
const ProgressDots = ({
  total,
  scrollYProgress,
}: {
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) => {
  const activeIndex = useTransform(scrollYProgress, (v) =>
    Math.min(Math.round(v * total), total - 1)
  );
  const smoothActive = useSpring(activeIndex, { stiffness: 100, damping: 20 });

  return (
    <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {SERVICES.map((svc, i) => (
        <div key={i} className="flex items-center gap-3">
          <motion.div
            className="relative w-2.5 h-2.5 rounded-full"
            style={{
              background: useTransform(smoothActive, (a) =>
                Math.abs(a - i) < 0.6 ? "hsl(43 55% 55%)" : "hsl(43 55% 55% / 0.2)"
              ),
              boxShadow: useTransform(smoothActive, (a) =>
                Math.abs(a - i) < 0.6 ? "0 0 12px hsl(43 55% 55% / 0.5)" : "none"
              ),
              scale: useTransform(smoothActive, (a) =>
                Math.abs(a - i) < 0.6 ? 1.4 : 1
              ),
            }}
          />
          <motion.span
            className="font-mono text-[9px] uppercase tracking-[0.15em] whitespace-nowrap hidden md:block"
            style={{
              color: useTransform(smoothActive, (a) =>
                Math.abs(a - i) < 0.6 ? "hsl(43 55% 55%)" : "hsl(43 55% 55% / 0)"
              ),
              opacity: useTransform(smoothActive, (a) =>
                Math.abs(a - i) < 0.6 ? 1 : 0
              ),
              x: useTransform(smoothActive, (a) =>
                Math.abs(a - i) < 0.6 ? 0 : -8
              ),
            }}
          >
            {svc.num}
          </motion.span>
        </div>
      ))}
    </div>
  );
};

/* ── Decorative floating elements ── */
const AmbientDecorations = ({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) => {
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [45, -135]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <>
      <motion.div
        className="absolute top-[15%] left-[8%] w-16 h-16 pointer-events-none opacity-[0.06]"
        style={{ border: "1px solid hsl(43 55% 55%)", rotate: rotate1, y: y1, borderRadius: "4px" }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[12%] w-20 h-20 rounded-full pointer-events-none opacity-[0.04]"
        style={{ border: "1px solid hsl(43 55% 55%)", y: y2 }}
      />
      <motion.div
        className="absolute top-[25%] right-[20%] w-[120px] h-[1px] pointer-events-none opacity-[0.06]"
        style={{ background: "linear-gradient(90deg, transparent, hsl(43 55% 55% / 0.4), transparent)", rotate: rotate2, y: y1 }}
      />
      <motion.div
        className="absolute top-[45%] left-[5%] pointer-events-none opacity-[0.07]"
        style={{ y: y2, color: "hsl(43 55% 55%)" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
          <line x1="8" y1="2" x2="8" y2="14" />
          <line x1="2" y1="8" x2="14" y2="8" />
        </svg>
      </motion.div>
      <div className="absolute bottom-[30%] left-[15%] pointer-events-none opacity-[0.05]">
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <div
              key={`${row}-${col}`}
              className="absolute w-1 h-1 rounded-full"
              style={{ background: "hsl(43 55% 55%)", left: col * 8, top: row * 8 }}
            />
          ))
        )}
      </div>
    </>
  );
};

const Services3DScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const handleHover = useCallback((index: number | null) => {
    setHoveredCard(index);
  }, []);

  return (
    <section id="services" ref={containerRef} data-sticky-parent className="relative z-[1]" style={{ height: `${(SERVICES.length + 1) * 100}vh` }}>
      <div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{
          perspective: "1200px",
          background: "linear-gradient(180deg, hsl(40 20% 97%) 0%, hsl(38 18% 94%) 40%, hsl(40 15% 96%) 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 30%, hsl(43 40% 80% / 0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 70%, hsl(43 52% 39% / 0.04) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 80% 60%, hsl(35 45% 65% / 0.05) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 50%, hsl(40 20% 97% / 0.6) 100%)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <AmbientDecorations scrollYProgress={scrollYProgress} />

        <div
          className="absolute top-20 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(43 55% 55% / 0.06) 0%, transparent 55%)", filter: "blur(20px)" }}
        />
        <div
          className="absolute bottom-10 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(43 55% 55% / 0.05) 0%, transparent 55%)", filter: "blur(20px)" }}
        />

        <motion.div
          className="absolute top-16 left-6 md:left-12 z-20"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]),
            y: useTransform(scrollYProgress, [0, 0.1], [0, -40]),
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-[1.5px]" style={{ background: "linear-gradient(to right, hsl(43 55% 55%), transparent)" }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: "hsl(43 55% 55%)" }}>
              Services
            </span>
          </div>
          <h2 className="font-clash text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[0.95]" style={{ color: "hsl(0 0% 10%)" }}>
            Ce qu'on fait
            <br />
            <span style={{ color: "hsl(43 55% 55%)", textShadow: "0 0 40px hsl(43 55% 55% / 0.2)" }}>
              pour vous
            </span>
          </h2>
        </motion.div>

        {SERVICES.map((svc, i) => (
          <CardLayer
            key={svc.title}
            svc={svc}
            index={i}
            total={SERVICES.length}
            scrollYProgress={scrollYProgress}
            hoveredCard={hoveredCard}
            onHover={handleHover}
          />
        ))}

        <ProgressDots total={SERVICES.length} scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
};

export default Services3DScroll;
