import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Step {
  number: string;
  title: string;
  text: string;
}

interface ProcessStepsProps {
  steps: Step[];
  accentColor: "neon" | "white";
}

const ProcessSteps = ({ steps, accentColor }: ProcessStepsProps) => {
  const ref = useScrollReveal();
  const isNeon = accentColor === "neon";

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-[1400px] mx-auto">
        <p className={`rv font-mono text-xs uppercase tracking-[0.2em] mb-2 ${isNeon ? "text-primary" : "text-foreground/70"}`}>
          Processus
        </p>
        <h2 className="rv font-clash text-3xl md:text-4xl font-bold text-foreground mb-10">
          Notre <span className={isNeon ? "text-primary" : ""}>méthode</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.number} className="rv relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-border -translate-x-4" />
              )}
              <div className="card-hover rounded-xl border border-border bg-surface p-6">
                <span className={`font-clash text-3xl font-bold ${isNeon ? "text-primary/30" : "text-foreground/10"}`}>
                  {step.number}
                </span>
                <h3 className="font-clash font-semibold text-foreground text-lg mt-2 mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
