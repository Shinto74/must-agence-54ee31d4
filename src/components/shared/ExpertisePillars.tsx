import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ExpertiseItem {
  number?: string;
  title: string;
  text: string;
}

const pad2 = (n: number) => String(n).padStart(2, "0");


interface ExpertisePillarsProps {
  items: ExpertiseItem[];
  accentColor: "neon" | "white";
}

const ExpertisePillars = ({ items, accentColor }: ExpertisePillarsProps) => {
  const ref = useScrollReveal();
  const isNeon = accentColor === "neon";

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-[1400px] mx-auto">
        <p className={`rv font-mono text-xs uppercase tracking-[0.2em] mb-2 ${isNeon ? "text-primary" : "text-foreground/70"}`}>
          Expertise
        </p>
        <h2 className="rv font-clash text-3xl md:text-4xl font-bold text-foreground mb-10">
          Notre <span className={isNeon ? "text-primary" : ""}>approche</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={(item as any).id ?? i} className="rv card-hover rounded-xl border border-border bg-surface p-6 md:p-8">
              <span className={`font-mono text-xs ${isNeon ? "text-primary" : "text-foreground/50"}`}>
                {pad2(i + 1)}.
              </span>
              <h3 className="font-clash font-bold text-xl text-foreground mt-2 mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertisePillars;
