import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Camera, Rocket, Megaphone, MessageSquare, Handshake } from "lucide-react";

const PILLARS = [
  {
    timecode: "00:01",
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
    bg: "radial-gradient(ellipse 70% 60% at 30% 50%, hsla(160,60%,12%,0.6) 0%, transparent 70%)",
  },
  {
    timecode: "00:02",
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
    bg: "radial-gradient(ellipse 70% 60% at 70% 50%, hsla(260,40%,12%,0.6) 0%, transparent 70%)",
  },
  {
    timecode: "00:03",
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
    bg: "radial-gradient(ellipse 70% 60% at 30% 50%, hsla(25,50%,10%,0.6) 0%, transparent 70%)",
  },
  {
    timecode: "00:04",
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
    bg: "radial-gradient(ellipse 70% 60% at 70% 50%, hsla(195,50%,10%,0.6) 0%, transparent 70%)",
  },
  {
    timecode: "00:05",
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
    bg: "radial-gradient(ellipse 70% 60% at 50% 50%, hsla(73,100%,8%,0.7) 0%, transparent 70%)",
  },
];

const TimelineItem = ({
  pillar,
  index,
  isLast,
}: {
  pillar: (typeof PILLARS)[number];
  index: number;
  isLast: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;
  const Icon = pillar.icon;

  return (
    <div ref={ref} className="relative flex gap-0">
      {/* Timeline spine */}
      <div className="relative flex flex-col items-center" style={{ width: 80, flexShrink: 0 }}>
        {/* Filled line above dot */}
        <motion.div
          initial={{ height: 0 }}
          animate={inView ? { height: "100%" } : { height: 0 }}
          transition={{ duration: 1.2, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px origin-top"
          style={{
            background:
              "linear-gradient(to bottom, hsla(73,100%,50%,0.7), hsla(73,100%,50%,0.15))",
            display: isLast ? "none" : "block",
            top: 48,
            bottom: 0,
          }}
        />

        {/* Dot */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.1 }}
          className="relative mt-6 z-10"
        >
          {/* Pulse rings */}
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full"
            style={{ background: "hsla(73,100%,50%,0.3)" }}
          />
          <motion.div
            animate={{ scale: [1, 2.5, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute inset-0 rounded-full"
            style={{ background: "hsla(73,100%,50%,0.15)" }}
          />
          <div
            className="relative w-4 h-4 rounded-full border-2"
            style={{
              background: "hsl(73 100% 50%)",
              borderColor: "hsla(73,100%,50%,0.5)",
              boxShadow: "0 0 16px hsla(73,100%,50%,0.8)",
            }}
          />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 60 : -60 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 60 : -60 }}
        transition={{ duration: 0.8, delay: index * 0.15 + 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="group flex-1 mb-16 relative"
      >
        <div
          className="relative rounded-2xl p-8 overflow-hidden transition-all duration-500"
          style={{
            background: "hsla(0,0%,100%,0.02)",
            border: "1px solid hsla(0,0%,100%,0.07)",
          }}
        >
          {/* Subtle bg per item */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: pillar.bg }}
          />

          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
            style={{
              boxShadow: "inset 0 0 40px hsla(73,100%,50%,0.06)",
              border: "1px solid hsla(73,100%,50%,0.2)",
            }}
          />

          <div className="relative z-10">
            {/* Timecode + Icon */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: "hsla(73,100%,50%,0.1)",
                    border: "1px solid hsla(73,100%,50%,0.25)",
                  }}
                >
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span
                    className="font-mono text-xs font-medium block"
                    style={{ color: "hsl(73 100% 50%)" }}
                  >
                    {pillar.timecode}
                  </span>
                  <span className="font-mono text-[9px] tracking-[.4em] uppercase text-white/25">
                    Étape {pillar.number}
                  </span>
                </div>
              </div>

              {/* Animated line on hover */}
              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: 48 }}
                className="h-px origin-right"
                style={{ background: "hsl(73 100% 50%)" }}
              />
            </div>

            <h3
              className="font-clash font-bold text-foreground mb-3"
              style={{ fontSize: "clamp(1.3rem, 2.2vw, 2rem)" }}
            >
              {pillar.title}
            </h3>
            <p className="font-outfit text-white/45 leading-relaxed mb-6" style={{ fontSize: 15 }}>
              {pillar.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pillar.items.map((item, j) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.4, delay: index * 0.15 + 0.4 + j * 0.06 }}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-1 h-1 rounded-full flex-shrink-0"
                    style={{ background: "hsl(73 100% 50%)" }}
                  />
                  <span className="font-mono text-[10px] text-white/50 tracking-wide">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ArtisteServicesV2 = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-[#080808]">
      {/* Atmospheric */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, hsla(73,100%,50%,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-[900px] mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-5 h-px bg-primary" />
            <p className="font-mono text-[10px] uppercase tracking-[.5em] text-primary">
              Pôle Artiste
            </p>
            <div className="w-5 h-px bg-primary" />
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
            className="font-outfit text-white/50 leading-relaxed mt-5 mx-auto"
            style={{ fontSize: 16, maxWidth: 520 }}
          >
            Du concept au succès, on pilote chaque étape de votre projet.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative pl-2">
          {PILLARS.map((pillar, i) => (
            <TimelineItem
              key={pillar.number}
              pillar={pillar}
              index={i}
              isLast={i === PILLARS.length - 1}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
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

export default ArtisteServicesV2;
