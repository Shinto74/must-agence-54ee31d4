/**
 * ♻️ PAGE POUBELLE — Sections non utilisées mais conservées pour référence
 * Ces sections peuvent être réintégrées plus tard si besoin.
 * Ne pas supprimer ce fichier.
 */

import ExpertisePillars from "@/components/shared/ExpertisePillars";
import ServiceCards from "@/components/shared/ServiceCards";
import ProcessSteps from "@/components/shared/ProcessSteps";
import Portfolio from "@/components/home/Portfolio";
import StatsCounter from "@/components/home/StatsCounter";
import SubHero from "@/components/shared/SubHero";
import { SITE, ARTISTE_PAGE } from "@/lib/constants";
import { useExpertiseArtiste, useServicesArtiste, useProcessArtiste, usePortfolio, useStats } from "@/hooks/useSupabaseData";

// ─────────────────────────────────────────────────────────────────────────────
// SECTION : EXPERTISE (3 piliers)
// Utilisée sur : Artiste.tsx (retirée)
// ─────────────────────────────────────────────────────────────────────────────
//
// 01. Viral Engineering
//     "L'algorithme n'est pas une loterie, c'est une science."
// 02. Icon Architecture
//     "On ne gère pas des carrières, on bâtit des dynasties."
// 03. Monetization
//     "La hype sans revenus ne sert à rien."
//
// Réintégrer avec :
//   const { data: expertise } = useExpertiseArtiste();
//   <ExpertisePillars items={expertise || []} accentColor="neon" />

// ─────────────────────────────────────────────────────────────────────────────
// SECTION : SERVICES (6 services avec chips)
// Utilisée sur : Artiste.tsx (retirée)
// ─────────────────────────────────────────────────────────────────────────────
//
// 01. Influence & TikTok Activation — chips: TikTok Activation, Creator Network, Sound Seeding, Viral Engineering
// 02. Création Visuelle             — chips: Pochettes, Clips, Visuels, Lifestyle
// 03. Stratégie de Lancement        — chips: Rollout, Teasing, Release Strategy, Multi-plateforme
// 04. Campagnes Ads & RP            — chips: Meta Ads, Google Ads, TikTok Ads, Relations Presse
// 05. Brand Content & Storytelling  — chips: Storytelling, Brand Content, Identité, Long Terme
// 06. Booking & Partenariats        — chips: Booking, Partenariats, Placements, Événements
//
// Réintégrer avec :
//   const { data: services } = useServicesArtiste();
//   <ServiceCards services={services || []} accentColor="neon" />

// ─────────────────────────────────────────────────────────────────────────────
// SECTION : PROCESSUS (4 étapes)
// Utilisée sur : Artiste.tsx (retirée)
// ─────────────────────────────────────────────────────────────────────────────
//
// 01. Brief & Audit   — "Analyse de votre univers, audience, objectifs et potentiel viral."
// 02. Stratégie       — "Plan sur mesure, sélection créateurs, budgets et KPIs."
// 03. Activation      — "Lancement campagnes, seeding, production et diffusion."
// 04. Reporting       — "Analytics temps réel, Shazam lifts, streaming impact."
//
// Réintégrer avec :
//   const { data: process } = useProcessArtiste();
//   <ProcessSteps steps={process || []} accentColor="neon" />

// ─────────────────────────────────────────────────────────────────────────────
// SECTION : PORTFOLIO — "Résultats de nos campagnes"
// Utilisée sur : Artiste.tsx & Index.tsx (retirée des deux)
// ─────────────────────────────────────────────────────────────────────────────
//
// 3 case studies :
// 🎵 Artiste – TikTok Activation
//    Lancement Single – Artiste Urban FR
//    Vues: 5M+ | Streams: +340% | ROAS: 12x
//
// 🏷️ Brand – Influence Campaign
//    Campagne Influence – Marque Mode
//    CA en 6 mois: +180% | CPA: -45% | ROAS: 8.5x
//
// ⭐ Artiste – Brand Building
//    Repositionnement – Artiste Pop
//    Deals marques: 3 | Engagement: +500% | Charts FR: Top 10
//
// Réintégrer avec :
//   const { data: portfolio } = usePortfolio();
//   <Portfolio items={portfolio || []} />

// ─────────────────────────────────────────────────────────────────────────────
// SECTION : STATS COUNTER (chiffres animés)
// Utilisée sur : Artiste.tsx & Index.tsx (retirée des deux)
// ─────────────────────────────────────────────────────────────────────────────
//
// Réintégrer avec :
//   const { data: stats } = useStats("home"); // ou "artiste"
//   <StatsCounter items={stats || []} />

// ─────────────────────────────────────────────────────────────────────────────
// SECTION : SUBHERO — Pôle Artiste hero secondaire
// Utilisée sur : Artiste.tsx (retirée)
// ─────────────────────────────────────────────────────────────────────────────
//
// Titre: "Music & Entertainment"
// Description: "Campagnes d'influence TikTok, activation de créateurs, stratégie de lancement
//              et développement de carrière artistique. Un accompagnement clé en main."
// CTA: "Démarrer mon projet" / "Nos services"
//
// Réintégrer avec :
//   <SubHero
//     logo={SITE.logoWhite}
//     tag={ARTISTE_PAGE.hero.tag}
//     titleLine1={ARTISTE_PAGE.hero.titleLine1}
//     titleAccent={ARTISTE_PAGE.hero.titleAccent}
//     description={ARTISTE_PAGE.hero.description}
//     ctaPrimary={ARTISTE_PAGE.hero.ctaPrimary}
//     ctaSecondary={ARTISTE_PAGE.hero.ctaSecondary}
//     accentColor="neon"
//   />

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW PAGE — Pour visualiser les sections archivées
// Route: non enregistrée (ne pas ajouter dans App.tsx)
// ─────────────────────────────────────────────────────────────────────────────
const Poubelle = () => {
  const { data: expertise } = useExpertiseArtiste();
  const { data: services } = useServicesArtiste();
  const { data: process } = useProcessArtiste();
  const { data: portfolio } = usePortfolio();
  const { data: stats } = useStats("home");

  return (
    <div className="bg-background text-foreground">
      <div className="sticky top-0 z-50 bg-yellow-500/20 border-b border-yellow-500/40 px-6 py-3 text-center">
        <p className="font-mono text-xs text-yellow-400 uppercase tracking-widest">
          ♻️ Page Poubelle — Sections archivées non utilisées
        </p>
      </div>

      <StatsCounter items={stats || []} />
      <SubHero
        logo={SITE.logoWhite}
        tag={ARTISTE_PAGE.hero.tag}
        titleLine1={ARTISTE_PAGE.hero.titleLine1}
        titleAccent={ARTISTE_PAGE.hero.titleAccent}
        description={ARTISTE_PAGE.hero.description}
        ctaPrimary={ARTISTE_PAGE.hero.ctaPrimary}
        ctaSecondary={ARTISTE_PAGE.hero.ctaSecondary}
        accentColor="neon"
      />
      <ExpertisePillars items={expertise || []} accentColor="neon" />
      <ServiceCards services={services || []} accentColor="neon" />
      <ProcessSteps steps={process || []} accentColor="neon" />
      <Portfolio items={portfolio || []} />
    </div>
  );
};

export default Poubelle;
