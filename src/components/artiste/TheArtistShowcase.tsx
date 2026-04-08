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

/* Orbit ring component */
const OrbitRing = ({ size, duration, delay, opacity }: { size: number; duration: number; delay: number; opacity: number }) => (
  <motion.div
    className="absolute rounded-full border border-primary/10"
    style={{
      width: size,
      height: size,
      top: "50%",
      left: "50%",
      marginTop: -size / 2,
      marginLeft: -size / 2,
    }}
    initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
    whileInView={{ opacity, scale: 1, rotate: 360 }}
    viewport={{ once: true }}
    transition={{
      opacity: { duration: 1.2, delay },
      scale: { duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] },
      rotate: { duration, repeat: Infinity, ease: "linear" },
    }}
  >
    {/* Orbiting dot */}
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
      style={{ top: -3, left: "50%", marginLeft: -3 }}
    />
  </motion.div>
);

const TheArtistShowcase = () => {
  const sectionRef = useScrollReveal();
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Animated background lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"
            style={{
              top: `${25 + i * 25}%`,
              left: "-10%",
              right: "-10%",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 0.3 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* ── Logo with orbit rings ── */}
        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
            {/* Orbit rings */}
            <OrbitRing size={200} duration={20} delay={0.3} opacity={0.4} />
            <OrbitRing size={260} duration={30} delay={0.5} opacity={0.2} />

            {/* Pulsing glow behind logo */}
            <motion.div
              className="absolute w-32 h-32 rounded-full"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 70%)" }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Logo — entrance with 3D flip */}
            <motion.img
              src={theartistALogo}
              alt="TheArtist"
              className="relative w-28 h-28 md:w-36 md:h-36 brightness-0 invert z-10"
              initial={{ opacity: 0, scale: 0.3, rotateY: -90 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.08, rotateY: 10 }}
            />
          </div>
        </motion.div>

        {/* ── Header with stagger ── */}
        <div className="rv text-center mb-12">
          <motion.p
            className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary mb-5"
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Partenaire officiel
          </motion.p>

          <motion.h2
            className="font-clash text-xl md:text-3xl font-bold text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Le réseau pro-social{" "}
            <motion.span
              className="text-primary inline-block"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              dédié au monde artistique.
            </motion.span>
          </motion.h2>
        </div>

        {/* ── Feature pills with staggered spring entrance ── */}
        <div ref={gridRef} className="flex flex-wrap justify-center gap-3 mb-12">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={gridInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: i * 0.12,
              }}
              whileHover={{
                scale: 1.05,
                borderColor: "hsl(var(--primary) / 0.5)",
                boxShadow: "0 0 25px hsl(var(--primary) / 0.15), 0 4px 20px rgba(0,0,0,0.2)",
                y: -3,
              }}
              className="flex items-center gap-2.5 px-5 py-3 rounded-full border border-primary/20 bg-primary/[0.04] backdrop-blur-sm cursor-default"
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-primary"
                animate={{
                  boxShadow: [
                    "0 0 4px hsl(var(--primary) / 0.4)",
                    "0 0 12px hsl(var(--primary) / 0.8)",
                    "0 0 4px hsl(var(--primary) / 0.4)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
              <span className="font-clash text-xs font-semibold text-foreground">{feat.title}</span>
              <span className="text-[10px] text-muted-foreground hidden sm:inline">{feat.desc}</span>
            </motion.div>
          ))}
        </div>

        {/* ── CTA with magnetic hover ── */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.p
            className="text-xs text-muted-foreground mb-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Offert avec nos packs — jusqu'à <strong className="text-primary">8 mois</strong> d'accès
          </motion.p>
          <motion.a
            href="https://www.theartist.life/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-clash font-bold text-xs uppercase tracking-wider"
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 35px hsl(var(--primary) / 0.4), 0 0 60px hsl(var(--primary) / 0.15)",
              y: -2,
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            Découvrir TheArtist
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default TheArtistShowcase;
