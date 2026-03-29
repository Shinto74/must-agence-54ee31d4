import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface QuoteOption {
  label: string;
  icon: string;
}

interface QuoteStep {
  title: string;
  question: string;
  type: "radio" | "textarea" | "date" | "checkbox";
  options?: QuoteOption[];
  placeholder?: string;
}

interface QuoteWizardProps {
  steps: QuoteStep[];
}

const QuoteWizard = ({ steps }: QuoteWizardProps) => {
  const ref = useScrollReveal();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [shake, setShake] = useState(false);
  const [done, setDone] = useState(false);

  const step = steps[current];

  const validate = () => {
    const val = answers[current];
    if (!val || (Array.isArray(val) && val.length === 0) || val === "") return false;
    return true;
  };

  const next = () => {
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    } else {
      setDone(true);
    }
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const setAnswer = (val: any) => {
    setAnswers({ ...answers, [current]: val });
  };

  if (done) {
    return (
      <section ref={ref} id="devis" className="py-20 px-6">
        <div className="rv max-w-[600px] mx-auto text-center animate-fadeSlide">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="font-clash text-2xl font-bold text-foreground mb-2">Demande envoyée !</h3>
          <p className="text-muted-foreground">On revient vers vous en 24h maximum.</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="devis" className="py-20 px-6">
      <div className="max-w-[600px] mx-auto">
        <p className="rv font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">Devis personnalisé</p>
        <h2 className="rv font-clash text-3xl font-bold text-foreground mb-8">
          Construisons votre <span className="text-primary">stratégie</span> ensemble.
        </h2>

        {/* Progress bar */}
        <div className="rv flex gap-1 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= current ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div className={`animate-fadeSlide ${shake ? "animate-shake" : ""}`} key={current}>
          <p className="font-mono text-xs text-primary uppercase tracking-wider mb-1">
            {step.title}
          </p>
          <h3 className="font-clash text-xl font-semibold text-foreground mb-6">{step.question}</h3>

          {step.type === "radio" && step.options && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {step.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setAnswer(opt.label)}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                    answers[current] === opt.label
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-surface text-muted-foreground hover:border-border-light"
                  }`}
                >
                  <span className="text-2xl block mb-2">{opt.icon}</span>
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          )}

          {step.type === "textarea" && (
            <textarea
              value={answers[current] || ""}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={step.placeholder}
              rows={4}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary/40 resize-none"
            />
          )}

          {step.type === "date" && (
            <input
              type="date"
              value={answers[current] || ""}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/40"
            />
          )}

          {step.type === "checkbox" && step.options && (
            <div className="grid grid-cols-2 gap-3">
              {step.options.map((opt) => {
                const selected = (answers[current] || []) as string[];
                const isSelected = selected.includes(opt.label);
                return (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setAnswer(
                        isSelected
                          ? selected.filter((s) => s !== opt.label)
                          : [...selected, opt.label]
                      );
                    }}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                      isSelected
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-surface text-muted-foreground hover:border-border-light"
                    }`}
                  >
                    <span className="text-2xl block mb-2">{opt.icon}</span>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          {current > 0 && (
            <button
              onClick={prev}
              className="px-6 py-3 rounded-pill border border-border text-foreground font-mono text-sm uppercase tracking-wider hover:border-border-light transition-all duration-300"
            >
              Retour
            </button>
          )}
          <button
            onClick={next}
            className="flex-1 py-3 rounded-pill bg-primary text-primary-foreground font-mono text-sm uppercase tracking-wider hover:brightness-110 transition-all duration-300"
          >
            {current === steps.length - 1 ? "Envoyer ma demande" : "Continuer"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuoteWizard;
