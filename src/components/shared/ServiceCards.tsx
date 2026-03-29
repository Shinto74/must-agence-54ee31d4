import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Service {
  number: string;
  title: string;
  description: string;
  chips: string[];
}

interface ServiceCardsProps {
  services: Service[];
  accentColor: "neon" | "white";
}

const ServiceCards = ({ services, accentColor }: ServiceCardsProps) => {
  const ref = useScrollReveal();
  const isNeon = accentColor === "neon";

  return (
    <section id="services" ref={ref} className="py-20 px-6">
      <div className="max-w-[1400px] mx-auto">
        <p className={`rv font-mono text-xs uppercase tracking-[0.2em] mb-2 ${isNeon ? "text-primary" : "text-foreground/70"}`}>
          Services
        </p>
        <h2 className="rv font-clash text-3xl md:text-4xl font-bold text-foreground mb-10">
          Ce qu'on <span className={isNeon ? "text-primary" : ""}>fait</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div
              key={svc.number}
              className="rv rounded-xl border border-border bg-surface p-6 transition-all duration-500 hover:border-border-light hover:-translate-y-1"
            >
              <span className={`font-mono text-xs ${isNeon ? "text-primary" : "text-foreground/50"}`}>
                {svc.number}.
              </span>
              <h3 className="font-clash font-semibold text-foreground text-lg mt-2 mb-3">{svc.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{svc.description}</p>
              <div className="flex flex-wrap gap-2">
                {svc.chips.map((chip) => (
                  <span
                    key={chip}
                    className="px-2.5 py-1 rounded-full bg-background border border-border text-[10px] font-mono text-muted-foreground"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
