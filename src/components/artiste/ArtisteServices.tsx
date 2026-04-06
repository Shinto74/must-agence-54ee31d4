import { Camera, Rocket, Megaphone, MessageSquare, Handshake } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const PILLARS = [
  {
    number: "01",
    icon: Camera,
    title: "Création Visuelle",
    description: "Chaque image raconte votre histoire. On produit des visuels qui s'imposent dans le feed et marquent les esprits.",
    items: [
      "Pochettes d'album & EP",
      "Clips & vidéos virales",
      "Visuels Instagram / TikTok",
      "Showreel & portfolio vidéo",
    ],
    size: "large", // col-span-2
  },
  {
    number: "02",
    icon: Rocket,
    title: "Stratégie de Lancement",
    description: "Chaque sortie est un événement. On planifie chaque détail pour que votre release crée l'impact maximal.",
    items: [
      "Planification singles / albums / EPs",
      "Timing & roadmap de sortie",
      "Coordination multi-plateformes",
    ],
    size: "small",
  },
  {
    number: "03",
    icon: Megaphone,
    title: "Marketing & Influence",
    description: "Ads haute performance et relations presse pour amplifier votre portée à grande échelle.",
    items: [
      "Campagnes Meta, Google, TikTok, Snapchat",
      "YouTube Ads ciblées",
      "Relations Presse (Radios, Blogs, Médias)",
      "SEO Musique",
    ],
    size: "small",
  },
  {
    number: "04",
    icon: MessageSquare,
    title: "Community & Storytelling",
    description: "Construire une image iconique, raconter une histoire authentique sur le long terme.",
    items: [
      "Brand Content & Narratif d'artiste",
      "Community Management dédié",
      "Gestion engagement social media",
      "Content design & visuels de résultats",
    ],
    size: "large", // col-span-2
  },
  {
    number: "05",
    icon: Handshake,
    title: "Booking & Partenariats",
    description: "On connecte les artistes aux marques et aux opportunités qui font la différence.",
    items: [
      "Mise en relation marques / collaborations",
      "Opportunités business",
      "Partnerships stratégiques",
    ],
    size: "full",
  },
];

const ArtisteServices = () => {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="py-24 px-6 relative overflow-hidden bg-[#070707]">

      {/* Fond atmosphérique vert */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          background: "radial-gradient(ellipse 55% 40% at 80% 20%, hsla(73,100%,50%,0.05) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          background: "radial-gradient(ellipse 40% 35% at 10% 80%, hsla(73,100%,50%,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* ── Header ── */}
        <div className="mb-16">
          <div className="rv flex items-center gap-3 mb-4">
            <div className="w-5 h-px bg-primary" />
            <p className="font-mono text-[10px] uppercase tracking-[.5em] text-primary">
              Pôle Artiste
            </p>
          </div>

          <h2 className="rv font-clash font-black text-foreground mb-4"
            style={{ fontSize: "clamp(2.2rem, 4vw, 4.5rem)", lineHeight: 1, letterSpacing: "-0.02em" }}>
            Tout ce qu'on fait pour{" "}
            <span
              style={{
                color: "transparent",
                WebkitTextStroke: "1.5px hsl(73 100% 50%)",
              }}
            >
              vos carrières.
            </span>
          </h2>

          <p className="rv font-outfit text-foreground/50 leading-relaxed mt-5"
            style={{ fontSize: "16px", maxWidth: "520px" }}>
            Du concept au succès, on pilote chaque étape de votre projet.
            Un accompagnement clé en main, un seul interlocuteur.
          </p>
        </div>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Row 1 : Card large (01) + Card small (02) */}
          {/* Card 01 — Création Visuelle (col-span-2) */}
          <div className="rv md:col-span-2 group relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 overflow-hidden
            transition-all duration-500 hover:border-primary/25 hover:bg-white/[0.035]">
            {/* Halo hover interne */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 50% at 20% 80%, hsla(73,100%,50%,0.06) 0%, transparent 65%)" }} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-primary" />
                </div>
                <span className="font-mono text-[9px] tracking-[.5em] uppercase text-white/20">
                  {PILLARS[0].number}
                </span>
              </div>

              <h3 className="font-clash font-bold text-foreground mb-3"
                style={{ fontSize: "clamp(1.3rem, 2vw, 1.7rem)" }}>
                {PILLARS[0].title}
              </h3>
              <p className="font-outfit text-white/45 text-sm leading-relaxed mb-6 max-w-md">
                {PILLARS[0].description}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {PILLARS[0].items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    <span className="font-mono text-[10px] text-white/50 tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 02 — Stratégie de Lancement (col-span-1) */}
          <div className="rv group relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 overflow-hidden
            transition-all duration-500 hover:border-primary/25 hover:bg-white/[0.035]">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 50% at 50% 80%, hsla(73,100%,50%,0.06) 0%, transparent 65%)" }} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-primary" />
                </div>
                <span className="font-mono text-[9px] tracking-[.5em] uppercase text-white/20">
                  {PILLARS[1].number}
                </span>
              </div>

              <h3 className="font-clash font-bold text-foreground mb-3"
                style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)" }}>
                {PILLARS[1].title}
              </h3>
              <p className="font-outfit text-white/45 text-sm leading-relaxed mb-6">
                {PILLARS[1].description}
              </p>

              <div className="space-y-2">
                {PILLARS[1].items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    <span className="font-mono text-[10px] text-white/50 tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2 : Card small (03) + Card large (04) */}
          {/* Card 03 — Marketing & Influence (col-span-1) */}
          <div className="rv group relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 overflow-hidden
            transition-all duration-500 hover:border-primary/25 hover:bg-white/[0.035]">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 50% at 50% 20%, hsla(73,100%,50%,0.06) 0%, transparent 65%)" }} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-primary" />
                </div>
                <span className="font-mono text-[9px] tracking-[.5em] uppercase text-white/20">
                  {PILLARS[2].number}
                </span>
              </div>

              <h3 className="font-clash font-bold text-foreground mb-3"
                style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)" }}>
                {PILLARS[2].title}
              </h3>
              <p className="font-outfit text-white/45 text-sm leading-relaxed mb-6">
                {PILLARS[2].description}
              </p>

              <div className="space-y-2">
                {PILLARS[2].items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    <span className="font-mono text-[10px] text-white/50 tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 04 — Community & Storytelling (col-span-2) */}
          <div className="rv md:col-span-2 group relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 overflow-hidden
            transition-all duration-500 hover:border-primary/25 hover:bg-white/[0.035]">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 50% at 80% 20%, hsla(73,100%,50%,0.06) 0%, transparent 65%)" }} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <span className="font-mono text-[9px] tracking-[.5em] uppercase text-white/20">
                  {PILLARS[3].number}
                </span>
              </div>

              <h3 className="font-clash font-bold text-foreground mb-3"
                style={{ fontSize: "clamp(1.3rem, 2vw, 1.7rem)" }}>
                {PILLARS[3].title}
              </h3>
              <p className="font-outfit text-white/45 text-sm leading-relaxed mb-6 max-w-md">
                {PILLARS[3].description}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {PILLARS[3].items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    <span className="font-mono text-[10px] text-white/50 tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3 : Card 05 — Booking (full width) */}
          <div className="rv md:col-span-3 group relative rounded-2xl overflow-hidden
            transition-all duration-500 cursor-pointer"
            style={{ border: "1px solid hsla(73,100%,50%,0.15)" }}>

            {/* Fond subtil neon */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(135deg, hsla(73,100%,50%,0.04) 0%, transparent 60%)" }} />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: "linear-gradient(135deg, hsla(73,100%,50%,0.08) 0%, transparent 55%)" }} />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 p-8 md:p-10">

              {/* Icône + numéro */}
              <div className="flex-shrink-0 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <Handshake className="w-6 h-6 text-primary" />
                </div>
                <span className="font-mono text-[9px] tracking-[.5em] uppercase text-primary/50">
                  {PILLARS[4].number}
                </span>
              </div>

              {/* Texte */}
              <div className="flex-1 min-w-0">
                <h3 className="font-clash font-bold text-foreground mb-2"
                  style={{ fontSize: "clamp(1.3rem, 2vw, 1.8rem)" }}>
                  {PILLARS[4].title}
                </h3>
                <p className="font-outfit text-white/45 text-sm leading-relaxed">
                  {PILLARS[4].description}
                </p>
              </div>

              {/* Items en ligne */}
              <div className="flex flex-wrap gap-2 md:flex-shrink-0">
                {PILLARS[4].items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-full border text-[10px] font-mono tracking-wide text-primary/70"
                    style={{ borderColor: "hsla(73,100%,50%,0.2)", background: "hsla(73,100%,50%,0.05)" }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── CTA ── */}
        <div className="rv mt-14 flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#packs"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-clash font-semibold text-sm
              text-background bg-primary transition-all duration-300 hover:brightness-110 hover:scale-[1.02]"
          >
            Voir les packs artistes
            <span className="text-xs">→</span>
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.3em] text-white/40
              hover:text-primary transition-colors duration-300"
          >
            <span className="w-6 h-px bg-current" />
            En savoir plus
          </a>
        </div>

      </div>
    </section>
  );
};

export default ArtisteServices;
