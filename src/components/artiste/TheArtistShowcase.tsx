import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Smartphone, Users, Calendar, MessageCircle } from "lucide-react";
import theartistIcon from "@/assets/theartist-icon.png";
import theartistTextLogo from "@/assets/theartist-text.png";

const FEATURES = [
  { icon: Smartphone, title: "Fil d'actualité", desc: "Partage tes créations et découvre les talents autour de toi." },
  { icon: Users, title: "Profil Portfolio", desc: "Un CV digital complet pour présenter ton art." },
  { icon: Calendar, title: "Booking", desc: "Trouve et réserve des artistes en toute simplicité." },
  { icon: MessageCircle, title: "Messagerie", desc: "Échange directement avec artistes et professionnels." },
];

const TheArtistShowcase = () => {
  const sectionRef = useScrollReveal();
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Ambient glow — TheArtist purple */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #7C3AED, transparent 70%)" }} />
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="rv text-center mb-14">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A78BFA] mb-6 block">Partenaire officiel</span>

          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <div className="relative">
              <div className="absolute inset-[-6px] rounded-2xl blur-lg opacity-50 animate-pulse" style={{ background: "linear-gradient(135deg, #7C3AED, #DB2777)" }} />
              <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center border border-[#7C3AED]/40" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(219,39,119,0.1))" }}>
                <img src={theartistIcon} alt="TheArtist" className="w-10 h-10" style={{ filter: "invert(1) drop-shadow(0 0 6px rgba(124,58,237,0.5))" }} />
              </div>
            </div>
          </motion.div>

          <motion.img
            src={theartistTextLogo}
            alt="THEARTIST"
            className="h-5 md:h-7 mx-auto mb-6"
            style={{ filter: "invert(1)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />

          <h2 className="rv font-clash text-2xl md:text-4xl font-bold text-foreground mb-3">
            Le réseau pro-social{" "}
            <span style={{ background: "linear-gradient(135deg, #A78BFA, #F472B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              dédié aux artistes.
            </span>
          </h2>
          <p className="rv text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Instagram × LinkedIn × Booking en une seule app.
          </p>
        </div>

        {/* Features — 4 cards */}
        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 24 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              className="group rounded-xl p-5 border border-border bg-surface/50 transition-all duration-500 hover:border-[#7C3AED]/25 hover:shadow-[0_0_25px_rgba(124,58,237,0.06)]"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 border border-[#7C3AED]/15 transition-all duration-400 group-hover:border-[#7C3AED]/30" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(219,39,119,0.05))" }}>
                <feat.icon size={16} className="text-[#A78BFA]" />
              </div>
              <h3 className="font-clash text-sm font-bold text-foreground mb-1">{feat.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-foreground/60 mb-4">
            Offert avec nos packs — jusqu'à <strong className="text-primary">8 mois</strong> d'accès
          </p>
          <a
            href="https://www.theartist.life/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-white font-clash font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #7C3AED, #DB2777)" }}
          >
            <img src={theartistIcon} alt="" className="w-4 h-4" style={{ filter: "invert(1)" }} />
            Découvrir TheArtist
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TheArtistShowcase;
