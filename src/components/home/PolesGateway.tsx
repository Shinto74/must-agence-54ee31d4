import { Link } from "react-router-dom";
import { SITE } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const PolesGateway = () => {
  const ref = useScrollReveal();

  const poles = [
    { ...SITE.poles.artiste, path: "/artiste", accent: "neon" },
    { ...SITE.poles.entreprise, path: "/entreprise", accent: "white" },
  ];

  return (
    <section id="poles" ref={ref} className="py-20 px-6">
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-6">
        {poles.map((pole) => (
          <Link
            key={pole.path}
            to={pole.path}
            className="rv group card-hover rounded-2xl border border-border bg-surface p-8 md:p-10"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{pole.tag}</span>
            <h3 className="font-clash text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">{pole.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">{pole.description}</p>
            <div className="flex flex-wrap gap-2">
              {pole.chips.map((chip) => (
                <span key={chip} className="px-3 py-1 rounded-full bg-background border border-border text-xs font-mono text-muted-foreground">
                  {chip}
                </span>
              ))}
            </div>
            <div className="absolute top-6 right-6 w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary transition-colors">
              →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PolesGateway;
