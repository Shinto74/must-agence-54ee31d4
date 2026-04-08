import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import theartistIcon from "@/assets/theartist-icon.png";
import theartistLogoColor from "@/assets/theartist-logo-color.png";

/* Palette: subtle purple accent, primary neon green dominates */
const TA = {
  purple: "#6C3CE1",
  purpleSubtle: "rgba(108,60,225,0.12)",
  gradientSubtle: "linear-gradient(135deg, rgba(108,60,225,0.08), rgba(204,255,0,0.04))",
};

const FEATURES = [
  { title: "Fil d'actualité", desc: "Partage tes créations et découvre les talents." },
  { title: "Profil Portfolio", desc: "Bio, CV, tarifs, agenda — tout en un." },
  { title: "Booking", desc: "Trouve et réserve des artistes facilement." },
  { title: "Messagerie", desc: "Échange avec artistes et professionnels." },
];

const TheArtistShowcase = () => {
  const sectionRef = useScrollReveal();
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Ambient background — very subtle purple */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.04]" style={{ background: `radial-gradient(ellipse, ${TA.purple}, transparent 70%)` }} />
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* ── Hero: Logo + Text centered ── */}
        <div className="rv text-center mb-14">
          <motion.div
            className="flex items-center justify-center mb-8"
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <div className="relative">
              <div className="absolute inset-[-20px] rounded-3xl blur-3xl opacity-30 animate-pulse bg-primary/20" />
              <div
                className="relative w-28 h-28 md:w-36 md:h-36 rounded-3xl flex items-center justify-center border border-border backdrop-blur-sm"
                style={{ background: TA.gradientSubtle }}
              >
                <img
                  src={theartistIcon}
                  alt="TheArtist"
                  className="w-16 h-16 md:w-24 md:h-24"
                  style={{ filter: "invert(1) drop-shadow(0 0 12px rgba(108,60,225,0.4))" }}
                />
              </div>
            </div>
          </motion.div>

          <motion.img
            src={theartistLogoColor}
            alt="THEARTIST"
            className="h-8 md:h-10 mx-auto mb-4"
            style={{ filter: "invert(1) drop-shadow(0 0 12px rgba(108,60,225,0.2))" }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          <motion.p
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Partenaire officiel Must Agence
          </motion.p>

          <h2 className="rv font-clash text-2xl md:text-4xl font-bold text-foreground mb-3">
            Le réseau pro-social{" "}
            <span className="text-primary">dédié aux artistes.</span>
          </h2>
          <p className="rv text-muted-foreground max-w-lg mx-auto text-sm md:text-base">
            Instagram × LinkedIn × Booking — en une seule app.
          </p>
        </div>

        {/* ── Feature cards ── */}
        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 24 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as const }}
              className="group rounded-2xl p-5 border border-border transition-all duration-500 hover:border-primary/30"
              style={{ background: TA.gradientSubtle }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-3 text-[10px] font-mono font-bold border border-white/10"
                style={{ background: TA.purpleSubtle, color: TA.purple }}
              >
                0{i + 1}
              </div>
              <h3 className="font-clash text-sm font-bold text-foreground mb-1.5">{feat.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── CTA — neon green dominant ── */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-muted-foreground mb-5">
            Offert avec nos packs — jusqu'à <strong className="text-primary">8 mois</strong> d'accès
          </p>
          <a
            href="https://www.theartist.life/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-clash font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
          >
            <img src={theartistIcon} alt="" className="w-5 h-5" style={{ filter: "invert(1)" }} />
            Découvrir TheArtist
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TheArtistShowcase;
