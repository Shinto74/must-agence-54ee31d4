import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, Rocket, Megaphone, MessageSquare, Handshake } from "lucide-react";

const CRYSTAL_THEMES = [
  {
    accent: "#2DD4BF", // emerald/teal
    hsl: "173,62%,50%",
    glow: "hsla(173,62%,50%,0.18)",
    border: "hsla(173,62%,50%,0.2)",
    bg: "hsla(173,62%,50%,0.04)",
    iconBg: "hsla(173,62%,50%,0.12)",
    iconBorder: "hsla(173,62%,50%,0.3)",
  },
  {
    accent: "#A78BFA", // violet
    hsl: "259,94%,76%",
    glow: "hsla(259,94%,76%,0.18)",
    border: "hsla(259,94%,76%,0.2)",
    bg: "hsla(259,94%,76%,0.04)",
    iconBg: "hsla(259,94%,76%,0.12)",
    iconBorder: "hsla(259,94%,76%,0.3)",
  },
  {
    accent: "#FB923C", // orange/amber
    hsl: "25,95%,60%",
    glow: "hsla(25,95%,60%,0.18)",
    border: "hsla(25,95%,60%,0.2)",
    bg: "hsla(25,95%,60%,0.04)",
    iconBg: "hsla(25,95%,60%,0.12)",
    iconBorder: "hsla(25,95%,60%,0.3)",
  },
  {
    accent: "#22D3EE", // cyan
    hsl: "189,94%,53%",
    glow: "hsla(189,94%,53%,0.18)",
    border: "hsla(189,94%,53%,0.2)",
    bg: "hsla(189,94%,53%,0.04)",
    iconBg: "hsla(189,94%,53%,0.12)",
    iconBorder: "hsla(189,94%,53%,0.3)",
  },
  {
    accent: "#CCFF00", // primary lime
    hsl: "73,100%,50%",
    glow: "hsla(73,100%,50%,0.18)",
    border: "hsla(73,100%,50%,0.2)",
    bg: "hsla(73,100%,50%,0.04)",
    iconBg: "hsla(73,100%,50%,0.12)",
    iconBorder: "hsla(73,100%,50%,0.3)",
  },
];

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
  },
];

// Blob border-radius sequences for morphing
const BLOB_SEQUENCES = [
  ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 50% 50% / 50% 50% 50% 50%", "70% 30% 30% 70% / 70% 70% 30% 30%", "50% 50% 50% 50% / 50% 50% 50% 50%"],
  ["50% 50% 50% 50% / 60% 40% 60% 40%", "40% 60% 40% 60% / 50% 50% 50% 50%", "60% 40% 60% 40% / 40% 60% 40% 60%", "50% 50% 50% 50% / 50% 50% 50% 50%"],
  ["60% 40% 30% 70% / 60% 30% 70% 40%", "50% 50% 50% 50% / 50% 50% 50% 50%", "30% 70% 60% 40% / 40% 70% 30% 60%", "50% 50% 50% 50% / 50% 50% 50% 50%"],
  ["40% 60% 60% 40% / 70% 30% 70% 30%", "50% 50% 50% 50% / 50% 50% 50% 50%", "60% 40% 40% 60% / 30% 70% 30% 70%", "50% 50% 50% 50% / 50% 50% 50% 50%"],
  ["35% 65% 65% 35% / 35% 35% 65% 65%", "50% 50% 50% 50% / 50% 50% 50% 50%", "65% 35% 35% 65% / 65% 65% 35% 35%", "50% 50% 50% 50% / 50% 50% 50% 50%"],
];

const CrystalCard = ({
  pillar,
  theme,
  blobSeq,
  index,
}: {
  pillar: (typeof PILLARS)[number];
  theme: (typeof CRYSTAL_THEMES)[number];
  blobSeq: string[];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = pillar.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.93 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.75, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.025, transition: { duration: 0.3 } }}
      className="group relative rounded-2xl p-7 overflow-hidden cursor-pointer"
      style={{
        background: `${theme.bg}, hsla(0,0%,100%,0.02)`,
        backdropFilter: "blur(8px)",
        border: `1px solid ${theme.border}`,
      }}
    >
      {/* Morphing blob glow in corner */}
      <motion.div
        animate={{ borderRadius: blobSeq }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -left-10 w-40 h-40 pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.glow} 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />

      {/* Hover internal glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 30% 30%, ${theme.glow} 0%, transparent 65%)`,
        }}
      />

      {/* Border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{
          border: `1px solid ${theme.accent}44`,
          boxShadow: `0 0 30px ${theme.glow}, inset 0 0 20px ${theme.glow}`,
        }}
      />

      <div className="relative z-10">
        {/* Icon + Number */}
        <div className="flex items-start justify-between mb-5">
          {/* Morphing icon container */}
          <motion.div
            animate={{ borderRadius: blobSeq.map(b => b.split(" / ")[0]) }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: theme.iconBg,
              border: `1px solid ${theme.iconBorder}`,
            }}
          >
            <Icon className="w-7 h-7" style={{ color: theme.accent }} />
          </motion.div>

          <span
            className="font-mono text-[9px] tracking-[.5em] uppercase transition-colors duration-300"
            style={{ color: `${theme.accent}55` }}
          >
            {pillar.number}
          </span>
        </div>

        <h3
          className="font-clash font-bold text-foreground mb-3 transition-colors duration-300"
          style={{ fontSize: "clamp(1.15rem, 1.7vw, 1.5rem)" }}
        >
          {pillar.title}
        </h3>

        <p className="font-outfit text-white/40 text-sm leading-relaxed mb-5 group-hover:text-white/55 transition-colors duration-300">
          {pillar.description}
        </p>

        <div className="space-y-2">
          {pillar.items.map((item, j) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.5 + j * 0.06 }}
              className="flex items-center gap-2.5"
            >
              <div
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: theme.accent }}
              />
              <span className="font-mono text-[10px] text-white/45 tracking-wide">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ArtisteServicesV3 = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-[#0A0A0A]">
      {/* Animated mesh gradient background */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 20%, hsla(73,100%,50%,0.03) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 80% 80%, hsla(259,94%,76%,0.03) 0%, transparent 50%), radial-gradient(ellipse 50% 50% at 50% 50%, hsla(173,62%,50%,0.02) 0%, transparent 50%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsla(0,0%,100%,1) 1px, transparent 1px), linear-gradient(90deg, hsla(0,0%,100%,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-5 h-px bg-primary" />
            <p className="font-mono text-[10px] uppercase tracking-[.5em] text-primary">
              Pôle Artiste
            </p>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-outfit text-white/50 leading-relaxed mt-5"
            style={{ fontSize: 16, maxWidth: 520 }}
          >
            Du concept au succès, on pilote chaque étape de votre projet.
          </motion.p>
        </div>

        {/* Masonry-style grid: 3 cols row 1, 2 cols row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {PILLARS.slice(0, 3).map((pillar, i) => (
            <CrystalCard
              key={pillar.number}
              pillar={pillar}
              theme={CRYSTAL_THEMES[i]}
              blobSeq={BLOB_SEQUENCES[i]}
              index={i}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PILLARS.slice(3, 5).map((pillar, i) => (
            <CrystalCard
              key={pillar.number}
              pillar={pillar}
              theme={CRYSTAL_THEMES[i + 3]}
              blobSeq={BLOB_SEQUENCES[i + 3]}
              index={i + 3}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-14 flex flex-col sm:flex-row items-center gap-4"
        >
          <motion.a
            href="#packs"
            whileHover={{ scale: 1.03 }}
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

export default ArtisteServicesV3;
