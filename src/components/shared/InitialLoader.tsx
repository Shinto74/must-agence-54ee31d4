import { useState, useEffect } from "react";
import { SITE } from "@/lib/constants";

interface InitialLoaderProps {
  onComplete: () => void;
  theme?: "neon" | "gold";
}

const InitialLoader = ({ onComplete, theme = "neon" }: InitialLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const isGold = theme === "gold";

  // Color tokens based on theme
  const accent = isGold ? "43 55% 55%" : "var(--neon)";
  const bgColor = isGold ? "hsl(40 20% 97%)" : "hsl(var(--background))";
  const logo = isGold ? SITE.logoWhite : SITE.logoGreen;
  // For gold on light bg, use a tinted logo filter
  const logoFilter = isGold
    ? "brightness(0) saturate(100%) sepia(1) hue-rotate(10deg) saturate(3) brightness(0.55)"
    : undefined;

  useEffect(() => {
    const start = Date.now();
    const duration = 2200;
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onComplete, 600);
        }, 300);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center transition-all duration-700 ${
        fadeOut ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
      style={{ background: bgColor }}
    >
      {/* Radial glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, hsl(${accent} / 0.06) 0%, transparent 55%)`,
        }}
      />

      {/* Ambient floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] rounded-full animate-pulse"
          style={{
            top: "20%",
            left: "10%",
            background: `radial-gradient(circle, hsl(${accent} / 0.04) 0%, transparent 70%)`,
            animationDuration: "4s",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full animate-pulse"
          style={{
            bottom: "15%",
            right: "10%",
            background: `radial-gradient(circle, hsl(${accent} / 0.03) 0%, transparent 70%)`,
            animationDuration: "5s",
            animationDelay: "1s",
          }}
        />
      </div>

      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-0 right-0 h-px opacity-[0.04]"
          style={{
            background: `linear-gradient(90deg, transparent, hsl(${accent}), transparent)`,
          }}
        />
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px opacity-[0.04]"
          style={{
            background: `linear-gradient(180deg, transparent, hsl(${accent}), transparent)`,
          }}
        />
      </div>

      {/* Logo with glow */}
      <div className="relative mb-10">
        <div
          className="absolute inset-0 blur-3xl scale-[2.5] opacity-30"
          style={{ background: `hsl(${accent} / 0.15)` }}
        />
        <img
          src={logo}
          alt={SITE.name}
          className="relative h-14 md:h-20 w-auto"
          style={{
            filter: logoFilter
              ? `${logoFilter} drop-shadow(0 0 30px hsl(${accent} / 0.4)) drop-shadow(0 0 60px hsl(${accent} / 0.15))`
              : `drop-shadow(0 0 30px hsl(${accent} / 0.4)) drop-shadow(0 0 60px hsl(${accent} / 0.15))`,
            animation: "loaderFloat 3s ease-in-out infinite",
          }}
        />
      </div>

      {/* Progress bar */}
      <div className="relative w-56 md:w-64">
        <div
          className="w-full h-[3px] rounded-full overflow-hidden"
          style={{ background: `hsl(${isGold ? "0 0% 10%" : "var(--foreground)"} / 0.06)` }}
        >
          <div
            className="h-full rounded-full transition-all duration-150 ease-out relative"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, hsl(${accent} / 0.5), hsl(${accent}))`,
              boxShadow: `0 0 20px hsl(${accent} / 0.5), 0 0 40px hsl(${accent} / 0.2)`,
            }}
          >
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{
                background: `hsl(${accent})`,
                boxShadow: `0 0 12px hsl(${accent} / 0.8), 0 0 24px hsl(${accent} / 0.4)`,
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center mt-4 gap-1">
          <span
            className="font-mono text-xs tabular-nums font-medium tracking-wider"
            style={{ color: `hsl(${accent} / 0.7)` }}
          >
            {progress}%
          </span>
        </div>
      </div>

      {/* Bottom tagline */}
      <p
        className="absolute bottom-8 font-mono text-[9px] uppercase tracking-[0.35em]"
        style={{
          color: `hsl(${isGold ? "0 0% 10%" : "var(--foreground)"} / 0.15)`,
          animation: "loaderPulse 2s ease-in-out infinite",
        }}
      >
        Must Agence
      </p>

      <style>{`
        @keyframes loaderFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes loaderPulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default InitialLoader;
