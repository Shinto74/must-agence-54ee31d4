import { SITE } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Hero = () => {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/8 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />

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
