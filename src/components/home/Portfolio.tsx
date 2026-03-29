import { PORTFOLIO } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { TrendingUp, Eye, Users, Play, BarChart3, Award } from "lucide-react";

interface PortfolioItem {
  icon: string;
  tag: string;
  title: string;
  description: string;
  metrics: { value: string; label: string }[];
}

interface PortfolioProps {
  items?: PortfolioItem[];
}

const metricIcons: Record<string, React.ReactNode> = {
  vues: <Eye className="w-4 h-4 text-primary" />,
  reach: <Users className="w-4 h-4 text-primary" />,
  engagement: <TrendingUp className="w-4 h-4 text-primary" />,
  roi: <BarChart3 className="w-4 h-4 text-primary" />,
};

const Portfolio = ({ items }: PortfolioProps) => {
  const ref = useScrollReveal();
  const data = items || PORTFOLIO;

  return (
    <section ref={ref} className="py-24 px-6 relative overflow-hidden">
      {/* Subtle glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
          <div>
            <p className="rv font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">
              Portfolio
            </p>
            <h2 className="rv font-clash text-3xl md:text-5xl font-bold text-foreground">
              Résultats de nos <span className="text-primary">campagnes</span>
            </h2>
          </div>
          <p className="rv text-sm text-muted-foreground max-w-md">
            Stats réelles de campagnes, performances d'influence et résultats concrets pour nos artistes et nos marques.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {data.map((item, i) => (
            <div
              key={i}
              className="rv group rounded-2xl border border-border bg-card p-7 transition-all duration-500 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_8px_40px_hsl(var(--primary)/0.08)]"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary bg-primary/5 px-2 py-1 rounded-full">
                  {item.tag}
                </span>
              </div>

              <h3 className="font-clash font-semibold text-foreground text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-7">
                {item.description}
              </p>

              {/* Metrics as horizontal bar-style indicators */}
              <div className="space-y-3">
                {item.metrics.map((m, j) => (
                  <div key={j} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {metricIcons[m.label.toLowerCase()] || <Award className="w-4 h-4 text-primary" />}
                      <span className="font-mono text-[10px] text-muted-foreground uppercase truncate">
                        {m.label}
                      </span>
                    </div>
                    <span className="font-clash font-bold text-primary text-lg whitespace-nowrap">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Showreel CTA */}
        <div className="rv mt-14 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full border-2 border-primary/30 flex items-center justify-center mb-4 group cursor-pointer hover:border-primary hover:bg-primary/10 transition-all duration-300">
            <Play className="w-8 h-8 text-primary ml-1 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-clash text-lg font-semibold text-foreground mb-1">
            Découvrir notre showreel
          </p>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Nos meilleures réalisations en vidéo
          </p>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
