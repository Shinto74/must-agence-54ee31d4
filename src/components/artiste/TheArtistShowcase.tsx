import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import theartistALogo from "@/assets/theartist-a-logo.png";

const FEATURES = [
  { title: "Feed", desc: "Partage & découvre" },
  { title: "Portfolio", desc: "Bio, CV, tarifs" },
  { title: "Booking", desc: "Réserve facilement" },
  { title: "Chat", desc: "Échange en direct" },
];

/* Subtle orbit ring */
const OrbitRing = ({ size, duration, delay }: { size: number; duration: number; delay: number }) => (
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
    initial={{ opacity: 0, scale: 0.7 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ opacity: { duration: 1.5, delay }, scale: { duration: 2, delay, ease: [0.16, 1, 0.3, 1] } }}
  >
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full bg-primary/30 shadow-[0_0_4px_hsl(var(--primary)/0.3)]"
      style={{ top: -2, left: "50%", marginLeft: -2, transformOrigin: `2px ${size / 2 + 2}px` }}
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  </motion.div>
);

/* Particle that flies inward then fades */
const Particle = ({ angle, delay, radius }: { angle: number; delay: number; radius: number }) => {
  const rad = (angle * Math.PI) / 180;
  const startX = Math.cos(rad) * radius;
  const startY = Math.sin(rad) * radius;

  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-primary"
      style={{
        top: "50%",
        left: "50%",
        marginTop: -2,
        marginLeft: -2,
      }}
      initial={{ x: startX, y: startY, opacity: 1, scale: 1.5 }}
      whileInView={{
        x: 0,
        y: 0,
        opacity: [1, 1, 0],
        scale: [1.5, 0.8, 0],
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    />
  );
};

const TheArtistShowcase = () => {
  const sectionRef = useScrollReveal();
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-40px" });

  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      angle: (360 / 20) * i + Math.random() * 10,
      delay: 0.1 + Math.random() * 0.5,
      radius: 100 + Math.random() * 60,
    })),
  []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative">
        {/* ── Logo with particle burst ── */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>
            {/* Orbit rings */}
            <OrbitRing size={180} duration={40} delay={0.3} />
            <OrbitRing size={230} duration={55} delay={0.6} />

            {/* Particles flying inward */}
            {particles.map((p, i) => (
              <Particle key={i} angle={p.angle} delay={p.delay} radius={p.radius} />
            ))}

            {/* Flash burst when logo appears */}
            <motion.div
              className="absolute w-40 h-40 rounded-full"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.25), transparent 60%)" }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: [0, 2.5, 0], opacity: [0, 0.6, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
            />

            {/* Soft glow */}
            <motion.div
              className="absolute w-24 h-24 rounded-full"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.1), transparent 70%)" }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Logo — appears after particles converge */}
            <motion.img
              src={theartistALogo}
              alt="TheArtist"
              className="relative w-36 h-36 md:w-44 md:h-44 brightness-0 invert z-10"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: [0, 1.1, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.05 }}
            />
          </div>
        </motion.div>

        {/* ── Header — bigger text ── */}
        <div className="rv text-center mb-8">
          <motion.div
            className="flex items-center justify-center gap-4 mb-4"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="w-8 h-px bg-primary/50" />
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary">
              Partenaire officiel
            </p>
            <span className="w-8 h-px bg-primary/50" />
          </motion.div>

          <motion.h2
            className="font-clash text-2xl md:text-4xl font-bold text-foreground"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Le réseau pro-social{" "}
            <span className="text-primary">dédié au monde artistique.</span>
          </motion.h2>
        </div>

        {/* ── Feature pills ── */}
        <div ref={gridRef} className="flex flex-wrap justify-center gap-3 mb-8">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20, scale: 0.85 }}
              animate={gridInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 180, damping: 18, delay: i * 0.1 }}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 0 25px hsl(var(--primary) / 0.15), inset 0 0 20px hsl(var(--primary) / 0.05)",
                y: -3,
                borderColor: "hsl(var(--primary) / 0.4)",
              }}
              className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-primary/25 bg-primary/[0.06] backdrop-blur-sm cursor-default overflow-hidden shadow-[0_0_12px_hsl(var(--primary)/0.06)]"
            >
              {/* Shimmer sweep on hover */}
              <motion.div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.08), transparent)",
                }}
              />
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-primary relative z-10"
                animate={{
                  boxShadow: [
                    "0 0 3px hsl(var(--primary) / 0.3)",
                    "0 0 10px hsl(var(--primary) / 0.7)",
                    "0 0 3px hsl(var(--primary) / 0.3)",
                  ],
                  scale: [1, 1.3, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              />
              <span className="font-clash text-[11px] font-semibold text-foreground relative z-10">{feat.title}</span>
              <span className="text-[10px] text-muted-foreground hidden sm:inline relative z-10">{feat.desc}</span>
            </motion.div>
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-[11px] text-muted-foreground/80 mb-4">
            Offert avec nos packs — jusqu'à <strong className="text-primary">8 mois</strong> d'accès
          </p>
          <motion.a
            href="https://www.theartist.life/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-clash font-bold text-xs uppercase tracking-wider overflow-hidden"
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 35px hsl(var(--primary) / 0.4), 0 0 60px hsl(var(--primary) / 0.15)",
              y: -2,
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            animate={{
              boxShadow: [
                "0 0 10px hsl(var(--primary) / 0.1)",
                "0 0 20px hsl(var(--primary) / 0.25)",
                "0 0 10px hsl(var(--primary) / 0.1)",
              ],
            }}
          >
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 -translate-x-full"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              }}
              animate={{ translateX: ["-100%", "100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            />
            <span className="relative z-10">Découvrir TheArtist</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default TheArtistShowcase;
