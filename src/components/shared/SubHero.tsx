import { useScrollReveal } from "@/hooks/useScrollReveal";

interface SubHeroProps {
  logo: string;
  tag: string;
  titleLine1: string;
  titleAccent: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  accentColor: "neon" | "white";
}

const SubHero = ({ logo, tag, titleLine1, titleAccent, description, ctaPrimary, ctaSecondary, accentColor }: SubHeroProps) => {
  const ref = useScrollReveal();
  const isNeon = accentColor === "neon";

  return (
    <section ref={ref} className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden">
      {isNeon && (
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/8 blur-[100px]" />
      )}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-20">
        <img src={logo} alt="Must Agence" className="rv h-10 w-auto mb-6" />
        <span className={`rv font-mono text-xs uppercase tracking-[0.2em] ${isNeon ? "text-primary" : "text-foreground/70"}`}>
          {tag}
        </span>
        <h1 className="rv font-clash text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[0.95] mt-4 mb-6">
          {titleLine1} <br />
          <span className={isNeon ? "text-primary" : "text-foreground"}>{titleAccent}</span>
        </h1>
        <p className="rv text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed mb-10">
          {description}
        </p>
        <div className="rv flex flex-col sm:flex-row gap-4">
          <a
            href="#contact"
            className={`px-8 py-3.5 rounded-pill font-mono text-sm uppercase tracking-wider transition-all duration-300 ${
              isNeon
                ? "bg-primary text-primary-foreground hover:brightness-110"
                : "bg-foreground text-background hover:bg-foreground/90"
            }`}
          >
            {ctaPrimary}
          </a>
          <a
            href="#services"
            className="px-8 py-3.5 rounded-pill border border-border text-foreground font-mono text-sm uppercase tracking-wider hover:border-border-light transition-all duration-300"
          >
            {ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
};

export default SubHero;
