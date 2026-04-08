import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import theartistIcon from "@/assets/theartist-icon.png";
import theartistLogoColor from "@/assets/theartist-logo-color.png";

/* TheArtist brand palette */
const TA = {
  purple: "#6C3CE1",
  purpleLight: "#A78BFA",
  pink: "#E040A0",
  gradient: "linear-gradient(135deg, #6C3CE1, #E040A0)",
  gradientSubtle: "linear-gradient(135deg, rgba(108,60,225,0.12), rgba(224,64,160,0.08))",
  glow: "0 0 60px rgba(108,60,225,0.25), 0 0 120px rgba(224,64,160,0.1)",
};

const FEATURES = [
  { title: "Fil d'actualité", desc: "Partage tes créations et découvre les talents autour de toi." },
  { title: "Profil Portfolio", desc: "Bio, CV, tarifs, agenda — ton portfolio digital complet." },
  { title: "Booking", desc: "Trouve et réserve des artistes en toute simplicité." },
  { title: "Messagerie", desc: "Échange directement avec artistes et professionnels." },
];

const TheArtistShowcase = () => {
  const sectionRef = useScrollReveal();
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* TheArtist-style ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-[0.06]" style={{ background: "radial-gradient(ellipse, #6C3CE1, transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] opacity-[0.04]" style={{ background: "radial-gradient(circle, #E040A0, transparent 70%)" }} />
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* ── Logo Hero ── */}
        <div className="rv text-center mb-16">
          <motion.div
            className="flex items-center justify-center mb-8"
            initial={{ opacity: 0, scale: 0.7, rotateY: -30 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-[-20px] rounded-3xl blur-2xl opacity-60 animate-pulse" style={{ background: TA.gradient }} />
              {/* Logo container */}
              <div
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center border border-white/10 backdrop-blur-sm"
                style={{ background: TA.gradientSubtle, boxShadow: TA.glow }}
              >
                <img
                  src={theartistIcon}
                  alt="TheArtist"
                  className="w-14 h-14 md:w-20 md:h-20"
                  style={{ filter: "invert(1) drop-shadow(0 0 12px rgba(108,60,225,0.6))" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Brand logo text */}
          <motion.img
            src={theartistLogoColor}
            alt="THEARTIST"
            className="h-8 md:h-10 mx-auto mb-4"
            style={{ filter: "invert(1) drop-shadow(0 0 20px rgba(108,60,225,0.4))" }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          <motion.p
            className="font-mono text-[10px] uppercase tracking-[0.3em] mb-6"
            style={{ color: TA.purpleLight }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Partenaire officiel Must Agence
          </motion.p>

          <h2 className="rv font-clash text-2xl md:text-4xl font-bold text-foreground mb-3">
            Le réseau pro-social{" "}
            <span style={{ background: TA.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              dédié aux artistes.
            </span>
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
              className="group rounded-2xl p-5 border border-white/[0.06] transition-all duration-500 hover:border-[#6C3CE1]/25"
              style={{ background: TA.gradientSubtle }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 30px rgba(108,60,225,0.1), inset 0 0 30px rgba(108,60,225,0.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Numbered dot */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-3 text-[10px] font-mono font-bold text-white/80 border border-white/10"
                style={{ background: TA.gradient }}
              >
                0{i + 1}
              </div>
              <h3 className="font-clash text-sm font-bold text-foreground mb-1.5">{feat.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-foreground/50 mb-5">
            Offert avec nos packs — jusqu'à <strong className="text-primary">8 mois</strong> d'accès
          </p>
          <a
            href="https://www.theartist.life/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-white font-clash font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: TA.gradient, boxShadow: "0 0 30px rgba(108,60,225,0.2)" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 50px rgba(108,60,225,0.4), 0 0 100px rgba(224,64,160,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 30px rgba(108,60,225,0.2)"; }}
          >
            <img src={theartistIcon} alt="" className="w-5 h-5" style={{ filter: "invert(1)" }} />
            Découvrir TheArtist
          </a>
        </motion.div>
      </div>

      {/* TheArtist-style decorative lines */}
      <div className="absolute top-1/3 left-0 w-px h-32 opacity-10" style={{ background: TA.gradient }} />
      <div className="absolute bottom-1/4 right-0 w-px h-24 opacity-10" style={{ background: TA.gradient }} />
    </section>
  );
};

export default TheArtistShowcase;
