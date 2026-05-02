import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Music, Megaphone, Palette, ListMusic, Zap, Users, PenTool, Newspaper, Search, Target, MessageCircle, Youtube, Info, X, BarChart3, Lightbulb, Rocket, TrendingUp, Network } from "lucide-react";
import QuoteWizard from "@/components/artiste/QuoteWizard";
import { usePackTooltips } from "@/hooks/useArtistePage";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import theartistIcon from "@/assets/theartist-icon.png";
import theartistTextLogo from "@/assets/theartist-text.png";

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
  quoteSteps?: any[];
}

const getFeatureIcon = (feature: string) => {
  // Pack 4 icones
  if (feature.startsWith("Diagnostic Complet")) return BarChart3;
  if (feature.startsWith("Stratégie Propriétaire")) return Lightbulb;
  if (feature.startsWith("Exécution Full-Stack")) return Rocket;
  if (feature.startsWith("Creative Direction")) return Palette;
  if (feature.startsWith("Reporting & Analytics")) return TrendingUp;
  if (feature.startsWith("Accès VIP War Room")) return Users;
  if (feature.startsWith("Réseau Partenaires")) return Network;
  // Pack 1-3 icones
  if (feature.startsWith("Promotion Playlisting") || feature.startsWith("Playlisting")) return Music;
  if (feature.startsWith("Pitch")) return Target;
  if (feature.startsWith("Ads") || feature.includes("« Pop-up »")) return Megaphone;
  if (feature.startsWith("DA &")) return Palette;
  if (feature.startsWith("YouTube")) return Youtube;
  if (feature.startsWith("Community")) return Users;
  if (feature.startsWith("Content Design")) return PenTool;
  if (feature.startsWith("Double Impact")) return Zap;
  if (feature.startsWith("Relations Presse")) return Newspaper;
  if (feature.startsWith("Accompagnement")) return MessageCircle;
  if (feature.startsWith("SEO")) return Search;
  return Zap;
};

/* ─── TOOLTIPS — chargés depuis la BDD via usePackTooltips() ─── */

/* ─── TOOLTIP PORTAIL ─── */
const FeatureTooltip = ({ text, triggerRef }: { text: string; triggerRef: React.RefObject<HTMLButtonElement> }) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 288;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    if (left < 8) left = 8;
    if (left + tooltipWidth > window.innerWidth - 8) left = window.innerWidth - tooltipWidth - 8;
    setPos({ top: rect.top - 8, left });
  }, [triggerRef]);

  return createPortal(
    <div
      className="fixed z-[9999] w-72 pointer-events-none"
      style={{ top: pos.top, left: pos.left, transform: "translateY(-100%)" }}
    >
      <div className="bg-surface border border-primary/40 rounded-xl p-4 text-xs text-foreground/90 leading-relaxed shadow-[0_0_30px_hsl(var(--neon)/0.08),0_8px_32px_rgba(0,0,0,0.6)]">
        {text}
        <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-surface border-r border-b border-primary/40 rotate-45" />
      </div>
    </div>,
    document.body
  );
};

/* ─── FEATURE ITEM ─── */
const FeatureItem = ({ feature, tooltip }: { feature: string; tooltip?: string }) => {
  const Icon = getFeatureIcon(feature);
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <li className="flex items-start gap-2.5 text-sm text-foreground/90">
      <Icon size={15} className="text-primary mt-0.5 shrink-0" />
      <span className="flex-1">{feature}</span>
      {tooltip && (
        <>
          <button
            ref={btnRef}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="text-primary/50 hover:text-primary transition-colors shrink-0 ml-1 mt-0.5"
            aria-label="Plus d'info"
          >
            <Info size={13} />
          </button>
          {open && <FeatureTooltip text={tooltip} triggerRef={btnRef} />}
        </>
      )}
    </li>
  );
};

/* ─── THEARTIST BONUS ─── */

const TheArtistBonus = ({ text }: { text: string }) => (
  <div className="rounded-lg mb-4 relative group/ta border border-primary/20 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_20px_hsl(var(--neon)/0.08)]">
    {/* Wrapper pour shimmer & gradient (clipped) */}
    <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.06] to-transparent -translate-x-full animate-[ta-shimmer_3s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.04] to-transparent" />
    </div>

    <div className="relative flex items-center gap-3 px-3 py-2.5">
      {/* Logo A with pulse glow */}
      <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0 border border-primary/15 animate-[ta-glow_2.5s_ease-in-out_infinite]">
        <img
          src={theartistIcon}
          alt="TheArtist"
          className="w-5 h-5"
          style={{ filter: "invert(1) drop-shadow(0 0 4px hsl(var(--neon) / 0.4))" }}
        />
      </div>
      
      {/* Text */}
      <div className="flex-1 min-w-0">
        <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-primary/50 block leading-none mb-1">Partenaire</span>
        <p className="text-[13px] font-bold text-primary font-clash leading-tight">{text}</p>
      </div>
      
      {/* Info — tooltip rendu via portal pour ne pas être clippé */}
      <TheArtistInfoTooltip />
    </div>
    
    <style>{`
      @keyframes ta-shimmer {
        0% { transform: translateX(-100%); }
        50%, 100% { transform: translateX(100%); }
      }
      @keyframes ta-glow {
        0%, 100% { box-shadow: 0 0 0px hsl(var(--neon) / 0); }
        50% { box-shadow: 0 0 12px hsl(var(--neon) / 0.2); }
      }
    `}</style>
  </div>
);

/* Tooltip TheArtist — rendu via portal pour échapper aux overflow:hidden */
const TheArtistInfoTooltip = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const tooltipWidth = 224; // w-56
    let left = rect.right - tooltipWidth;
    if (left < 8) left = 8;
    setPos({ top: rect.top - 8, left });
  }, [open]);

  return (
    <div className="relative shrink-0">
      <button
        ref={btnRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="w-6 h-6 rounded-full border border-primary/20 flex items-center justify-center text-primary/40 hover:text-primary hover:border-primary/50 transition-all duration-300 cursor-help"
        aria-label="Plus d'infos sur TheArtist"
      >
        <Info size={10} />
      </button>
      {open && createPortal(
        <div
          className="fixed z-[9999] w-56 pointer-events-none"
          style={{ top: pos.top, left: pos.left, transform: "translateY(-100%)" }}
        >
          <div className="bg-surface border border-primary/30 rounded-lg p-3 text-[11px] text-foreground/70 shadow-[0_8px_24px_rgba(0,0,0,0.5)] leading-relaxed">
            <p className="font-bold text-primary text-xs mb-1.5">TheArtist</p>
            <p>Réseau pro-social pour artistes. Portfolio, booking et messagerie pour développer votre carrière.</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

/* ─── PACK CARD ─── */
// Mapping pack → Stripe price lookup_key.
// On accepte plusieurs variantes (numéro, nom normalisé) pour rester tolérant
// si l'admin renomme un pack en BDD.
const PACK_PRICE_MAP: Record<string, string> = {
  "Pack 1": "essentiel_once",
  "Pack 2": "ascension_once",
  "Pack 3": "explosion_once",
  "L'ESSENTIEL": "essentiel_once",
  "L'ASCENSION": "ascension_once",
  "L'EXPLOSION": "explosion_once",
  "ESSENTIEL": "essentiel_once",
  "ASCENSION": "ascension_once",
  "EXPLOSION": "explosion_once",
};

const resolvePriceId = (pack: Pack): string | undefined =>
  PACK_PRICE_MAP[pack.number] ||
  PACK_PRICE_MAP[(pack.name || "").trim().toUpperCase()];

const PackCard = ({ pack, theartistText, onOpenQuote, tooltips }: { pack: Pack; theartistText: string; onOpenQuote?: () => void; tooltips: Record<string, string> }) => {
  const navigate = useNavigate();

  // Matching: trouve le tooltip dont la feature commence par la clé
  const getTooltip = (feature: string) => {
    for (const key of Object.keys(tooltips)) {
      if (feature.startsWith(key)) return tooltips[key];
    }
    return undefined;
  };

  const isQuotePack = pack.price === "Sur devis" || pack.number === "Pack 4" || !resolvePriceId(pack);

  return (
    <div
      className={`relative rounded-2xl p-6 md:p-8 transition-all duration-500 hover:-translate-y-1.5 group/pack flex flex-col h-full ${
        pack.featured
          ? "border-2 border-primary bg-gradient-to-b from-primary/5 to-surface hover:shadow-[0_0_50px_hsl(var(--neon)/0.25),0_0_100px_hsl(var(--neon)/0.1)]"
          : "border border-border bg-surface hover:border-primary/30 hover:shadow-[0_0_30px_hsl(var(--neon)/0.12),0_0_60px_hsl(var(--neon)/0.06)]"
      }`}
      style={{ backgroundImage: pack.featured ? "radial-gradient(ellipse at top, hsl(73 100% 50% / 0.08), transparent 60%)" : undefined }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.backgroundImage = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, hsl(73 100% 50% / ${pack.featured ? "0.1" : "0.06"}), transparent 60%)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundImage = pack.featured
          ? "radial-gradient(ellipse at top, hsl(73 100% 50% / 0.08), transparent 60%)"
          : "none";
      }}
    >
      {pack.badge && (
        <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-wider">
          {pack.badge}
        </span>
      )}
      <h3 className="font-clash text-2xl font-bold text-foreground">{pack.name}</h3>
      <p className="text-sm text-muted-foreground mt-2 mb-6 leading-relaxed">{pack.subtitle}</p>
      <div className="mb-6">
        <span className="font-clash text-4xl font-bold text-primary">{pack.price}</span>
        <span className="text-sm text-muted-foreground ml-1">{pack.priceSuffix}</span>
      </div>
      <ul className="space-y-2.5 mb-6 flex-1">
        {pack.features.map((f, i) => (
          <FeatureItem key={`${pack.name}-${i}-${f.slice(0, 20)}`} feature={f} tooltip={getTooltip(f)} />
        ))}
      </ul>
      <TheArtistBonus text={theartistText} />
      <p className="text-[11px] text-muted-foreground italic mb-6">{pack.reassurance}</p>
      {isQuotePack && onOpenQuote ? (
        <button onClick={onOpenQuote}
          className="block w-full text-center py-3 rounded-pill font-mono text-sm uppercase tracking-wider transition-all duration-300 border border-border text-foreground hover:border-primary/40 hover:text-primary"
        >
          Obtenir un devis
        </button>
      ) : (
        <button
          onClick={() => {
            const priceId = resolvePriceId(pack);
            if (priceId) navigate(`/checkout?pack=${priceId}`);
          }}
          className={`block w-full text-center py-3 rounded-pill font-mono text-sm uppercase tracking-wider transition-all duration-300 ${
            pack.featured
              ? "bg-primary text-primary-foreground hover:brightness-110"
              : "border border-border text-foreground hover:border-primary/40 hover:text-primary"
          }`}
        >
          Choisir ce pack
        </button>
      )}
    </div>
  );
};

/* ─── (DevisPersonnaliseCard supprimé : le pack "Devis sur mesure" est désormais 100% piloté par la BDD via le 4ème pack) ─── */

/* ─── MODALE ─── */
const QuoteModal = ({ steps, onClose }: { steps: any[]; onClose: () => void }) => {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} style={{ animation: "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface border border-border rounded-3xl shadow-2xl" style={{ animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 hover:bg-primary/10 rounded-lg transition-colors text-muted-foreground hover:text-primary">
          <X size={24} />
        </button>
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">Devis sur mesure</p>
            <h2 className="font-clash text-3xl font-bold text-foreground">
              Construisons votre <span className="text-primary">stratégie</span> ensemble.
            </h2>
          </div>
          <QuoteWizard steps={steps} onSubmitComplete={onClose} hideHeader />
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>,
    document.body
  );
};

/* ─── COMPOSANT PRINCIPAL ─── */
const PackCards = ({ packs = [], quoteSteps = [] }: PackCardsProps) => {
  const ref = useScrollReveal();
  const [activeTab, setActiveTab] = useState(0);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  const { data: rawPacks = [] } = useQuery({
    queryKey: ["packs_id_lookup"],
    queryFn: async () => {
      const { data, error } = await supabase.from("packs").select("id,display_order").order("display_order");
      if (error) throw error;
      return data || [];
    },
  });
  const { data: tooltipRows = [] } = usePackTooltips();

  // Map: pack.number ("Pack 1"…) -> { feature_prefix: tooltip_text }
  // pack.number est auto-généré "Pack {index+1}" via le hook usePacks
  const tooltipsByNumber = useMemo(() => {
    const out: Record<string, Record<string, string>> = {};
    (rawPacks as any[]).forEach((p, i) => {
      const key = `Pack ${i + 1}`;
      out[key] = {};
      (tooltipRows as any[])
        .filter((t) => t.pack_id === p.id)
        .forEach((t) => { out[key][t.feature_prefix] = t.tooltip_text; });
    });
    return out;
  }, [rawPacks, tooltipRows]);

  // Bonus TheArtist provient désormais du champ `bonus` de chaque pack en BDD (éditable depuis l'admin)
  const getTheArtistText = (pack: Pack) => (pack as any).bonus || "TheArtist offert";

  return (
    <>
      <section ref={ref} className="py-20 px-6">
        <div className="max-w-[1600px] mx-auto">
          <p className="rv font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">Nos offres</p>
          <h2 className="rv font-clash text-3xl md:text-4xl font-bold text-foreground mb-2">
            Choisissez la formule <span className="text-primary">adaptée à votre ambition.</span>
          </h2>

          {/* Mobile tabs */}
          <div className="rv flex gap-0 mt-6 mb-8 md:hidden bg-surface rounded-xl overflow-hidden border border-border flex-wrap">
            {packs.map((pack, i) => (
              <button key={pack.number} onClick={() => setActiveTab(i)}
                className={`flex-1 py-3 font-mono text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 ${
                  activeTab === i ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}>
                {pack.name}
              </button>
            ))}
          </div>

          {/* Desktop — flip 3D reveal one by one */}
          <div ref={gridRef} className="hidden md:grid md:grid-cols-4 gap-6 mt-10 items-stretch" style={{ perspective: "1200px" }}>
            {packs.map((pack, idx) => (
              <motion.div
                key={pack.number}
                className="h-full"
                initial={{ opacity: 0, rotateY: -90, scale: 0.85 }}
                animate={gridInView ? { opacity: 1, rotateY: 0, scale: 1 } : {}}
                transition={{
                  duration: 1.8,
                  delay: idx * 0.7,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
                style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
              >
                <PackCard pack={pack} theartistText={getTheArtistText(pack)} onOpenQuote={() => setShowQuoteModal(true)} tooltips={tooltipsByNumber[pack.number] || {}} />
              </motion.div>
            ))}
          </div>

          {/* Mobile */}
          <motion.div
            className="md:hidden"
            key={activeTab}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <PackCard pack={packs[activeTab]} theartistText={getTheArtistText(packs[activeTab])} onOpenQuote={() => setShowQuoteModal(true)} tooltips={tooltipsByNumber[packs[activeTab]?.number] || {}} />
          </motion.div>
        </div>
      </section>

      {showQuoteModal && <QuoteModal steps={quoteSteps} onClose={() => setShowQuoteModal(false)} />}
    </>
  );
};

export default PackCards;
