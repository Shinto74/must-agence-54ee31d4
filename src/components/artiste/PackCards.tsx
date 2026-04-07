import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Music, Megaphone, Palette, ListMusic, Zap, Users, PenTool, Newspaper, Search, Target, MessageCircle, Youtube, Info, X, BarChart3, Lightbulb, Rocket, TrendingUp, Network } from "lucide-react";
import QuoteWizard from "@/components/artiste/QuoteWizard";

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

/* ─── TOOLTIPS — clés = début exact des feature strings ─── */
const TOOLTIPS: Record<string, Record<string, string>> = {
  "Pack 2": {
    "Playlisting Étendu": "Campagne massive auprès d'un réseau élargi de curateurs et playlists majeures. Notre équipe contacte directement les programmateurs musicaux pour placer votre titre sur les playlists les plus écoutées, maximisant votre visibilité et vos streams.",
    "Double Impact Publicitaire": "Promotion de 2 teasers publicitaires pour une visibilité omniprésente. Nous créons et diffusons deux campagnes publicitaires distinctes (teaser clip + teaser audio) sur tous les réseaux pour saturer votre audience et créer du buzz.",
    "Community Management (1 mois)": "Un CM dédié s'immerge dans votre projet pendant 1 mois pour animer et engager votre communauté. Réponses aux commentaires, création de contenu exclusif, interactions stratégiques pour maximiser l'engagement et fidéliser vos fans.",
    "Content Design": "Création de visuels de résultats professionnels (Stats playlists, certifications, caps franchis, milestones). Ces visuels shareable amplifient votre succès sur les réseaux et créent du contenu authentique pour votre communauté.",
  },
  "Pack 3": {
    "Pitch Éditorial": "Optimisation complète pour le Focus Track (Discover Weekly, Release Radar). Chaque métadonnée, tag et timing optimisé pour maximiser vos chances d'entrer dans les playlists officielles Spotify.",
    "Playlisting Long Terme": "Campagne poussée et suivie sur 3 mois consécutifs, pas juste au lancement. Nos curateurs continuent à placer votre musique avec ajustements en temps réel basés sur les performances. Durabilité garantie au-delà du day-one.",
    "YouTube & Google Ads": "Campagne publicitaire ultra-ciblée sur votre Clip Officiel avec ciblage par démographie, intérêts et comportement. Optimisation budget et placements pour maximiser ROI et engagement.",
    "Accompagnement VIP": "2 mois de Community Management intensif avec groupe WhatsApp personnalisé pour réactivité instantanée. Communication en temps réel 24/7 avec votre équipe dédiée.",
    "Relations Presse & Médias": "Campagne RP complète pendant 1 mois : pitches auprès de radios nationales, blogs spécialisés, magazines digitaux. Interviews et couverture presse pour asseoir votre légitimité.",
    "Ads Domination": "Teasers en rotation continue sur Meta (Facebook/Instagram), TikTok et Google avec redirection intelligente. Stratégie multi-plateforme synchronisée pour dominer le feed de votre audience cible.",
    "SEO Musique": "Référencement naturel optimisé sur toutes les plateformes de streaming (Spotify, Apple Music, YouTube Music). Bonnes catégories, métadonnées et algorithmes — trouvé naturellement sans dépenser en ads.",
  },
  "Pack 4": {
    "Diagnostic Complet (Deep Dive)": "Audit de votre marché, analyse concurrents, identification opportunités cachées. On plonge dans les données, on détecte les gaps, on bâtit sur vos forces.",
    "Stratégie Propriétaire": "Zéro off-the-shelf. Plan conçu 100% pour vous, itéré avec vous. Pas de template, juste votre solution unique.",
    "Exécution Full-Stack": "De la playlisting curée à l'influence seeding, en passant par Meta/Google/TikTok Ads synchronisés. Tous les leviers activés en harmonie.",
    "Creative Direction Personnalisée": "Visuel, narrative, storytelling — construire votre légende. Identité cohérente sur tous les fronts.",
    "Reporting & Analytics Temps Réel": "Dashboard propriétaire, insights hebdomadaires, pivot strategy quand nécessaire. Transparence totale, décisions data-driven.",
    "Accès VIP War Room": "Réunions bi-hebdomadaires, escalade rapide, décisions en 48h. Vous êtes dans notre équipe, pas juste un client.",
    "Réseau Partenaires Déverrouillé": "Booking haut de gamme, collaborations marques premium, opportunités business. Portes ouvertes sur l'écosystème Must Agence.",
  },
};

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
        <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#0f0f0f] border-r border-b border-primary/40 rotate-45" />
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
  <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 mb-4 relative group/tooltip">
    <div className="flex items-center gap-3">
      <img
        src="https://raw.githubusercontent.com/Shinto74/IMAGES/9f2ee390a2fc70de8832a1876b8802f6e46efd31/must-agence/logos/theartist.png"
        alt="TheArtiste"
        className="w-5 h-5 shrink-0"
      />
      <p className="text-xs text-primary font-mono flex-1">{text}</p>
      <button className="text-primary/60 hover:text-primary transition-colors shrink-0 cursor-help">
        <Info size={16} />
      </button>
    </div>
    {/* Tooltip TheArtiste */}
    <div className="absolute bottom-full right-0 mb-3 z-50 w-72 bg-surface border border-primary rounded-xl p-4 text-xs text-foreground shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 pointer-events-none">
      <div className="flex items-center gap-2 mb-3">
        <img src="https://raw.githubusercontent.com/Shinto74/IMAGES/9f2ee390a2fc70de8832a1876b8802f6e46efd31/must-agence/logos/theartist.png" alt="TheArtiste" className="w-5 h-5" />
        <strong className="text-primary text-sm">TheArtiste</strong>
      </div>
      <p className="leading-relaxed">Réseau pro-social pour artistes. Profil portfolio, fil d'actualité, booking et messagerie pour développer votre carrière artistique.</p>
      <div className="absolute -bottom-2 right-4 w-3 h-3 bg-surface border-r border-b border-primary transform rotate-45" />
    </div>
  </div>
);

/* ─── PACK CARD ─── */
const PackCard = ({ pack, theartistText, onOpenQuote }: { pack: Pack; theartistText: string; onOpenQuote?: () => void }) => {
  const packTooltips = TOOLTIPS[pack.number] || {};

  // Matching: trouve le tooltip dont la feature commence par la clé
  const getTooltip = (feature: string) => {
    for (const key of Object.keys(packTooltips)) {
      if (feature.startsWith(key)) return packTooltips[key];
    }
    return undefined;
  };

  const isQuotePack = pack.number === "Pack 4";

  return (
    <div
      className={`relative rounded-2xl p-6 md:p-8 transition-all duration-500 hover:-translate-y-1.5 group/pack flex flex-col ${
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
          <FeatureItem key={i} feature={f} tooltip={getTooltip(f)} />
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
        <a href="#contact"
          className={`block w-full text-center py-3 rounded-pill font-mono text-sm uppercase tracking-wider transition-all duration-300 ${
            pack.featured
              ? "bg-primary text-primary-foreground hover:brightness-110"
              : "border border-border text-foreground hover:border-primary/40 hover:text-primary"
          }`}
        >
          Nous contacter
        </a>
      )}
    </div>
  );
};

/* ─── CARTE DEVIS ─── */
const DevisPersonnaliseCard = ({ onOpen }: { onOpen: () => void }) => (
  <div
    className="relative rounded-2xl p-6 md:p-8 border border-border bg-surface transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(var(--neon)/0.12),0_0_60px_hsl(var(--neon)/0.06)] flex flex-col"
    onMouseMove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.backgroundImage = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, hsl(73 100% 50% / 0.06), transparent 60%)`;
    }}
    onMouseLeave={(e) => { e.currentTarget.style.backgroundImage = "none"; }}
  >
    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-wider">
      Personnalisé
    </span>
    <h3 className="font-clash text-2xl font-bold text-foreground">Devis sur mesure</h3>
    <p className="text-sm text-muted-foreground mt-2 mb-6 leading-relaxed">
      On regarde votre stratégie, on identifie les besoins, on bâtit la solution sur mesure.
    </p>
    <div className="mb-6">
      <span className="font-clash text-4xl font-bold text-primary">Sur devis</span>
    </div>
    <ul className="space-y-2.5 mb-6 flex-1">
      {["Audit stratégique complet", "Plan 100% sur mesure", "Accompagnement dédié", "Résultats garantis", "Support prioritaire illimité", "Intégration des partenaires"].map((f, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90">
          <Zap size={15} className="text-primary mt-0.5 shrink-0" />
          {f}
        </li>
      ))}
    </ul>
    <TheArtistBonus text="2 ans TheArtiste offert" />
    <p className="text-[11px] text-muted-foreground italic mb-6">Stratégie bâtie pour vos objectifs spécifiques</p>
    <button onClick={onOpen}
      className="block w-full text-center py-3 rounded-pill border border-border text-foreground font-mono text-sm uppercase tracking-wider hover:border-primary/40 hover:text-primary transition-all duration-300"
    >
      Obtenir un devis
    </button>
  </div>
);

/* ─── MODALE ─── */
const QuoteModal = ({ steps, onClose }: { steps: any[]; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
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
        <QuoteWizard steps={steps} onSubmitComplete={onClose} />
      </div>
    </div>
    <style>{`
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    `}</style>
  </div>
);

/* ─── COMPOSANT PRINCIPAL ─── */
const PackCards = ({ packs = [], quoteSteps = [] }: PackCardsProps) => {
  const ref = useScrollReveal();
  const [activeTab, setActiveTab] = useState(0);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const theartistTexts = ["3 mois TheArtist offert", "6 mois TheArtist offert", "1 an TheArtist offert", "2 ans TheArtist offert"];

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

          {/* Desktop */}
          <div className="hidden md:grid md:grid-cols-4 gap-6 mt-10">
            {packs.map((pack, idx) => (
              <PackCard key={pack.number} pack={pack} theartistText={theartistTexts[idx] || "TheArtist offert"} onOpenQuote={() => setShowQuoteModal(true)} />
            ))}
          </div>

          {/* Mobile */}
          <div className="md:hidden animate-fadeSlide" key={activeTab}>
            <PackCard pack={packs[activeTab]} theartistText={theartistTexts[activeTab] || "TheArtist offert"} onOpenQuote={() => setShowQuoteModal(true)} />
          </div>
        </div>
      </section>

      {showQuoteModal && <QuoteModal steps={quoteSteps} onClose={() => setShowQuoteModal(false)} />}
    </>
  );
};

export default PackCards;
