import { PORTFOLIO } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Portfolio = () => {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-[1400px] mx-auto">
        <p className="rv font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">Portfolio</p>
        <h2 className="rv font-clash text-3xl md:text-4xl font-bold text-foreground mb-10">
          Cas d'<span className="text-primary">étude</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {PORTFOLIO.map((item, i) => (
            <div
              key={i}
              className="rv rounded-xl border border-border bg-surface p-6 transition-all duration-500 hover:border-border-light"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-primary">{item.tag}</span>
              </div>
              <h3 className="font-clash font-semibold text-foreground text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{item.description}</p>
              <div className="grid grid-cols-3 gap-2">
                {item.metrics.map((m, j) => (
                  <div key={j} className="text-center p-2 rounded-lg bg-background border border-border">
                    <p className="font-clash font-bold text-primary text-lg">{m.value}</p>
                    <p className="font-mono text-[9px] text-muted-foreground uppercase">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
