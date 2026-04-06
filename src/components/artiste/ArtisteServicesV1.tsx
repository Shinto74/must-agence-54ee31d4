import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, Rocket, Megaphone, MessageSquare, Handshake } from "lucide-react";

const PILLARS = [
  {
    number: "01",
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
    colSpan: "md:col-span-2",
  },
  {
    number: "02",
    icon: Rocket,
    title: "Stratégie de Lancement",
    description:
      "Chaque sortie est un événement. On planifie chaque détail pour que votre release crée l'impact maximal.",
    items: [
      "Planification singles / albums / EPs",
      "Timing & roadmap de sortie",
      "Coordination multi-plateformes",
    ],
    colSpan: "md:col-span-1",
  },
  {
    number: "03",
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
    colSpan: "md:col-span-1",
  },
  {
    number: "04",
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
    colSpan: "md:col-span-2",
  },
  {
    number: "05",
    icon: Handshake,
    title: "Booking & Partenariats",
    description:
      "On connecte les artistes aux marques et aux opportunités qui font la différence.",
    items: [
      "Mise en relation marques / collaborations",
      "Opportunités business",
      "Partnerships stratégiques",
    ],
    colSpan: "md:col-span-3",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      delay: i * 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

interface CardProps {
  pillar: (typeof PILLARS)[number];
  index: number;
  isFullWidth?: boolean;
}

const BentoCard = ({ pillar, index, isFullWidth }: CardProps) => {
  const Icon = pillar.icon;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (isFullWidth) {
    return (
      <motion.div
        ref={ref}
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        whileHover={{
          y: -8,
          rotateX: 2,
          boxShadow: "0 24px 60px -12px hsla(73,100%,50%,0.25)",
          transition: { duration: 0.3, ease: "easeOut" },
        }}
        className="md:col-span-3 group relative rounded-2xl overflow-hidden cursor-pointer"
        style={{
          border: "1px solid hsla(73,100%,50%,0.18)",
          background: "hsla(73,100%,50%,0.03)",
          perspective: 1000,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Giant number bg */}
        <div
          className="absolute right-8 top-1/2 -translate-y-1/2 font-clash font-black select-none pointer-events-none transition-all duration-500"
          style={{
            fontSize: "clamp(8rem, 16vw, 14rem)",
            lineHeight: 1,
            color: "hsla(0,0%,100%,0.04)",
          }}
        >
          <motion.span
            style={{ display: "block" }}
            whileHover={{ color: "hsla(73,100%,50%,0.18)" }}
          >
            {pillar.number}
          </motion.span>
        </div>

        {/* Hover halo */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, hsla(73,100%,50%,0.09) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 p-8 md:p-10">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/15"
              style={{ background: "hsla(73,100%,50%,0.1)", borderColor: "hsla(73,100%,50%,0.25)" }}>
              <Icon className="w-6 h-6 text-primary" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className="font-clash font-bold text-foreground mb-2"
              style={{ fontSize: "clamp(1.3rem, 2vw, 1.8rem)" }}
            >
              {pillar.title}
            </h3>
            <p className="font-outfit text-white/45 text-sm leading-relaxed">
              {pillar.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:flex-shrink-0">
            {pillar.items.map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 rounded-full font-mono text-[10px] tracking-wide transition-all duration-300 group-hover:border-primary/35 group-hover:text-primary/90"
                style={{
                  border: "1px solid hsla(73,100%,50%,0.2)",
                  background: "hsla(73,100%,50%,0.05)",
                  color: "hsla(73,100%,50%,0.7)",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{
        y: -8,
        rotateX: 2,
        boxShadow: "0 24px 60px -12px hsla(73,100%,50%,0.2)",
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className={`${pillar.colSpan} group relative rounded-2xl overflow-hidden cursor-pointer`}
      style={{
        border: "1px solid hsla(0,0%,100%,0.07)",
        background: "hsla(0,0%,100%,0.02)",
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Giant background number */}
      <div
        className="absolute bottom-0 right-4 font-clash font-black select-none pointer-events-none transition-all duration-500 leading-none"
        style={{
          fontSize: "clamp(6rem, 12vw, 10rem)",
          color: "hsla(0,0%,100%,0.04)",
          lineHeight: 0.85,
        }}
      >
        {pillar.number}
      </div>

      {/* Hover halo */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 80%, hsla(73,100%,50%,0.08) 0%, transparent 65%)",
        }}
      />

      {/* Hover border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          border: "1px solid hsla(73,100%,50%,0.3)",
        }}
      />

      <div className="relative z-10 p-7 h-full flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: "hsla(73,100%,50%,0.1)",
              border: "1px solid hsla(73,100%,50%,0.2)",
            }}
          >
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <span className="font-mono text-[9px] tracking-[.5em] uppercase text-white/20 group-hover:text-primary/40 transition-colors duration-300">
            {pillar.number}
          </span>
        </div>

        <h3
          className="font-clash font-bold text-foreground mb-3"
          style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)" }}
        >
          {pillar.title}
        </h3>
        <p className="font-outfit text-white/40 text-sm leading-relaxed mb-6 flex-1">
          {pillar.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {pillar.items.map((item) => (
            <span
              key={item}
              className="px-2.5 py-1 rounded-full font-mono text-[9px] tracking-wide transition-all duration-300 group-hover:border-white/15 group-hover:text-white/60"
              style={{
                border: "1px solid hsla(0,0%,100%,0.08)",
                background: "hsla(0,0%,100%,0.03)",
                color: "hsla(0,0%,100%,0.4)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ArtisteServicesV1 = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-[#070707]">
      {/* Atmospheric bg */}
      <div
        className="absolute pointer-events-none inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 80% 20%, hsla(73,100%,50%,0.05) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute pointer-events-none inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 35% at 10% 80%, hsla(73,100%,50%,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <motion.div
            custom={0}
            variants={headerVariants}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-5 h-px bg-primary" />
            <p className="font-mono text-[10px] uppercase tracking-[.5em] text-primary">
              Pôle Artiste
            </p>
          </motion.div>

          <motion.h2
            custom={1}
            variants={headerVariants}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            className="font-clash font-black text-foreground mb-4"
            style={{
              fontSize: "clamp(2.2rem, 4vw, 4.5rem)",
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

          <motion.p
            custom={2}
            variants={headerVariants}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            className="font-outfit text-white/50 leading-relaxed mt-5"
            style={{ fontSize: "16px", maxWidth: "520px" }}
          >
            Du concept au succès, on pilote chaque étape de votre projet.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PILLARS.map((pillar, i) => (
            <BentoCard
              key={pillar.number}
              pillar={pillar}
              index={i}
              isFullWidth={pillar.colSpan === "md:col-span-3"}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 flex flex-col sm:flex-row items-center gap-4"
        >
          <motion.a
            href="#packs"
            whileHover={{ scale: 1.03, brightness: 1.1 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-clash font-semibold text-sm text-background bg-primary"
          >
            Voir les packs artistes
            <span className="text-xs">&#8594;</span>
          </motion.a>
          <a
            href="#services"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.3em] text-white/40 hover:text-primary transition-colors duration-300"
          >
            <span className="w-6 h-px bg-current" />
            En savoir plus
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ArtisteServicesV1;
