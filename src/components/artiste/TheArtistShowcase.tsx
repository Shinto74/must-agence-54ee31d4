import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Smartphone, Users, Search, MessageCircle, Calendar, Star } from "lucide-react";
import theartistIcon from "@/assets/theartist-icon.png";
import theartistTextLogo from "@/assets/theartist-text.png";

const FEATURES = [
  {
    icon: Smartphone,
    number: "01",
    title: "Fil d'actualité",
    desc: "Partage photos, vidéos, audio et créations. Like, commente et découvre les talents près de chez toi grâce à la géolocalisation.",
  },
  {
    icon: Star,
    number: "02",
    title: "Profil Portfolio",
    desc: "Bio, parcours, CV, tarifs, agenda et collaborations réunis. Un portfolio digital complet pensé pour les artistes.",
  },
  {
    icon: Calendar,
    number: "03",
    title: "Booking",
    desc: "Crée une offre selon tes besoins et laisse les talents venir à toi. Compare, échange et réserve en toute simplicité.",
  },
  {
    icon: MessageCircle,
    number: "04",
    title: "Messagerie",
    desc: "Discute d'un projet, affine une demande, partage une vision ou crée du lien avec des artistes et des professionnels.",
  },
  {
    icon: Search,
    number: "05",
    title: "Recherche",
    desc: "Explore des profils, découvre des univers et trouve ceux qui résonnent avec ton projet grâce à des filtres précis.",
  },
  {
    icon: Users,
    number: "06",
    title: "Communauté",
    desc: "Rejoins un réseau de créateurs, clients et passionnés d'art. Connecte-toi avec l'écosystème artistique.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const TheArtistShowcase = () => {
  const sectionRef = useScrollReveal();
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Background ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="rv text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/50">Partenaire officiel</span>
          </div>

          {/* Logo showcase */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl blur-xl opacity-40 animate-pulse" style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }} />
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#EC4899]/20 border border-[#8B5CF6]/30 flex items-center justify-center backdrop-blur-sm">
                <img
                  src={theartistIcon}
                  alt="TheArtist"
                  className="w-10 h-10 md:w-12 md:h-12"
                  style={{ filter: "invert(1) drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))" }}
                />
              </div>
            </div>
          </motion.div>

          <motion.img
            src={theartistTextLogo}
            alt="THEARTIST"
            className="h-6 md:h-8 mx-auto mb-6"
            style={{ filter: "invert(1)" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />

          <h2 className="rv font-clash text-3xl md:text-5xl font-bold text-foreground mb-4">
            Le réseau pro-social{" "}
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
              dédié aux artistes.
            </span>
          </h2>
          <p className="rv text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            TheArtist combine la convivialité d'Instagram, la créativité de TikTok,
            la rigueur de LinkedIn avec l'efficacité du booking artistique.
          </p>
        </div>

        {/* Features grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.number}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate={gridInView ? "visible" : "hidden"}
              className="group relative rounded-2xl p-6 border border-border bg-surface/50 backdrop-blur-sm transition-all duration-500 hover:border-[#8B5CF6]/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]"
            >
              {/* Number */}
              <span className="absolute top-4 right-4 font-mono text-[10px] text-muted-foreground/30">{feat.number}</span>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#EC4899]/10 border border-[#8B5CF6]/15 flex items-center justify-center mb-4 transition-all duration-500 group-hover:border-[#8B5CF6]/30 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <feat.icon size={18} className="text-[#8B5CF6] transition-colors duration-300" />
              </div>

              <h3 className="font-clash text-lg font-bold text-foreground mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 mb-4">
            <img src={theartistIcon} alt="" className="w-5 h-5" style={{ filter: "invert(1)" }} />
            <span className="text-sm text-foreground/80 font-medium">
              Offert avec nos packs : jusqu'à <strong className="text-primary">8 mois</strong> d'accès TheArtist
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-mono">
            Permettre à chaque artiste de vivre de son art.
          </p>
          <a
            href="https://www.theartist.life/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-clash font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:-translate-y-0.5"
          >
            Découvrir TheArtist
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TheArtistShowcase;
