import { SITE } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSiteSettings } from "@/hooks/useSiteContent";

const Vision = () => {
  const ref = useScrollReveal();
  const { get } = useSiteSettings();

  const label = get("vision_kicker", SITE.vision.label);
  const titleLine1 = get("vision_title_line1", SITE.vision.titleLine1);
  const titleLine2 = get("vision_title_line2", SITE.vision.titleLine2);
  const quote = get("vision_quote", SITE.vision.quote);
  const text = get("vision_text", SITE.vision.text);

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-[1000px] mx-auto">
        {/* Label */}
        <p className="rv font-mono text-xs uppercase tracking-[0.2em] text-primary mb-6 text-center">
          {label}
        </p>

        {/* Titre */}
        <h2 className="rv font-clash text-3xl md:text-5xl font-bold text-foreground leading-tight mb-12 text-center">
          {titleLine1} <span className="text-primary">{titleLine2}</span>
        </h2>

        {/* Citation — carte premium */}
        <div className="rv relative rounded-2xl border border-border bg-surface p-8 md:p-12 mb-10 overflow-hidden group">
          {/* Halo décoratif */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: "radial-gradient(ellipse 60% 50% at 30% 50%, hsl(var(--neon) / 0.06) 0%, transparent 60%)",
            }}
          />

          {/* Guillemet géant décoratif — très subtil pour ne pas gêner la lecture */}
          <div
            className="absolute top-4 left-6 font-clash font-black text-primary/[0.03] select-none pointer-events-none hidden md:block"
            style={{ fontSize: "clamp(6rem, 10vw, 10rem)", lineHeight: 0.8 }}
          >
            "
          </div>

          {/* Ligne accent top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="relative z-10">
            <blockquote className="border-l-2 border-primary pl-6 md:pl-8">
              <p className="text-lg md:text-2xl text-foreground/90 italic leading-relaxed font-clash font-light">
                "{SITE.vision.quote}"
              </p>
            </blockquote>
          </div>
        </div>

        {/* Texte explicatif */}
        <p className="rv text-muted-foreground leading-relaxed text-sm md:text-base text-center max-w-[700px] mx-auto mb-10">
          {SITE.vision.text}
        </p>

        {/* Logo signature */}
        <div className="rv flex items-center justify-center gap-3">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/30" />
          <img src={SITE.logoGreen} alt={SITE.name} className="h-8 w-auto opacity-50" />
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-primary/30" />
        </div>
      </div>
    </section>
  );
};

export default Vision;
