import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Pack {
  number: string;
  name: string;
  subtitle: string;
  price: string;
  priceSuffix: string;
  featured: boolean;
  badge: string;
  features: string[];
  bonus: string;
  reassurance: string;
}

interface PackCardsProps {
  packs: Pack[];
}

const PackCards = ({ packs }: PackCardsProps) => {
  const ref = useScrollReveal();
  const [activeTab, setActiveTab] = useState(1);

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-[1400px] mx-auto">
        <p className="rv font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">Nos offres</p>
        <h2 className="rv font-clash text-3xl md:text-4xl font-bold text-foreground mb-2">
          Choisissez la formule <span className="text-primary">adaptée à votre ambition.</span>
        </h2>

        {/* Mobile tabs */}
        <div className="rv flex gap-1 mt-6 mb-8 md:hidden bg-surface rounded-lg p-1">
          {packs.map((pack, i) => (
            <button
              key={pack.number}
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-2.5 rounded-md font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                activeTab === i
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {pack.number}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mt-10">
          {packs.map((pack) => (
            <PackCard key={pack.number} pack={pack} />
          ))}
        </div>

        {/* Mobile single card */}
        <div className="md:hidden animate-fadeSlide" key={activeTab}>
          <PackCard pack={packs[activeTab]} />
        </div>
      </div>
    </section>
  );
};

const PackCard = ({ pack }: { pack: Pack }) => (
  <div
    className={`relative rounded-2xl p-6 md:p-8 transition-all duration-500 hover:-translate-y-1.5 ${
      pack.featured
        ? "border-2 border-primary bg-gradient-to-b from-primary/5 to-surface hover:shadow-[0_0_40px_hsl(var(--neon)/0.15)]"
        : "border border-border bg-surface hover:border-border-light hover:shadow-[0_0_20px_hsl(var(--neon)/0.08)]"
    }`}
    style={{
      backgroundImage: pack.featured
        ? "radial-gradient(ellipse at top, hsl(73 100% 50% / 0.06), transparent 60%)"
        : undefined,
    }}
  >
    {pack.badge && (
      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-wider">
        {pack.badge}
      </span>
    )}

    <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">{pack.number}</p>
    <h3 className="font-clash text-2xl font-bold text-foreground mt-1">{pack.name}</h3>
    <p className="text-sm text-muted-foreground mt-2 mb-6 leading-relaxed">{pack.subtitle}</p>

    <div className="mb-6">
      <span className="font-clash text-4xl font-bold text-primary">{pack.price}</span>
      <span className="text-sm text-muted-foreground ml-1">{pack.priceSuffix}</span>
    </div>

    <ul className="space-y-2.5 mb-6">
      {pack.features.map((f, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
          <span className="text-primary mt-0.5 shrink-0">✓</span>
          {f}
        </li>
      ))}
    </ul>

    <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 mb-4">
      <p className="text-xs text-primary font-mono">🎁 {pack.bonus}</p>
    </div>

    <p className="text-[11px] text-muted-foreground italic mb-6">{pack.reassurance}</p>

    <a
      href="#contact"
      className={`block w-full text-center py-3 rounded-pill font-mono text-sm uppercase tracking-wider transition-all duration-300 ${
        pack.featured
          ? "bg-primary text-primary-foreground hover:brightness-110"
          : "border border-border text-foreground hover:border-primary/40 hover:text-primary"
      }`}
    >
      Nous contacter
    </a>
  </div>
);

export default PackCards;
