import { useScrollReveal } from "@/hooks/useScrollReveal";

interface CtaBandProps {
  title: string;
  subtitle: string;
  button: string;
}

const CtaBand = ({ title, subtitle, button }: CtaBandProps) => {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="rv max-w-[1400px] mx-auto rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-10 md:p-16 text-center">
        <h2 className="font-clash text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
        <p className="text-muted-foreground mb-8">{subtitle}</p>
        <a
          href="#contact"
          className="inline-block px-8 py-3.5 rounded-pill bg-primary text-primary-foreground font-mono text-sm uppercase tracking-wider hover:brightness-110 transition-all duration-300"
        >
          {button}
        </a>
      </div>
    </section>
  );
};

export default CtaBand;
