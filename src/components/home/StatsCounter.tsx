import { useEffect, useRef, useState } from "react";

interface StatItem {
  value: string;
  label: string;
  suffix: string;
}

interface StatsCounterProps {
  items: StatItem[];
  accentColor?: "neon" | "white";
}

const AnimatedNumber = ({ target, suffix }: { target: number; suffix: string }) => {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1500;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-clash font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
      {current}
      <span className="text-primary">{suffix}</span>
    </span>
  );
};

const StatsCounter = ({ items, accentColor = "neon" }: StatsCounterProps) => (
  <section className="py-20 px-6">
    <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
      {items.map((item, i) => (
        <div key={i} className="text-center">
          <div className={accentColor === "white" ? "text-foreground" : ""}>
            <AnimatedNumber target={parseInt(item.value)} suffix={item.suffix} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground font-outfit">{item.label}</p>
        </div>
      ))}
    </div>
  </section>
);

export default StatsCounter;
