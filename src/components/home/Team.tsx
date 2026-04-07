import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  name: string;
  initials: string;
  role: string;
  description: string;
  image_url?: string | null;
}

interface TeamProps {
  members?: TeamMember[];
}

const IMAGES = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&h=1600&fit=crop&q=90",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1200&h=1600&fit=crop&q=90",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&h=1600&fit=crop&q=90",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&h=1600&fit=crop&q=90",
];

const FALLBACK: TeamMember[] = [
  { name: "Alexandre Martin", initials: "AM", role: "Creative Director", description: "Architecte de la vision, gardien de l'âme créative de chaque projet." },
  { name: "Sofia Benali", initials: "SB", role: "Stratège Digital", description: "Elle transforme les données brutes en stratégies qui marquent durablement." },
  { name: "Karim Daoudi", initials: "KD", role: "Head of Production", description: "Le maestro derrière chaque contenu qui performe et qui émeut." },
  { name: "Léa Rousseau", initials: "LR", role: "Brand Designer", description: "Elle habille les marques d'identités visuelles inoubliables." },
];

const Team = ({ members }: TeamProps) => {
  const data = members && members.length > 0 ? members : FALLBACK;
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const { top } = el.getBoundingClientRect();
      const scrolled = -top;
      const idx = Math.max(0, Math.min(data.length - 1, Math.floor(scrolled / window.innerHeight)));
      setActiveIndex(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [data.length]);

  const m = data[activeIndex];
  const img = m.image_url || IMAGES[activeIndex % IMAGES.length];

  return (
    <div ref={containerRef} style={{ height: `${data.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-background">

        {/* Background image — full screen */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
          >
            <img
              src={img}
              alt={m.name}
              className="w-full h-full object-cover object-top"
              style={{ filter: "grayscale(1) contrast(1.1) brightness(0.35)" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlays */}
        <div className="absolute inset-0 z-[1]" style={{
          background: `
            linear-gradient(to right, hsl(var(--background)) 0%, hsla(0,0%,4%,0.6) 50%, hsl(var(--background)) 100%),
            linear-gradient(to top, hsl(var(--background)) 0%, transparent 40%),
            linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 30%)
          `,
        }} />

        {/* Neon ambient glow */}
        <div className="absolute inset-0 z-[2] pointer-events-none" style={{
          background: "radial-gradient(ellipse 40% 50% at 50% 60%, hsl(73 100% 50% / 0.04) 0%, transparent 70%)",
        }} />

        {/* Section label */}
        <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{
            background: "hsl(73 100% 50%)",
            boxShadow: "0 0 8px hsl(73 100% 50% / 0.5)",
          }} />
          <span className="font-mono text-[9px] tracking-[.4em] uppercase" style={{ color: "hsl(73 100% 50% / 0.6)" }}>
            L'équipe
          </span>
        </div>

        {/* Counter top right */}
        <div className="absolute top-8 right-8 z-20">
          <span className="font-mono text-[11px] tracking-[.3em]" style={{ color: "hsla(0,0%,100%,0.2)" }}>
            {String(activeIndex + 1).padStart(2, "0")} / {String(data.length).padStart(2, "0")}
          </span>
        </div>

        {/* Content — centered overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-3xl"
            >
              {/* Name — big overlay */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-clash font-black text-foreground leading-[0.85] mb-4"
                style={{
                  fontSize: "clamp(3.5rem, 10vw, 9rem)",
                  letterSpacing: "-0.04em",
                  textShadow: "0 4px 40px hsla(0,0%,0%,0.5)",
                }}
              >
                {m.name.split(" ")[0]}
                <br />
                <span style={{
                  color: "transparent",
                  WebkitTextStroke: "2px hsl(73 100% 50%)",
                  filter: "drop-shadow(0 0 20px hsl(73 100% 50% / 0.2))",
                }}>
                  {m.name.split(" ").slice(1).join(" ") || m.initials}
                </span>
              </motion.h2>

              {/* Role */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex items-center justify-center gap-3 mb-6"
              >
                <div className="w-8 h-px" style={{ background: "hsl(73 100% 50% / 0.5)" }} />
                <p className="font-mono text-[10px] tracking-[.35em] uppercase font-semibold" style={{ color: "hsl(73 100% 50%)" }}>
                  {m.role}
                </p>
                <div className="w-8 h-px" style={{ background: "hsl(73 100% 50% / 0.5)" }} />
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="font-outfit italic leading-[1.8] mx-auto"
                style={{
                  color: "hsla(0,0%,100%,0.5)",
                  fontSize: "15px",
                  maxWidth: "420px",
                }}
              >
                &ldquo;{m.description}&rdquo;
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots — bottom center */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              {data.map((_, idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    width: idx === activeIndex ? 32 : 6,
                    background: idx === activeIndex ? "hsl(73 100% 50%)" : "hsla(0,0%,100%,0.15)",
                  }}
                  transition={{ duration: 0.35 }}
                  className="h-[2px] rounded-full"
                  style={{ boxShadow: idx === activeIndex ? "0 0 10px hsl(73 100% 50% / 0.4)" : "none" }}
                />
              ))}
            </div>
            <span className="font-mono text-[7px] tracking-[.5em] uppercase" style={{ color: "hsla(0,0%,100%,0.2)" }}>
              scroll ↓
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
