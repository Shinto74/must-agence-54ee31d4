import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Video, Share2, Rocket, Search } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SERVICES = [
  {
    icon: <Video size={28} />,
    num: "01",
    title: "Création de Contenu Premium",
    description:
      "Production de photos et vidéos professionnelles haute définition pour sublimer votre image de marque.",
    chips: ["Photo HD", "Vidéo corporate", "Motion design", "Drone"],
  },
  {
    icon: <Share2 size={28} />,
    num: "02",
    title: "Social Media Management",
    description:
      "Gestion professionnelle de vos réseaux sociaux pour fédérer et engager votre communauté.",
    chips: ["Instagram", "TikTok", "LinkedIn", "Planning éditorial"],
  },
  {
    icon: <Rocket size={28} />,
    num: "03",
    title: "Campagnes Publicitaires",
    description:
      "Création et pilotage de campagnes ultra-performantes sur Google Ads, Meta Ads et TikTok Ads.",
    chips: ["Meta Ads", "Google Ads", "TikTok Ads", "Retargeting"],
  },
  {
    icon: <Search size={28} />,
    num: "04",
    title: "SEO & Référencement",
    description:
      "Optimisation de votre visibilité sur les moteurs de recherche pour attirer un trafic qualifié.",
    chips: ["Audit SEO", "Netlinking", "Content SEO", "Local SEO"],
  },
];

const SPRING_CONFIG = { stiffness: 60, damping: 20, mass: 0.8 };

interface CardLayerProps {
  svc: (typeof SERVICES)[0];
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}

const CardLayer = ({ svc, index, total, scrollYProgress }: CardLayerProps) => {
  // Each card occupies a segment of the scroll progress
  const segmentSize = 1 / total;
  const center = (index + 0.5) * segmentSize;

  // Distance from active center: -1 (far behind) to +1 (far ahead)
  const rawDistance = useTransform(scrollYProgress, (v) => {
    return (v - center) / segmentSize;
  });

  // Smooth with spring for inertia
  const distance = useSpring(rawDistance, SPRING_CONFIG);

  // Z translation: active = 0, behind = negative, ahead = positive
  const z = useTransform(distance, [-2, -1, 0, 1, 2], [-600, -300, 0, 200, 400]);
  const scale = useTransform(distance, [-2, -1, 0, 1, 2], [0.5, 0.7, 1, 0.85, 0.6]);
  const opacity = useTransform(distance, [-2, -1, 0, 1, 2], [0, 0.4, 1, 0.5, 0]);
  const blur = useTransform(distance, [-2, -1, 0, 1, 2], [8, 4, 0, 3, 8]);
  const rotateX = useTransform(distance, [-2, -1, 0, 1, 2], [12, 6, 0, -4, -10]);
  const y = useTransform(distance, [-2, -1, 0, 1, 2], [120, 50, 0, -30, -80]);
  const glowOpacity = useTransform(distance, [-1, 0, 1], [0, 1, 0]);
  const borderOpacity = useTransform(distance, [-1, 0, 1], [0.06, 0.5, 0.06]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        zIndex: useTransform(distance, (d) => Math.round((1 - Math.abs(d)) * 100)),
        perspective: "1200px",
      }}
    >
      {/* Glow behind active card */}
      <motion.div
        className="absolute rounded-[3rem] pointer-events-none"
        style={{
          width: "min(90vw, 820px)",
          height: 380,
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, hsl(43 55% 55% / 0.2) 0%, hsl(43 52% 39% / 0.08) 40%, transparent 72%)",
          filter: "blur(40px)",
          opacity: glowOpacity,
        }}
      />

      <motion.div
        className="relative pointer-events-auto"
        style={{
          width: "min(88vw, 780px)",
          translateZ: z,
          scale,
          opacity,
          rotateX,
          y,
          filter: useTransform(blur, (b) => `blur(${b}px)`),
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="relative overflow-hidden rounded-[1.5rem] p-8 md:p-10 lg:p-12"
          style={{
            background:
              "linear-gradient(155deg, hsl(var(--background)) 0%, hsl(var(--card)) 45%, hsl(var(--muted)) 100%)",
            borderWidth: 1.5,
            borderStyle: "solid",
            borderColor: useTransform(borderOpacity, (o) => `hsl(43 55% 55% / ${o})`),
            boxShadow: useTransform(glowOpacity, (o) =>
              o > 0.3
                ? `0 40px 100px -20px hsl(43 52% 39% / ${0.28 * o}), 0 0 80px hsl(43 55% 55% / ${0.15 * o}), inset 0 1px 0 hsl(0 0% 100% / 0.15)`
                : "0 4px 12px -8px hsl(0 0% 0% / 0.06), inset 0 1px 0 hsl(0 0% 100% / 0.05)"
            ),
          }}
        >
          {/* Top accent line */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent 5%, hsl(43 55% 55% / 0.6) 50%, transparent 95%)",
              opacity: glowOpacity,
              transformOrigin: "center",
              scaleX: useTransform(glowOpacity, [0, 1], [0, 1]),
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:gap-8">
            <div className="flex shrink-0 items-center gap-4 md:flex-col md:items-start md:gap-3">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-700"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(43 52% 39%), hsl(43 55% 55%))",
                  border: "1.5px solid hsl(43 55% 55% / 0.6)",
                  color: "hsl(0 0% 100%)",
                  boxShadow:
                    "0 14px 42px hsl(43 52% 39% / 0.3), 0 0 30px hsl(43 55% 55% / 0.2)",
                }}
              >
                {svc.icon}
              </div>

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
                className="mb-3 font-clash text-xl font-black md:text-2xl"
                style={{ color: "hsl(43 52% 39%)" }}
              >
                {svc.title}
              </h3>
              <p
                className="mb-6 text-sm leading-relaxed md:text-[15px]"
                style={{ color: "hsl(var(--foreground) / 0.6)" }}
              >
                {svc.description}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {svc.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-xl px-4 py-2 text-[11px] font-mono font-medium"
                    style={{
                      background: "hsl(43 55% 55% / 0.14)",
                      border: "1px solid hsl(43 55% 55% / 0.3)",
                      color: "hsl(43 52% 39%)",
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative orb */}
          <div
            className="absolute -top-16 -right-16 h-[250px] w-[250px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, hsl(43 55% 55% / 0.12) 0%, transparent 72%)",
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
      {SERVICES.map((_, i) => (
        <motion.div
          key={i}
          className="relative w-2.5 h-2.5 rounded-full"
          style={{
            background: useTransform(smoothActive, (a) =>
              Math.abs(a - i) < 0.6 ? "hsl(43 55% 55%)" : "hsl(43 55% 55% / 0.2)"
            ),
            boxShadow: useTransform(smoothActive, (a) =>
              Math.abs(a - i) < 0.6
                ? "0 0 12px hsl(43 55% 55% / 0.5)"
                : "none"
            ),
            scale: useTransform(smoothActive, (a) =>
              Math.abs(a - i) < 0.6 ? 1.4 : 1
            ),
          }}
        />
      ))}
    </div>
  );
};

const Services3DScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="services" ref={containerRef} className="relative" style={{ height: `${(SERVICES.length + 1) * 100}vh` }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden" style={{ perspective: "1200px" }}>
        {/* Background decorative */}
        <div
          className="absolute top-40 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
          style={{
            background:
              "radial-gradient(circle, hsl(43 55% 55% / 0.06) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute bottom-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-20"
          style={{
            background:
              "radial-gradient(circle, hsl(43 55% 55% / 0.08) 0%, transparent 60%)",
          }}
        />

        {/* Section header — fades out as scroll begins */}
        <motion.div
          className="absolute top-16 left-6 md:left-12 z-20"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]),
            y: useTransform(scrollYProgress, [0, 0.1], [0, -40]),
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-12 h-[1.5px]"
              style={{
                background:
                  "linear-gradient(to right, hsl(43 55% 55%), transparent)",
              }}
            />
            <span
              className="font-mono text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "hsl(43 55% 55%)" }}
            >
              Services
            </span>
          </div>
          <h2 className="font-clash text-4xl md:text-5xl lg:text-[3.5rem] font-black text-foreground leading-[0.95]">
            Ce qu'on fait
            <br />
            <span
              style={{
                color: "hsl(43 55% 55%)",
                textShadow: "0 0 40px hsl(43 55% 55% / 0.2)",
              }}
            >
              pour vous
            </span>
          </h2>
        </motion.div>

        {/* 3D Card layers */}
        {SERVICES.map((svc, i) => (
          <CardLayer
            key={svc.title}
            svc={svc}
            index={i}
            total={SERVICES.length}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* Progress dots */}
        <ProgressDots total={SERVICES.length} scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
};

export default Services3DScroll;
