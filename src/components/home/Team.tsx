import { useRef, useEffect, useState } from "react";

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
  {
    name: "Alexandre Martin",
    initials: "AM",
    role: "Creative Director",
    description: "Architecte de la vision, gardien de l'âme créative de chaque projet.",
  },
  {
    name: "Sofia Benali",
    initials: "SB",
    role: "Stratège Digital",
    description: "Elle transforme les données brutes en stratégies qui marquent durablement.",
  },
  {
    name: "Karim Daoudi",
    initials: "KD",
    role: "Head of Production",
    description: "Le maestro derrière chaque contenu qui performe et qui émeut.",
  },
  {
    name: "Léa Rousseau",
    initials: "LR",
    role: "Brand Designer",
    description: "Elle habille les marques d'identités visuelles inoubliables.",
  },
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

const V4Split = ({ data, label }: { data: TeamMember[]; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const i = useScrollIndex(ref, data.length);
  const m = data[i];
  const img = m.image_url || IMAGES[i % IMAGES.length];

  return (
    <div ref={ref} style={{ height: `${data.length * 100}vh` }}>
      {/* Label */}
      <div className="py-3 px-8 bg-surface border-t border-border/30 flex items-center gap-4 sticky top-0 z-50">
        <span className="font-clash text-sm font-bold text-foreground">{label}</span>
      </div>

      {/* Sticky container with flip animation */}
      <div
        key={`team-${i}`}
        className="sticky overflow-hidden bg-background"
        style={{
          top: "4vh",
          height: "88vh",
          animation: "sectionFlip 400ms cubic-bezier(.16,1,.3,1) both",
        }}
      >
        {/* Center vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/20 z-10" />

        <div className="flex h-full">
          {/* Left: Editorial text */}
          <div className="w-1/2 h-full flex flex-col justify-center items-start pl-20 pr-10 relative overflow-hidden">
            {/* Atmospheric neon halo */}
            <div
              className="absolute pointer-events-none inset-0"
              style={{
                background: "radial-gradient(ellipse 70% 60% at 20% 80%, hsl(var(--neon) / 0.10) 0%, hsl(var(--neon) / 0.03) 45%, transparent 70%)",
              }}
            />
            <div
              className="absolute pointer-events-none inset-0"
              style={{
                background: "radial-gradient(ellipse 45% 40% at 55% 30%, hsl(var(--neon) / 0.05) 0%, transparent 65%)",
              }}
            />

            <div className="relative z-10 w-full">
              {/* Name - editorial: first name white / last name neon stroke */}
              <div className="mb-6">
                <h2
                  className="font-clash font-black text-foreground block"
                  style={{ fontSize: "clamp(2.8rem, 4.6vw, 6rem)", lineHeight: 0.9, letterSpacing: "-0.025em" }}
                >
                  {m.name.split(" ")[0]}
                </h2>
                {m.name.split(" ")[1] && (
                  <h2
                    className="font-clash font-black block"
                    style={{
                      fontSize: "clamp(2.8rem, 4.6vw, 6rem)",
                      lineHeight: 0.9,
                      letterSpacing: "-0.025em",
                      color: "transparent",
                      WebkitTextStroke: "1.5px hsl(var(--neon))",
                    }}
                  >
                    {m.name.split(" ")[1]}
                  </h2>
                )}
              </div>

              {/* Role with accent line */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-6 h-px bg-primary" />
                <p className="font-mono text-[9px] tracking-[.5em] uppercase text-primary font-medium">
                  {m.role}
                </p>
              </div>

              {/* Separator */}
              <div className="w-full h-px mb-8 bg-gradient-to-r from-border/30 to-transparent" />

              {/* Editorial quote */}
              <p
                className="font-outfit italic text-foreground/55 leading-[1.9] mb-10"
                style={{ fontSize: "15px", maxWidth: "320px" }}
              >
                &ldquo;{m.description}&rdquo;
              </p>

              {/* Progress bar */}
              <div className="flex items-center gap-2 mb-8">
                {data.map((_, idx) => (
                  <div
                    key={idx}
                    className="h-[2px] rounded-full transition-all duration-700"
                    style={{
                      width: idx === i ? 40 : 8,
                      background: idx === i ? "hsl(var(--neon))" : "hsl(var(--border))",
                    }}
                  />
                ))}
              </div>

              <p className="font-mono text-[7px] tracking-[.6em] uppercase text-muted-foreground/40">
                SCROLL ↓
              </p>
            </div>
          </div>

          {/* Right: Portrait */}
          <div className="w-1/2 h-full relative overflow-hidden flex items-center justify-center">
            <div className="relative flex-shrink-0" style={{ width: "380px", height: "520px" }}>
              <img
                src={img}
                alt={m.name}
                className="absolute inset-0 w-full h-full object-cover object-top"
                style={{
                  filter: "grayscale(100%) contrast(1.2) brightness(0.8)",
                }}
              />
              {/* Fade edges into background */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, hsl(var(--background)) 0%, transparent 20%)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(var(--background)) 0%, transparent 40%)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 20%)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to left, hsl(var(--background) / 0.4) 0%, transparent 25%)" }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sectionFlip {
          from {
            opacity: 0;
            transform: perspective(900px) rotateX(-35deg) translateY(80px);
          }
          to {
            opacity: 1;
            transform: perspective(900px) rotateX(0deg) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const Team = ({ members }: TeamProps) => {
  const data = members && members.length > 0 ? members : FALLBACK;

  return (
    <div>
      <V4Split data={data} label="L'équipe" />
    </div>
  );
};

export default Team;
