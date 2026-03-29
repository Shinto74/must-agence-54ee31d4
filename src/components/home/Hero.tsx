import { useRef, useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Hero = () => {
  const ref = useScrollReveal();
  const sectionRef = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x: cx, y: cy });
    };
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px] animate-orbFloat1"
        style={{
          transform: `translate(${mouse.x * -30}px, ${mouse.y * -20 + scrollY * 0.15}px)`,
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/8 blur-[100px] animate-orbFloat2"
        style={{
          transform: `translate(${mouse.x * 20}px, ${mouse.y * 25 + scrollY * 0.1}px)`,
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-[200px] h-[200px] rounded-full bg-primary/5 blur-[80px] animate-orbFloat3"
        style={{
          transform: `translate(${mouse.x * 15 - 100}px, ${mouse.y * -15 + scrollY * 0.08 - 100}px)`,
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <p className="rv font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6">
          {SITE.hero.label}
        </p>
        <h1 className="rv font-clash text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[0.95] mb-2">
          {SITE.hero.titleLine1}
          <br />
          <span className="text-primary">{SITE.hero.titleAccent}</span>
        </h1>
        <p className="rv mt-6 text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          {SITE.hero.subtitle}
        </p>
        <div className="rv mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="px-8 py-3.5 rounded-pill bg-primary text-primary-foreground font-mono text-sm uppercase tracking-wider hover:brightness-110 transition-all duration-300"
          >
            {SITE.hero.ctaPrimary}
          </a>
          <a
            href="#poles"
            className="px-8 py-3.5 rounded-pill border border-border text-foreground font-mono text-sm uppercase tracking-wider hover:border-primary/40 hover:text-primary transition-all duration-300"
          >
            {SITE.hero.ctaSecondary}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
