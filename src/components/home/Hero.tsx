import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";

const VIDEO_URL = "https://cdn.jsdelivr.net/gh/Shinto74/IMAGES@ee9be1c404afd60483c0caf409121c884ae142f1/must-agence/14819394_1280_720_25fps.mp4";

const BRAND_LETTERS = [
  { char: "M", color: "hsl(0 0% 100%)" },
  { char: "U", color: "hsl(0 0% 100%)" },
  { char: "S", color: "hsl(0 0% 100%)" },
  { char: "T", color: "hsl(0 0% 100%)" },
  { char: "\u00A0", color: "transparent" },
  { char: "A", color: "hsl(73 100% 50%)" },
  { char: "G", color: "hsl(0 0% 100%)" },
  { char: "E", color: "hsl(0 0% 100%)" },
  { char: "N", color: "hsl(0 0% 100%)" },
  { char: "C", color: "hsl(0 0% 100%)" },
  { char: "E", color: "hsl(0 0% 100%)" },
];

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x: cx, y: cy });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVideoReady(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {!videoReady && (
        <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-primary font-mono text-sm">Chargement...</p>
          </div>
        </div>
      )}

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* VIDEO */}
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          onCanPlay={() => setVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* Dark cinematic overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: `
              linear-gradient(to bottom, rgba(7,7,7,0.45) 0%, rgba(7,7,7,0.18) 40%, rgba(7,7,7,0.3) 60%, rgba(7,7,7,0.85) 100%),
              radial-gradient(ellipse 50% 50% at 50% 50%, transparent 0%, rgba(7,7,7,0.2) 100%)
            `,
          }}
        />

        {/* Subtle parallax orb */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full z-[2] pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsl(73 100% 50% / 0.06) 0%, transparent 60%)",
            top: "30%",
            left: "40%",
            transform: `translate(${mouse.x * -25}px, ${mouse.y * -15}px)`,
            transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* CONTENT */}
        <div className="relative z-10 text-center w-full max-w-6xl mx-auto px-6">

          {/* Label tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-8 h-px bg-primary/50" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/70">
              Influence Artistique
            </span>
            <div className="w-8 h-px bg-primary/50" />
          </motion.div>

          {/* MUST AGENCE — typewriter néon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mb-4"
          >
            <div
              className="font-clash font-black leading-[0.85] text-center flex items-center justify-center"
              style={{
                fontSize: "clamp(2rem, 6vw, 5.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {BRAND_LETTERS.map((letter, i) => {
                const isNeon = letter.color.includes("73");
                const baseDelay = 0.8 + i * 0.15;
                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.05,
                      delay: baseDelay,
                    }}
                    style={{
                      color: letter.color,
                      display: "inline-block",
                      position: "relative",
                    }}
                  >
                    {/* Neon flash on the A */}
                    {isNeon && (
                      <motion.span
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          textShadow: "0 0 60px hsl(73 100% 50% / 0.8), 0 0 120px hsl(73 100% 50% / 0.4), 0 0 200px hsl(73 100% 50% / 0.2)",
                          color: "hsl(73 100% 50%)",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.3, 1, 0.6] }}
                        transition={{
                          duration: 0.6,
                          delay: baseDelay,
                          times: [0, 0.2, 0.4, 0.6, 1],
                        }}
                      >
                        {letter.char}
                      </motion.span>
                    )}
                    {/* Cursor blink after each letter */}
                    <motion.span
                      className="absolute -right-[2px] top-[5%] bottom-[5%] w-[3px]"
                      style={{ background: isNeon ? "hsl(73 100% 50%)" : "hsl(0 0% 80%)" }}
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.1, delay: baseDelay + 0.09 }}
                    />
                    <span style={{
                      textShadow: isNeon
                        ? "0 0 40px hsl(73 100% 50% / 0.35)"
                        : "0 4px 60px hsla(0,0%,0%,0.5)",
                    }}>
                      {letter.char}
                    </span>
                  </motion.span>
                );
              })}
              {/* Final blinking cursor */}
              <motion.span
                className="inline-block w-[3px] self-stretch ml-1"
                style={{ background: "hsl(73 100% 50%)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0, 1, 0] }}
                transition={{
                  duration: 1.2,
                  delay: 0.5 + BRAND_LETTERS.length * 0.09,
                  repeat: 2,
                }}
              />
            </div>

            {/* Main title */}
            <h1
              className="font-clash font-black text-foreground leading-[0.95] mt-2 text-center"
              style={{
                fontSize: "clamp(0.9rem, 2.5vw, 2.5rem)",
                letterSpacing: "0.04em",
                textShadow: "0 4px 60px hsla(0,0%,0%,0.5)",
              }}
            >
              {SITE.hero.titleLine1}{" "}
              <span
                style={{
                  color: "hsl(73 100% 50%)",
                  textShadow: "0 0 50px hsl(73 100% 50% / 0.25)",
                }}
              >
                {SITE.hero.titleAccent}
              </span>
            </h1>
          </motion.div>

          {/* Signature subtitle */}
          <motion.p
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 1, 0.3] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="font-outfit text-base md:text-lg max-w-xl mx-auto leading-relaxed mt-16"
            style={{
              color: "hsl(73 100% 50% / 0.7)",
              textShadow: "0 0 20px hsl(73 100% 50% / 0.3), 0 0 40px hsl(73 100% 50% / 0.1)",
              letterSpacing: "0.06em",
            }}
          >
            Agence d'influence spécialisée musique et marques.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03, boxShadow: "0 0 30px hsl(73 100% 50% / 0.25)" }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-full font-mono text-sm uppercase tracking-[0.15em] transition-all duration-300"
              style={{
                background: "hsl(73 100% 50%)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 20px hsl(73 100% 50% / 0.15), inset 0 1px 0 hsl(73 100% 70% / 0.3)",
              }}
            >
              {SITE.hero.ctaPrimary}
            </motion.a>
            <motion.a
              href="#poles"
              whileHover={{ scale: 1.03, borderColor: "hsl(73 100% 50% / 0.5)" }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-full font-mono text-sm uppercase tracking-[0.15em] transition-all duration-300"
              style={{
                background: "hsla(0,0%,100%,0.04)",
                backdropFilter: "blur(12px)",
                border: "1px solid hsla(0,0%,100%,0.12)",
                color: "hsla(0,0%,100%,0.7)",
              }}
            >
              {SITE.hero.ctaSecondary}
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.5em] text-foreground/25">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8"
            style={{ background: "linear-gradient(to bottom, hsl(73 100% 50% / 0.3), transparent)" }}
          />
        </motion.div>

        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 z-[3] pointer-events-none"
          style={{ background: "linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)" }}
        />
      </section>
    </>
  );
};

export default Hero;
