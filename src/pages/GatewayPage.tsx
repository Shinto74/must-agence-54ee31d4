import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";

type Side = "artiste" | "entreprise" | null;

const IMG_ARTISTE =
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=80";
const IMG_ENTREPRISE =
  "https://images.unsplash.com/photo-1637137467932-844c5736adc3?w=1400&q=80";

const GatewayPage = () => {
  const [hovered, setHovered] = useState<Side>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 bg-background text-foreground overflow-hidden select-none">
      <div className="relative h-full w-full flex flex-col md:flex-row">
        {/* TOP/LEFT — Artiste */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden cursor-pointer group"
          style={{
            flex: hovered === "artiste" ? 1.4 : hovered === "entreprise" ? 0.6 : 1,
            transition: "flex 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
          onMouseEnter={() => setHovered("artiste")}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="absolute inset-0">
            <img
              src={IMG_ARTISTE}
              alt="Artiste"
              className="w-full h-full object-cover"
              style={{
                opacity: hovered === "artiste" ? 0.55 : 0.3,
                transform: hovered === "artiste" ? "scale(1.08)" : "scale(1)",
                transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at 50% 60%, rgba(204,255,0,0.08) 0%, transparent 60%)",
                opacity: hovered === "artiste" ? 1 : 0,
                transition: "opacity 0.6s ease",
              }}
            />
          </div>

          <Link
            to="/artiste"
            className="relative z-10 h-full flex flex-col items-center text-center justify-end pb-8 px-6 md:items-start md:text-left md:pb-[16vh] md:px-14"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="font-clash font-black text-3xl md:text-5xl lg:text-6xl tracking-tight text-foreground mb-2 md:mb-3"
            >
              Pôle Artiste
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="font-outfit text-xs md:text-sm text-foreground/40 mb-5 md:mb-8 max-w-xs"
            >
              Musique · Influence · Lancement
            </motion.p>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="inline-flex items-center gap-3 px-7 py-3 md:px-8 md:py-3.5 rounded-full font-mono text-xs md:text-sm uppercase tracking-[0.12em]"
              style={{
                background: "hsl(73 100% 50%)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: hovered === "artiste"
                  ? "0 0 40px rgba(204,255,0,0.35)"
                  : "0 0 15px rgba(204,255,0,0.1)",
                transform: hovered === "artiste" ? "scale(1.05)" : "scale(1)",
                transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              Je suis un Artiste
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </motion.div>

        {/* ── Central brand strip ── */}
        <div className="relative z-40 flex items-center justify-center py-5 md:py-0 md:w-0 shrink-0">
          <div
            className="absolute inset-0 md:hidden"
            style={{ background: "hsl(var(--background))" }}
          />
          <div
            className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-px h-full"
            style={{
              background: "linear-gradient(to bottom, transparent 10%, rgba(204,255,0,0.15) 50%, transparent 90%)",
            }}
          />

          <div className="relative z-10 flex items-center gap-3 md:flex-col md:gap-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-12 h-12 md:w-24 md:h-24"
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: `1.5px solid ${hovered === "entreprise" ? "rgba(255,255,255,0.45)" : "rgba(204,255,0,0.45)"}`,
                  boxShadow: hovered === "entreprise"
                    ? "0 0 30px rgba(255,255,255,0.12)"
                    : "0 0 30px rgba(204,255,0,0.15)",
                  background: hovered === "entreprise"
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(204,255,0,0.04)",
                  transition: "all 0.5s ease",
                }}
              />
              <img
                src={SITE.logoGreen}
                alt={SITE.name}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-7 md:h-14 w-auto"
                style={{ opacity: hovered === "entreprise" ? 0 : 1, transition: "opacity 0.4s ease" }}
              />
              <img
                src={SITE.logoWhite}
                alt={SITE.name}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-7 md:h-14 w-auto"
                style={{ opacity: hovered === "entreprise" ? 1 : 0, transition: "opacity 0.4s ease" }}
              />
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-clash font-black text-base md:text-2xl tracking-[0.12em] uppercase"
              style={{
                color: hovered === "entreprise" ? "rgba(255,255,255,0.9)" : "hsl(73 100% 50%)",
                textShadow: hovered === "entreprise"
                  ? "0 0 30px rgba(255,255,255,0.15)"
                  : "0 0 30px rgba(204,255,0,0.2)",
                transition: "color 0.5s ease, text-shadow 0.5s ease",
              }}
            >
              MUST AGENCE
            </motion.span>
          </div>
        </div>

        {/* BOTTOM/RIGHT — Entreprise */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden cursor-pointer group"
          style={{
            flex: hovered === "entreprise" ? 1.4 : hovered === "artiste" ? 0.6 : 1,
            transition: "flex 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
          onMouseEnter={() => setHovered("entreprise")}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="absolute inset-0">
            <img
              src={IMG_ENTREPRISE}
              alt="Entreprise"
              className="w-full h-full object-cover"
              style={{
                opacity: hovered === "entreprise" ? 0.5 : 0.35,
                transform: hovered === "entreprise" ? "scale(1.08)" : "scale(1)",
                filter: hovered === "entreprise" ? "grayscale(0%)" : "grayscale(70%)",
                transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-background/80 via-transparent to-background/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at 50% 60%, rgba(255,255,255,0.05) 0%, transparent 60%)",
                opacity: hovered === "entreprise" ? 1 : 0,
                transition: "opacity 0.6s ease",
              }}
            />
          </div>

          <Link
            to="/entreprise"
            className="relative z-10 h-full flex flex-col items-center text-center justify-center px-6 md:items-end md:text-right md:justify-end md:pb-[16vh] md:px-14"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="font-clash font-black text-3xl md:text-5xl lg:text-6xl tracking-tight text-foreground mb-2 md:mb-3"
            >
              Pôle Entreprise
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="font-outfit text-xs md:text-sm text-foreground/40 mb-5 md:mb-8 max-w-xs"
            >
              Influence · Growth · Branding
            </motion.p>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="inline-flex items-center gap-3 px-7 py-3 md:px-8 md:py-3.5 rounded-full font-mono text-xs md:text-sm uppercase tracking-[0.12em]"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.8)",
                boxShadow: hovered === "entreprise"
                  ? "0 0 30px rgba(255,255,255,0.12)"
                  : "none",
                transform: hovered === "entreprise" ? "scale(1.05)" : "scale(1)",
                transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              Je suis une Entreprise
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {/* ── Bottom bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 md:bottom-6 left-0 right-0 z-50 flex items-center justify-center"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-foreground/20">
          Influence · Musique · Marques
        </span>
      </motion.div>
    </div>
  );
};

export default GatewayPage;
