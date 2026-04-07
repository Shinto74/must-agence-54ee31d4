import { useScrollReveal } from "@/hooks/useScrollReveal";

interface CtaBandProps {
  title: string;
  subtitle: string;
  button: string;
}

const CtaBand = ({ title, subtitle, button }: CtaBandProps) => {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="py-24 px-6">
      <div
        className="rv max-w-[1400px] mx-auto relative rounded-2xl border border-primary/20 p-12 md:p-20 text-center overflow-hidden group"
      >
        {/* Background gradient layers */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 100%, hsl(var(--neon) / 0.10) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: "radial-gradient(ellipse 50% 50% at 50% 50%, hsl(var(--neon) / 0.08) 0%, transparent 55%)",
          }}
        />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <h2 className="font-clash text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">{title}</h2>
          <p className="text-muted-foreground mb-10 text-base md:text-lg max-w-lg mx-auto">{subtitle}</p>
          <a
            href="#contact"
            className="inline-block px-10 py-4 rounded-pill bg-primary text-primary-foreground font-mono text-sm uppercase tracking-wider hover:brightness-110 hover:shadow-[0_0_30px_hsl(var(--neon)/0.4)] transition-all duration-400"
          >
            {button}
          </a>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-primary/20" />
        <div className="absolute top-4 right-4 w-4 h-4 border-r border-t border-primary/20" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-l border-b border-primary/20" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-primary/20" />
      </div>
    </section>
  );
};

export default CtaBand;
