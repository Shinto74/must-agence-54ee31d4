import { useState, useEffect } from "react";
import { SITE } from "@/lib/constants";

const InitialLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let start = Date.now();
    const duration = 1800;
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onComplete, 500);
        }, 200);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src={SITE.logoGreen}
        alt={SITE.name}
        className="h-12 md:h-16 w-auto mb-8 animate-pulse"
      />
      <div className="w-48 h-[2px] bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-neon rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="mt-3 font-mono text-xs text-text-sm tabular-nums">
        {progress}%
      </span>
    </div>
  );
};

export default InitialLoader;
