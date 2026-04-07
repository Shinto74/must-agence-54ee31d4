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
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&h=1200&fit=crop&q=90",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&h=1200&fit=crop&q=90",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&h=1200&fit=crop&q=90",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&h=1200&fit=crop&q=90",
];

const FALLBACK: TeamMember[] = [
  { name: "Alexandre Martin", initials: "AM", role: "Creative Director", description: "Architecte de la vision, gardien de l'âme créative de chaque projet." },
  { name: "Sofia Benali", initials: "SB", role: "Stratège Digital", description: "Elle transforme les données brutes en stratégies qui marquent durablement." },
  { name: "Karim Daoudi", initials: "KD", role: "Head of Production", description: "Le maestro derrière chaque contenu qui performe et qui émeut." },
  { name: "Léa Rousseau", initials: "LR", role: "Brand Designer", description: "Elle habille les marques d'identités visuelles inoubliables." },
];

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

const contentVariants = {
  enter: { opacity: 0, y: 40 },
  center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, staggerChildren: 0.08 } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
};

const childVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: -15 },
};

const imageVariants = {
  enter: { opacity: 0, scale: 1.08, filter: "grayscale(100%) brightness(0.4)" },
  center: { opacity: 1, scale: 1, filter: "grayscale(100%) contrast(1.15) brightness(0.85)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
};

const V4Split = ({ data, label }: { data: TeamMember[]; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const i = useScrollIndex(ref, data.length);
  const m = data[i];
  const img = m.image_url || IMAGES[i % IMAGES.length];

  const firstName = m.name.split(" ")[0];
  const lastName = m.name.split(" ").slice(1).join(" ");

  return (
    <div ref={ref} style={{ height: `${data.length * 100}vh` }}>
      <div className="sticky top-0 overflow-hidden bg-background" style={{ height: "100vh" }}>

        {/* Section label */}
        <div className="absolute top-0 left-0 right-0 z-30 px-8 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary" style={{ boxShadow: "0 0 8px hsl(73 100% 50% / 0.5)" }} />
            <span className="font-mono text-[9px] tracking-[.4em] uppercase text-primary/70">{label}</span>
          </div>
        </div>

        <div className="flex h-full">
          {/* LEFT — Text editorial */}
          <div className="w-1/2 h-full flex flex-col justify-center pl-16 lg:pl-20 pr-10 relative overflow-hidden">
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 50% at 15% 75%, hsl(73 100% 50% / 0.07) 0%, transparent 65%)" }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative z-10"
              >
                {/* Name */}
                <motion.div variants={childVariants} className="mb-5">
                  <h2
                    className="font-clash font-black text-foreground"
                    style={{ fontSize: "clamp(3rem, 5vw, 6.5rem)", lineHeight: 0.9, letterSpacing: "-0.03em" }}
                  >
                    {firstName}
                  </h2>
                  {lastName && (
                    <h2
                      className="font-clash font-black"
                      style={{
                        fontSize: "clamp(3rem, 5vw, 6.5rem)",
                        lineHeight: 0.9,
                        letterSpacing: "-0.03em",
                        color: "transparent",
                        WebkitTextStroke: "1.5px hsl(73 100% 50%)",
                      }}
                    >
                      {lastName}
                    </h2>
                  )}
                </motion.div>

                {/* Role */}
                <motion.div variants={childVariants} className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-px bg-primary" />
                  <p className="font-mono text-[10px] tracking-[.4em] uppercase text-primary font-semibold">
                    {m.role}
                  </p>
                </motion.div>

                {/* Separator */}
                <motion.div variants={childVariants} className="w-full h-px mb-8 bg-gradient-to-r from-border/40 to-transparent" />

                {/* Description */}
                <motion.p
                  variants={childVariants}
                  className="font-outfit italic text-foreground/50 leading-[1.8] mb-10"
                  style={{ fontSize: 15, maxWidth: 340 }}
                >
                  &ldquo;{m.description}&rdquo;
                </motion.p>

                {/* Progress */}
                <motion.div variants={childVariants} className="flex items-center gap-2 mb-4">
                  {data.map((_, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        width: idx === i ? 36 : 6,
                        background: idx === i ? "hsl(73 100% 50%)" : "hsla(0,0%,100%,0.12)",
                      }}
                      transition={{ duration: 0.35 }}
                      className="h-[2px] rounded-full"
                      style={{ boxShadow: idx === i ? "0 0 8px hsl(73 100% 50% / 0.3)" : "none" }}
                    />
                  ))}
                </motion.div>

                <motion.p variants={childVariants} className="font-mono text-[7px] tracking-[.6em] uppercase text-muted-foreground/30">
                  scroll ↓
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT — Portrait */}
          <div className="w-1/2 h-full relative overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative"
                style={{ width: "min(420px, 85%)", height: "min(580px, 80vh)" }}
              >
                <img
                  src={img}
                  alt={m.name}
                  className="absolute inset-0 w-full h-full object-cover object-top rounded-sm"
                />
                {/* Edge fades */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, hsl(var(--background)) 0%, transparent 25%)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(var(--background)) 0%, transparent 35%)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 15%)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to left, hsl(var(--background) / 0.3) 0%, transparent 20%)" }} />

                {/* Neon accent bottom line */}
                <div
                  className="absolute bottom-0 left-[15%] right-[15%] h-[1px]"
                  style={{ background: "linear-gradient(to right, transparent, hsl(73 100% 50% / 0.3), transparent)" }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Member counter */}
            <div className="absolute bottom-8 right-8 z-10">
              <span className="font-mono text-[10px] tracking-[.3em] text-muted-foreground/30">
                {String(i + 1).padStart(2, "0")} / {String(data.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Team = ({ members }: TeamProps) => {
  const data = members && members.length > 0 ? members : FALLBACK;
  return <V4Split data={data} label="L'équipe" />;
};

export default Team;
