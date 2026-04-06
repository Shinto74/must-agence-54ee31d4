import { COMPANY_REFERENCES } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface CompanyReferencesProps {
  categories?: { name: string; clients: { name: string; logo: string }[] }[];
}

const LogoMarquee = ({ clients, direction }: { clients: { name: string; logo: string }[]; direction: "normal" | "reverse" }) => {
  const tripled = [...clients, ...clients, ...clients];
  return (
    <div className="overflow-hidden py-4">
      <div className={`flex gap-12 whitespace-nowrap ${direction === "reverse" ? "animate-mq-reverse" : "animate-mq"}`}>
        {tripled.map((c, i) => (
          <div key={`${c.name}-${i}`} className="flex items-center gap-3 shrink-0 group cursor-default">
            {c.logo && (
              <img src={c.logo} alt={c.name} className="h-8 w-auto grayscale opacity-40 transition-all duration-400 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.08]" loading="lazy" />
            )}
            <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-400">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CompanyReferences = ({ categories }: CompanyReferencesProps) => {
  const ref = useScrollReveal();
  const cats = categories || COMPANY_REFERENCES.categories;

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-[1400px] mx-auto mb-10">
        <p className="rv font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">{COMPANY_REFERENCES.label}</p>
        <h2 className="rv font-clash text-3xl md:text-4xl font-bold text-foreground">
          {COMPANY_REFERENCES.titleLine1} <br /><span className="text-primary">{COMPANY_REFERENCES.titleLine2}</span>
        </h2>
      </div>
      <div className="max-w-[1400px] mx-auto space-y-2">
        {cats.map((cat, i) => (
          <div key={cat.name} className="rv">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim mb-2 px-2">{cat.name}</p>
            <LogoMarquee clients={cat.clients} direction={i % 2 === 0 ? "normal" : "reverse"} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompanyReferences;
