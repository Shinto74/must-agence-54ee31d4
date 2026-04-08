import { useState, useEffect } from "react";
import { SITE } from "@/lib/constants";

const InitialLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

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
      style={{
        background: "hsl(var(--background))",
      }}
    >
      {/* Ambient floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] rounded-full animate-pulse"
          style={{
            top: "20%", left: "10%",
            background: "radial-gradient(circle, hsl(var(--neon) / 0.04) 0%, transparent 70%)",
            animationDuration: "4s",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full animate-pulse"
          style={{
            bottom: "15%", right: "10%",
            background: "radial-gradient(circle, hsl(var(--neon) / 0.03) 0%, transparent 70%)",
            animationDuration: "5s",
            animationDelay: "1s",
          }}
        />
      </div>

      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Horizontal line */}
        <div
          className="absolute top-1/2 left-0 right-0 h-px opacity-[0.04]"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--neon)), transparent)" }}
        />
        {/* Vertical line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px opacity-[0.04]"
          style={{ background: "linear-gradient(180deg, transparent, hsl(var(--neon)), transparent)" }}
        />
      </div>

      {/* Logo with glow */}
      <div className="relative mb-10">
        {/* Glow behind logo */}
        <div
          className="absolute inset-0 blur-3xl scale-[2.5] opacity-30"
          style={{ background: "hsl(var(--neon) / 0.15)" }}
        />
        <img
          src={SITE.logoGreen}
          alt={SITE.name}
          className="relative h-14 md:h-20 w-auto"
          style={{
            filter: `drop-shadow(0 0 30px hsl(var(--neon) / 0.4)) drop-shadow(0 0 60px hsl(var(--neon) / 0.15))`,
            animation: "loaderFloat 3s ease-in-out infinite",
          }}
        />
      </div>

      {/* Progress bar */}
      <div className="relative w-56 md:w-64">
        {/* Track */}
        <div
          className="w-full h-[3px] rounded-full overflow-hidden"
          style={{ background: "hsl(var(--foreground) / 0.06)" }}
        >
          {/* Fill */}
          <div
            className="h-full rounded-full transition-all duration-150 ease-out relative"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, hsl(var(--neon) / 0.5), hsl(var(--neon)))",
              boxShadow: "0 0 20px hsl(var(--neon) / 0.5), 0 0 40px hsl(var(--neon) / 0.2)",
            }}
          >
            {/* Bright tip */}
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{
                background: "hsl(var(--neon))",
                boxShadow: "0 0 12px hsl(var(--neon) / 0.8), 0 0 24px hsl(var(--neon) / 0.4)",
              }}
            />
          </div>
        </div>

        {/* Percentage */}
        <div className="flex items-center justify-center mt-4 gap-1">
          <span
            className="font-mono text-xs tabular-nums font-medium tracking-wider"
            style={{ color: "hsl(var(--neon) / 0.7)" }}
          >
            {progress}%
          </span>
        </div>
      </div>

      {/* Bottom tagline */}
      <p
        className="absolute bottom-8 font-mono text-[9px] uppercase tracking-[0.35em]"
        style={{
          color: "hsl(var(--foreground) / 0.15)",
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
