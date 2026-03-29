import { SITE } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Vision = () => {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-[900px] mx-auto text-center">
        <p className="rv font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">
          {SITE.vision.label}
        </p>
        <h2 className="rv font-clash text-3xl md:text-5xl font-bold text-foreground leading-tight mb-8">
          {SITE.vision.titleLine1} <span className="text-primary">{SITE.vision.titleLine2}</span>
        </h2>
        <blockquote className="rv border-l-2 border-primary pl-6 text-left mb-8">
          <p className="text-lg md:text-xl text-foreground/90 italic leading-relaxed">
            "{SITE.vision.quote}"
          </p>
        </blockquote>
        <p className="rv text-muted-foreground leading-relaxed text-sm md:text-base">
          {SITE.vision.text}
        </p>
        <img src={SITE.logoGreen} alt={SITE.name} className="rv mx-auto mt-10 h-10 w-auto opacity-60" />
      </div>
    </section>
  );
};

export default Vision;
