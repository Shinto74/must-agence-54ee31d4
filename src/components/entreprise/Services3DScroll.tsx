import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Sparkles } from "lucide-react";
import svcSectionBg from "@/assets/svc-section-bg.jpg";
import { useServicesEntreprise, useSiteSettings } from "@/hooks/useSiteContent";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* Resolve a Lucide icon by name (e.g. "Megaphone"), or render an emoji/text fallback. */
const ServiceIcon = ({ icon }: { icon?: string }) => {
  if (!icon) return <Sparkles size={28} />;
  const trimmed = icon.trim();
  // Try to resolve as a Lucide component
  const Comp = (LucideIcons as any)[trimmed];
  if (Comp && typeof Comp === "function") {
    return <Comp size={28} />;
  }
  // Otherwise render as emoji / short text
  return (
    <span className="text-2xl leading-none" aria-hidden>
      {trimmed}
    </span>
  );
};

const Services3DScroll = () => {
  const { data: dbServices = [] } = useServicesEntreprise();
  const { get } = useSiteSettings();

  // Fallback minimal — only used while loading or if DB is empty
  const services = dbServices.length > 0 ? dbServices : [];

  const sectionKicker = get("entreprise_services_kicker", "Services");
  const sectionTitleLine1 = get("entreprise_services_title_line1", "Ce qu'on fait");
  const sectionTitleLine2 = get("entreprise_services_title_line2", "pour vous");

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollCooldown = useRef(false);

  // Reset active index if services change and active is out of range
  useEffect(() => {
    if (active >= services.length && services.length > 0) {
      setActive(0);
    }
  }, [services.length, active]);

  // Scroll-driven: each scroll event inside sticky section changes card
  useEffect(() => {
    const container = containerRef.current;
    if (!container || services.length === 0) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = container.getBoundingClientRect();
      const stickyEl = container.querySelector("[data-sticky]") as HTMLElement;
      if (!stickyEl) return;

      const stickyRect = stickyEl.getBoundingClientRect();
      const isStuck = stickyRect.top <= 5 && rect.bottom > window.innerHeight;

      if (!isStuck) return;
      if (scrollCooldown.current) {
        e.preventDefault();
        return;
      }

      const delta = e.deltaY;
      if (Math.abs(delta) < 15) return;

      if (delta > 0 && active < services.length - 1) {
        e.preventDefault();
        scrollCooldown.current = true;
        setDirection(1);
        setActive((prev) => Math.min(prev + 1, services.length - 1));
        setTimeout(() => { scrollCooldown.current = false; }, 800);
      } else if (delta < 0 && active > 0) {
        e.preventDefault();
        scrollCooldown.current = true;
        setDirection(-1);
        setActive((prev) => Math.max(prev - 1, 0));
        setTimeout(() => { scrollCooldown.current = false; }, 800);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [active, services.length]);

  const goTo = useCallback((idx: number) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  }, [active]);

  // If no services, render nothing (or a small notice during dev)
  if (services.length === 0) {
    return null;
  }

  const svc = services[active] || services[0];
  const svcNumber = svc.number || String(active + 1).padStart(2, "0");

  const cardVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.85,
      rotateX: dir > 0 ? -12 : 12,
      filter: "blur(6px)",
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: EASE },
    },
    exit: (dir: number) => ({
      y: dir > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.85,
      rotateX: dir > 0 ? 12 : -12,
      filter: "blur(6px)",
      transition: { duration: 0.5, ease: EASE },
    }),
  };

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative z-[1]"
      style={{ height: `${(services.length + 1) * 100}vh` }}
    >
      <div
        data-sticky
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        {/* Dark background */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, #0e0e0e 0%, #131210 30%, #151311 50%, #131210 70%, #0e0e0e 100%)",
        }} />

        {/* Background image */}
        <img
          src={svcSectionBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          loading="lazy"
          style={{ filter: "blur(6px) saturate(0.4) brightness(0.3)", opacity: 0.5 }}
        />

        {/* Warm glows */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 30%, hsl(43 40% 50% / 0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 70%, hsl(43 52% 39% / 0.04) 0%, transparent 55%)",
        }} />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }} />

        {/* Grain */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }} />

        {/* Top/bottom fades */}
        <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10" style={{
          background: "linear-gradient(to bottom, #FAF9F6, transparent)",
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10" style={{
          background: "linear-gradient(to top, #FAF9F6, transparent)",
        }} />

        {/* Section title */}
        <div className="absolute top-16 left-6 md:left-12 z-20">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-[1.5px]" style={{ background: "linear-gradient(to right, hsl(43 55% 55%), transparent)" }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: "hsl(43 55% 55%)" }}>
              {sectionKicker}
            </span>
          </div>
          <h2 className="font-clash text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[0.95] text-white">
            {sectionTitleLine1}
            <br />
            <span style={{ color: "hsl(43 55% 55%)", textShadow: "0 0 40px hsl(43 55% 55% / 0.3)" }}>
              {sectionTitleLine2}
            </span>
          </h2>
        </div>

        {/* Card */}
        <div className="relative z-20 w-full flex items-center justify-center" style={{ minHeight: 420 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative w-[min(88vw,780px)]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="relative overflow-hidden rounded-[1.5rem] p-8 md:p-10 lg:p-12"
                style={{
                  background: "linear-gradient(155deg, hsl(0 0% 100%) 0%, hsl(40 20% 97%) 40%, hsl(40 15% 95%) 100%)",
                  border: "1.5px solid hsl(43 55% 55% / 0.35)",
                  boxShadow: "0 30px 80px -20px rgba(0,0,0,0.4), 0 0 60px hsl(43 55% 55% / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.7)",
                }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
                  background: "linear-gradient(90deg, transparent 5%, hsl(43 55% 55% / 0.6) 50%, transparent 95%)",
                }} />

                {/* Card bg image */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[1.5rem]">
                  <img
                    src={svc.bgImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: "blur(14px) saturate(0.4) brightness(1.2)", opacity: 0.15, transform: "scale(1.15)" }}
                  />
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(155deg, hsl(0 0% 100% / 0.7) 0%, hsl(40 20% 97% / 0.6) 50%, hsl(0 0% 100% / 0.7) 100%)",
                  }} />
                </div>

                {/* Grain */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-[1.5rem]" style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }} />

                {/* Content */}
                <div className="relative z-10 flex flex-col gap-6 md:flex-row md:gap-8">
                  <div className="flex shrink-0 items-center gap-4 md:flex-col md:items-start md:gap-3">
                    <motion.div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
                      style={{
                        background: "linear-gradient(135deg, hsl(43 52% 39%), hsl(43 55% 55%))",
                        border: "1.5px solid hsl(43 55% 55% / 0.6)",
                        color: "hsl(0 0% 100%)",
                        boxShadow: "0 14px 42px hsl(43 52% 39% / 0.3), 0 0 30px hsl(43 55% 55% / 0.2)",
                      }}
                    >
                      <ServiceIcon icon={svc.icon} />
                    </motion.div>
                    <motion.span
                      className="font-clash text-3xl font-black md:text-4xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
                      style={{ color: "hsl(43 55% 55%)", textShadow: "0 0 40px hsl(43 55% 55% / 0.35)" }}
                    >
                      {svcNumber}
                    </motion.span>
                  </div>

                  <div className="flex-1">
                    <motion.h3
                      className="mb-3 font-clash text-xl font-black md:text-2xl"
                      style={{ color: "hsl(0 0% 10%)" }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
                    >
                      {svc.title}
                    </motion.h3>
                    <motion.p
                      className="mb-6 text-sm leading-relaxed md:text-[15px]"
                      style={{ color: "hsl(0 0% 30%)" }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
                    >
                      {svc.description}
                    </motion.p>
                    <motion.div
                      className="flex flex-wrap gap-2.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45, duration: 0.5 }}
                    >
                      {(svc.chips || []).map((chip: string, ci: number) => (
                        <motion.span
                          key={`${chip}-${ci}`}
                          className="rounded-xl px-4 py-2 text-[11px] font-mono font-medium"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + ci * 0.06, duration: 0.4, ease: EASE }}
                          style={{
                            background: "hsl(43 55% 55% / 0.1)",
                            border: "1px solid hsl(43 55% 55% / 0.2)",
                            color: "hsl(0 0% 25%)",
                          }}
                        >
                          {chip}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                </div>

                {/* Decorative orbs */}
                <div className="absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, hsl(43 55% 55% / 0.1) 0%, transparent 72%)" }}
                />
                <div className="absolute -bottom-16 -left-16 h-[200px] w-[200px] rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, hsl(43 52% 39% / 0.06) 0%, transparent 70%)" }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots — RIGHT side */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
          {services.map((s: any, i: number) => (
            <button
              key={s.id || i}
              onClick={() => goTo(i)}
              className="group flex items-center gap-3"
              aria-label={`Service ${s.number || i + 1}`}
            >
              <motion.div
                className="w-3 h-3 rounded-full"
                animate={{
                  background: i === active ? "hsl(43 55% 55%)" : "hsl(43 55% 55% / 0.2)",
                  boxShadow: i === active ? "0 0 14px hsl(43 55% 55% / 0.5)" : "0 0 0px transparent",
                  scale: i === active ? 1.4 : 1,
                }}
                transition={{ duration: 0.4, ease: EASE }}
              />
              <AnimatePresence>
                {i === active && (
                  <motion.span
                    className="font-mono text-[9px] uppercase tracking-[0.15em] whitespace-nowrap hidden md:block"
                    style={{ color: "hsl(43 55% 55%)" }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    {s.number || String(i + 1).padStart(2, "0")}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services3DScroll;
