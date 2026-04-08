import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import theartistALogo from "@/assets/theartist-a-logo.png";

const FEATURES = [
  { title: "Feed", desc: "Partage & découvre" },
  { title: "Portfolio", desc: "Bio, CV, tarifs" },
  { title: "Booking", desc: "Réserve facilement" },
  { title: "Chat", desc: "Échange en direct" },
];

const TheArtistShowcase = () => {
  const sectionRef = useScrollReveal();
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} className="py-20 md:py-28 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative">
        {/* ── Big "A" with neon purple-green glow ── */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <div className="relative">
            <img
              src={theartistALogo}
              alt="TheArtist"
              className="relative w-40 h-40 md:w-56 md:h-56 brightness-0 invert"
            />
          </div>
        </motion.div>

        {/* ── Compact header ── */}
        <div className="rv text-center mb-10">
          <motion.p
            className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Partenaire officiel
          </motion.p>
          <h2 className="rv font-clash text-xl md:text-2xl font-bold text-foreground">
            Le réseau pro-social <span className="text-primary">dédié au monde artistique.</span>
          </h2>
        </div>

        {/* ── Feature pills — compact neon style ── */}
        <div ref={gridRef} className="flex flex-wrap justify-center gap-3 mb-10">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={gridInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-primary/20 bg-primary/[0.04] backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_hsl(var(--primary)/0.12)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary)/0.5)]" />
              <span className="font-clash text-xs font-semibold text-foreground">{feat.title}</span>
              <span className="text-[10px] text-muted-foreground">{feat.desc}</span>
            </motion.div>
          ))}
        </div>

        {/* ── CTA — neon green ── */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs text-muted-foreground mb-4">
            Offert avec nos packs — jusqu'à <strong className="text-primary">8 mois</strong> d'accès
          </p>
          <a
            href="https://www.theartist.life/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-clash font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_hsl(var(--primary)/0.3)]"
          >
            Découvrir TheArtist
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TheArtistShowcase;
