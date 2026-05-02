import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "cookie-consent";

type Consent = "all" | "essential" | null;

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY) as Consent;
      if (!stored) setOpen(true);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const choose = (value: Consent) => {
    if (value) localStorage.setItem(STORAGE_KEY, value);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[90]"
        >
          <div
            className="rounded-2xl p-5 backdrop-blur-xl"
            style={{
              background: "hsla(0,0%,8%,0.92)",
              border: "1px solid hsla(73,100%,50%,0.25)",
              boxShadow: "0 25px 60px -10px hsla(0,0%,0%,0.6), 0 0 40px hsla(73,100%,50%,0.08)",
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsla(73,100%,50%,0.12)", border: "1px solid hsla(73,100%,50%,0.3)" }}>
                <Cookie size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-clash font-bold text-foreground text-sm mb-1">Cookies & confidentialité</h3>
                <p className="text-foreground/70 text-xs leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience et mesurer l'audience. Vous pouvez accepter ou refuser à tout moment.{" "}
                  <Link to="/politique-cookies" className="text-primary underline">En savoir plus</Link>
                </p>
              </div>
              <button
                onClick={() => choose("essential")}
                className="text-foreground/40 hover:text-foreground/80 transition-colors"
                aria-label="Refuser et fermer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => choose("essential")}
                className="flex-1 px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all"
                style={{
                  background: "hsla(0,0%,100%,0.05)",
                  border: "1px solid hsla(0,0%,100%,0.1)",
                  color: "hsl(0 0% 80%)",
                }}
              >
                Refuser
              </button>
              <button
                onClick={() => choose("all")}
                className="flex-1 px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all"
                style={{
                  background: "hsl(73 100% 50%)",
                  color: "hsl(0 0% 4%)",
                  boxShadow: "0 0 20px hsla(73,100%,50%,0.25)",
                }}
              >
                Tout accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
