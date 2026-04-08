import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);
  const [label, setLabel] = useState("");
  const [isArtiste, setIsArtiste] = useState(true);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname === prevPathRef.current) {
      setDisplayChildren(children);
      return;
    }
    prevPathRef.current = location.pathname;

    if (location.pathname === "/artiste") { setLabel("Pôle Artiste"); setIsArtiste(true); }
    else if (location.pathname === "/entreprise") { setLabel("Pôle Entreprise"); setIsArtiste(false); }
    else if (location.pathname === "/") { setLabel("Must Agence"); setIsArtiste(true); }
    else { setLabel(""); setIsArtiste(true); }

    setTransitioning(true);
    setTimeout(() => { setDisplayChildren(children); window.scrollTo(0, 0); }, 650);
    setTimeout(() => setTransitioning(false), 1350);
  }, [children, location.pathname]);

  return (
    <div className="relative">
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Main panel wipe */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: isArtiste
                  ? "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(73 20% 8%) 50%, hsl(var(--background)) 100%)"
                  : "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(0 0% 10%) 50%, hsl(var(--background)) 100%)",
              }}
              initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
              animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
              exit={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            />

            {/* Ambient glow */}
            <motion.div
              className="absolute inset-0 z-[1]"
              style={{
                background: isArtiste
                  ? "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(var(--neon) / 0.12) 0%, transparent 70%)"
                  : "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(0 0% 100% / 0.06) 0%, transparent 70%)",
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Diagonal neon slashes */}
            <motion.div
              className="absolute z-[2] w-[200%] h-[3px] -rotate-12"
              style={{
                background: isArtiste
                  ? "linear-gradient(90deg, transparent, hsl(var(--neon) / 0.6), hsl(var(--neon)), hsl(var(--neon) / 0.6), transparent)"
                  : "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.3), hsl(0 0% 100% / 0.6), hsl(0 0% 100% / 0.3), transparent)",
                top: "35%",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: "50%" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.div
              className="absolute z-[2] w-[200%] h-[1px] -rotate-12"
              style={{
                background: isArtiste
                  ? "linear-gradient(90deg, transparent, hsl(var(--neon) / 0.3), transparent)"
                  : "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.15), transparent)",
                top: "65%",
              }}
              initial={{ x: "100%" }}
              animate={{ x: "-50%" }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute z-[3] rounded-full"
                style={{
                  width: 4 + Math.random() * 4,
                  height: 4 + Math.random() * 4,
                  background: isArtiste ? "hsl(var(--neon))" : "hsl(0 0% 100% / 0.6)",
                  boxShadow: isArtiste
                    ? "0 0 12px hsl(var(--neon) / 0.6)"
                    : "0 0 12px hsl(0 0% 100% / 0.3)",
                  left: `${15 + i * 14}%`,
                  top: `${30 + (i % 3) * 20}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [0, -30 - i * 10] }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.06, ease: "easeOut" }}
              />
            ))}

            {/* Center content */}
            <motion.div
              className="relative z-10 flex flex-col items-center gap-5"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ duration: 0.45, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Pulsing ring */}
              <motion.div
                className="relative w-14 h-14 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: isArtiste ? "1.5px solid hsl(var(--neon) / 0.4)" : "1.5px solid hsl(0 0% 100% / 0.2)",
                  }}
                  animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                  transition={{ duration: 0.7, repeat: 1, ease: "easeOut" }}
                />
                <motion.div
                  className="w-4 h-4 rounded-full"
                  style={{
                    background: isArtiste ? "hsl(var(--neon))" : "hsl(0 0% 100% / 0.8)",
                    boxShadow: isArtiste
                      ? "0 0 25px hsl(var(--neon) / 0.6), 0 0 60px hsl(var(--neon) / 0.2)"
                      : "0 0 25px hsl(0 0% 100% / 0.3), 0 0 60px hsl(0 0% 100% / 0.1)",
                  }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.6, repeat: 1, ease: "easeInOut" }}
                />
              </motion.div>

              {/* Label */}
              {label && (
                <div className="flex flex-col items-center gap-2">
                  <motion.span
                    className="font-mono text-[9px] uppercase tracking-[0.4em]"
                    style={{ color: isArtiste ? "hsl(var(--neon) / 0.6)" : "hsl(0 0% 100% / 0.4)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Redirection
                  </motion.span>
                  <motion.span
                    className="font-clash text-2xl md:text-3xl font-black tracking-wider uppercase"
                    style={{
                      color: isArtiste ? "hsl(var(--neon))" : "hsl(var(--foreground))",
                      textShadow: isArtiste
                        ? "0 0 30px hsl(var(--neon) / 0.3)"
                        : "0 0 30px hsl(0 0% 100% / 0.1)",
                    }}
                    initial={{ opacity: 0, letterSpacing: "0.6em" }}
                    animate={{ opacity: 1, letterSpacing: "0.15em" }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                  >
                    {label}
                  </motion.span>
                </div>
              )}

              {/* Decorative line */}
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="h-px w-12"
                  style={{ background: isArtiste ? "hsl(var(--neon) / 0.3)" : "hsl(0 0% 100% / 0.15)" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                />
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: isArtiste ? "hsl(var(--neon) / 0.5)" : "hsl(0 0% 100% / 0.3)",
                  }}
                />
                <motion.div
                  className="h-px w-12"
                  style={{ background: isArtiste ? "hsl(var(--neon) / 0.3)" : "hsl(0 0% 100% / 0.15)" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                />
              </motion.div>
            </motion.div>

            {/* Corner accents */}
            <motion.div
              className="absolute top-8 left-8 z-[3]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div className="w-8 h-px" style={{ background: isArtiste ? "hsl(var(--neon) / 0.5)" : "hsl(0 0% 100% / 0.2)" }} />
              <div className="w-px h-8" style={{ background: isArtiste ? "hsl(var(--neon) / 0.5)" : "hsl(0 0% 100% / 0.2)" }} />
            </motion.div>
            <motion.div
              className="absolute bottom-8 right-8 z-[3] flex flex-col items-end"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <div className="w-8 h-px" style={{ background: isArtiste ? "hsl(var(--neon) / 0.5)" : "hsl(0 0% 100% / 0.2)" }} />
              <div className="w-px h-8 self-end" style={{ background: isArtiste ? "hsl(var(--neon) / 0.5)" : "hsl(0 0% 100% / 0.2)" }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {displayChildren}
      </motion.div>
    </div>
  );
};

export default PageTransition;