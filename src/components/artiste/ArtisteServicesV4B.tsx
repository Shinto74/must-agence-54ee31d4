import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import * as Icons from "lucide-react";
import { useArtistPillars } from "@/hooks/useArtistePage";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { useIsMobile } from "@/hooks/use-mobile";

// ── Helpers ──────────────────────────────────────────────────────────────────
const pad2 = (n: number) => String(n + 1).padStart(2, "0");
const getIcon = (name: string): any => (Icons as any)[name] || Icons.Zap;

interface PillarRow {
  id: string;
  display_order: number;
  icon: string;
  left_title: string;
  statement: string;
  right_title: string;
  description: string;
  accent_hue: number;
  leftItems: string[];
  rightItems: string[];
}

// Couleurs dérivées de accent_hue
const colorsFromHue = (h: number) => ({
  haloColor: `hsla(${h},80%,55%,0.08)`,
  accentGlow: `hsla(${h},90%,60%,0.4)`,
  bg: `radial-gradient(ellipse 70% 60% at 50% 50%, hsla(${h},70%,8%,0.6) 0%, transparent 70%)`,
});

// ── Hook scroll index (basé sur la progression du wrapper, robuste) ─────────
function useScrollIndex(ref: React.RefObject<HTMLDivElement>, count: number) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setIndex(0);
        return;
      }
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const ratio = scrolled / total;
      const idx = Math.min(count - 1, Math.floor(ratio * count));
      setIndex(idx);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, count]);
  return index;
}

const panelVariants = {
  enter: { opacity: 0, y: 32, scale: 0.96, filter: "blur(6px)" },
  center: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: -32, scale: 0.96, filter: "blur(6px)", transition: { duration: 0.35, ease: [0.4, 0, 1, 1] as const } },
};

// ── Carte droite ─────────────────────────────────────────────────────────────
const InfoCard = ({ pillar, isActive, index }: { pillar: PillarRow; isActive: boolean; index: number }) => {
  const Icon = getIcon(pillar.icon);
  const { accentGlow, bg } = colorsFromHue(pillar.accent_hue);

  return (
    <div className="relative flex items-center justify-center flex-shrink-0 px-10 py-8" style={{ height: "100vh", width: "100%" }}>
      <motion.div
        animate={{ opacity: isActive ? 1 : 0.2, scale: isActive ? 1 : 0.94, y: isActive ? 0 : 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative rounded-2xl p-8 overflow-hidden"
        style={{
          background: isActive ? "hsla(0,0%,100%,0.04)" : "hsla(0,0%,100%,0.01)",
          border: isActive ? "1px solid hsla(73,100%,50%,0.25)" : "1px solid hsla(0,0%,100%,0.05)",
          boxShadow: isActive ? `0 0 50px hsla(73,100%,50%,0.08), 0 20px 60px -20px hsla(0,0%,0%,0.5)` : "none",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <motion.div animate={{ opacity: isActive ? 1 : 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 pointer-events-none" style={{ background: bg }} />
        <motion.div animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="absolute top-0 left-0 right-0 h-[2px] origin-left" style={{ background: "linear-gradient(to right, hsl(73 100% 50%), transparent)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-7">
            <motion.div
              animate={{ scale: isActive ? 1 : 0.85, rotate: isActive ? 0 : -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: isActive ? "hsla(73,100%,50%,0.15)" : "hsla(0,0%,100%,0.04)",
                border: isActive ? "1px solid hsla(73,100%,50%,0.35)" : "1px solid hsla(0,0%,100%,0.07)",
                boxShadow: isActive ? `0 0 20px ${accentGlow}` : "none",
                transition: "all 0.5s",
              }}
            >
              <Icon className="w-5 h-5" style={{ color: isActive ? "hsl(73 100% 50%)" : "hsla(0,0%,100%,0.25)", transition: "color 0.45s" }} />
            </motion.div>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: isActive ? "hsl(73 100% 50%)" : "hsla(0,0%,100%,0.2)", transition: "color 0.45s" }}>
              {pad2(index)}
            </span>
          </div>

          <h3 className="font-clash font-bold mb-3" style={{ fontSize: "clamp(1.3rem, 1.8vw, 1.7rem)", color: isActive ? "white" : "hsla(0,0%,100%,0.4)", transition: "color 0.45s" }}>
            {pillar.right_title}
          </h3>

          <p className="font-outfit leading-relaxed mb-6" style={{ fontSize: 14, color: isActive ? "hsla(0,0%,100%,0.55)" : "hsla(0,0%,100%,0.25)", transition: "color 0.45s" }}>
            {pillar.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {pillar.rightItems.map((item, j) => (
              <motion.span
                key={item + j}
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

// ── Composant principal ──────────────────────────────────────────────────────
const ArtisteServicesV4B = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const { data: pillars = [] } = useArtistPillars() as { data: PillarRow[] };
  const { get } = useSiteSettings();
  const isMobile = useIsMobile();

  const count = Math.max(pillars.length, 1);
  const activeIndex = useScrollIndex(wrapperRef, count);

  if (!pillars.length) return null;

  const activePillar = pillars[Math.min(activeIndex, pillars.length - 1)];
  const ActiveIcon = getIcon(activePillar.icon);
  const { haloColor, accentGlow } = colorsFromHue(activePillar.accent_hue);

  // Mobile : on garde la même mécanique de scroll-jack (sticky + cartes)

  return (
    <div ref={wrapperRef} style={{ height: `${pillars.length * 100}vh` }}>
      <div className="sticky top-0 overflow-hidden bg-background" style={{ height: "100vh" }}>
        {/* Header — placé au-dessus de la carte gauche, sans absolute pour éviter la superposition */}
        <div ref={headerRef} className="absolute top-0 left-0 w-1/2 z-20 px-14 pt-20 pb-10 hidden lg:block pointer-events-none" style={{ background: "linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--background)) 70%, transparent 100%)" }}>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">
            {get("artiste_services_kicker", "Services")}
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="font-clash font-black text-foreground" style={{ fontSize: "clamp(1.5rem, 2.4vw, 2.6rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {get("artiste_services_title_part1", "Notre expertise")}{" "}
            <span className="text-primary">{get("artiste_services_title_accent", "à votre service")}</span>
          </motion.h2>
        </div>

        <div className="flex h-full">
          {/* ── Panneau GAUCHE ────────────────────────────────── */}
          <div className="hidden lg:flex lg:w-1/2 h-full flex-col justify-center px-14 relative overflow-hidden" style={{ borderRight: "1px solid hsla(0,0%,100%,0.06)" }}>
            <AnimatePresence>
              <motion.div
                key={`halo-${activeIndex}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 80% 80% at 35% 65%, ${haloColor} 0%, transparent 65%)` }}
              />
            </AnimatePresence>

            <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            <div className="relative z-10 mt-48">
              <AnimatePresence mode="wait">
                <motion.div key={activeIndex} variants={panelVariants} initial="enter" animate="center" exit="exit">
                  <div className="font-clash font-black select-none leading-none mb-6" style={{ fontSize: "clamp(6rem, 11vw, 11rem)", color: "hsla(0,0%,100%,0.03)", letterSpacing: "-0.05em", lineHeight: 0.85 }}>
                    {pad2(activeIndex)}
                  </div>

                  <motion.div
                    initial={{ scale: 0.5, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: "hsla(73,100%,50%,0.12)", border: "1px solid hsla(73,100%,50%,0.3)", boxShadow: `0 0 30px ${accentGlow}` }}
                  >
                    <ActiveIcon className="w-6 h-6 text-primary" />
                  </motion.div>

                  <h3 className="font-clash font-bold text-foreground mb-3" style={{ fontSize: "clamp(1.8rem, 2.6vw, 2.6rem)", lineHeight: 1.1 }}>
                    {activePillar.left_title}
                  </h3>

                  <p className="font-outfit leading-relaxed mb-6" style={{ fontSize: 16, color: "hsla(0,0%,100%,0.55)", maxWidth: 400, fontStyle: "italic" }}>
                    {activePillar.statement}
                  </p>

                  <div className="space-y-3">
                    {activePillar.leftItems.map((item, j) => (
                      <motion.div key={item + j} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: j * 0.08 }} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" style={{ boxShadow: "0 0 8px hsl(73 100% 50% / 0.4)" }} />
                        <span className="font-mono text-[13px] text-foreground/70 tracking-wide">{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-10">
                    {pillars.map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ width: i === activeIndex ? 32 : 6, background: i === activeIndex ? "hsl(73 100% 50%)" : "hsla(0,0%,100%,0.15)" }}
                        transition={{ duration: 0.35 }}
                        className="h-1.5 rounded-full"
                        style={{ boxShadow: i === activeIndex ? "0 0 10px hsl(73 100% 50% / 0.3)" : "none" }}
                      />
                    ))}
                  </div>

                  <div className="mt-8">
                    <span className="font-mono text-[10px] uppercase tracking-[.35em] text-muted-foreground/50">
                      {activeIndex + 1} / {pillars.length}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Panneau DROIT ──────────────────────────────── */}
          <div className="w-full lg:w-1/2 h-full relative">
            <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, hsl(var(--background)), transparent)" }} />
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10" style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }} />

            <div className="absolute top-1/2 right-5 -translate-y-1/2 z-20 flex flex-col items-center gap-2.5">
              {pillars.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: i === activeIndex ? 24 : 4, background: i === activeIndex ? "hsl(73 100% 50%)" : "hsla(0,0%,100%,0.12)" }}
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
                style={{ height: `${pillars.length * 100}vh` }}
              >
                {pillars.map((pillar, i) => (
                  <InfoCard key={pillar.id} pillar={pillar} isActive={activeIndex === i} index={i} />
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {activeIndex < pillars.length - 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center gap-1">
            <span className="font-mono text-[7px] uppercase tracking-[.5em] text-muted-foreground/40">scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-px h-6 bg-primary/30" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ArtisteServicesV4B;
