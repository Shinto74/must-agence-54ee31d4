import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);
  const [label, setLabel] = useState("");
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname === prevPathRef.current) {
      setDisplayChildren(children);
      return;
    }
    const prev = prevPathRef.current;
    prevPathRef.current = location.pathname;

    // Determine label
    if (location.pathname === "/artiste") setLabel("Pôle Artiste");
    else if (location.pathname === "/entreprise") setLabel("Pôle Entreprise");
    else if (location.pathname === "/") setLabel("Must Agence");
    else setLabel("");

    setTransitioning(true);

    // Swap content mid-transition
    setTimeout(() => {
      setDisplayChildren(children);
      window.scrollTo(0, 0);
    }, 600);

    // End transition
    setTimeout(() => {
      setTransitioning(false);
    }, 1200);
  }, [children, location.pathname]);

  return (
    <div className="relative">
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Panels sliding in */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "hsl(var(--background))" }}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              exit={{ clipPath: "inset(0 0 0 100%)" }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            />

            {/* Neon line sweep */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px] z-10"
              style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--neon)) 50%, transparent 100%)" }}
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Center content */}
            <motion.div
              className="relative z-10 flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Animated dot */}
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{
                  background: "hsl(var(--neon))",
                  boxShadow: "0 0 20px hsl(var(--neon) / 0.5), 0 0 60px hsl(var(--neon) / 0.2)",
                }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 0.8, repeat: 1, ease: "easeInOut" }}
              />

              {label && (
                <motion.span
                  className="font-clash text-xl md:text-2xl font-bold tracking-wider uppercase"
                  style={{ color: "hsl(var(--foreground))" }}
                  initial={{ opacity: 0, letterSpacing: "0.5em" }}
                  animate={{ opacity: 1, letterSpacing: "0.15em" }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  {label}
                </motion.span>
              )}

              {/* Subtle line under */}
              <motion.div
                className="h-px w-16"
                style={{ background: "hsl(var(--neon) / 0.4)" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              />
            </motion.div>

            {/* Bottom neon line sweep (reverse) */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[2px] z-10"
              style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--neon) / 0.5) 50%, transparent 100%)" }}
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
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