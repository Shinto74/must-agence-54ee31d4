

# Plan de reconstruction -- Must Agence

## Vue d'ensemble

Reconstruction complète du site Must Agence en React + Tailwind + Lovable Cloud (Supabase). SPA avec 3 vues (Home, Artiste, Entreprise), design dark premium (#0A0A0A, accent #CCFF00), admin en francais.

Le projet est massif. Il sera decoupage en **phases incrementales** pour eviter les erreurs. Chaque phase produit un resultat visible et testable.

---

## Phase 1 -- Design System + Layout + Navigation SPA

**Fichiers crees/modifies :**
- `src/index.css` : variables CSS completes (--bg, --sf, --neon, etc.), imports Google Fonts (Outfit, JetBrains Mono) + Fontshare (Clash Display)
- `tailwind.config.ts` : couleurs custom (neon, surface, border), fonts (clash, outfit, mono), animations (marquee, fadeSlide, shake, tabPop), easing custom
- `src/App.css` : suppression du contenu par defaut
- `src/lib/constants.ts` : donnees statiques initiales (textes, images GitHub, equipe, stats, services, packs, etc.) -- servira de fallback avant connexion Supabase
- `src/App.tsx` : routes `/`, `/artiste`, `/entreprise`, `/admin`
- `src/components/layout/Header.tsx` : nav sticky, logo, liens, fond transparent -> opaque au scroll
- `src/components/layout/Footer.tsx` : logo, liens, copyright
- `src/pages/Index.tsx` : page Home (composition de sections)
- `src/pages/Artiste.tsx` : page Pole Artiste
- `src/pages/Entreprise.tsx` : page Pole Entreprise

## Phase 2 -- Sections Home (statiques d'abord)

Composants dans `src/components/home/` :
- `Hero.tsx` : fond noir, orbes verts animes (CSS radial-gradient + blur + animation), titre Clash Display, 2 CTA arrondis, "Scroll" indicator
- `MarqueeText.tsx` : bande de mots-cles defilante (CSS animation translateX)
- `StatsCounter.tsx` : 4 compteurs animes (IntersectionObserver + requestAnimationFrame pour compter de 0 a valeur)
- `PolesGateway.tsx` : 2 cards Artiste/Entreprise avec hover glow, chips, navigation
- `ArtistReferences.tsx` : auto-scroll horizontal JS (rAF), cards grayscale->color au hover, onglets categorie auto-detectes par carte visible, drag pour accelerer
- `CompanyReferences.tsx` : 4 marquees CSS par categorie, direction alternee, logo+nom, monochrome->couleur au hover
- `Vision.tsx` : blockquote + texte + logo vert
- `Team.tsx` : grille de cards membres (initiales, nom, role, bio)
- `Portfolio.tsx` : case studies avec metriques
- `CtaBand.tsx` : bandeau CTA pleine largeur
- `ContactSection.tsx` : formulaire contact (select type, nom, email, message) + bouton WhatsApp

## Phase 3 -- Pages Artiste et Entreprise

Composants reutilisables dans `src/components/shared/` :
- `SubHero.tsx` : logo + tag + titre (parametre couleur accent)
- `ExpertisePillars.tsx` : 3 colonnes numerotees
- `ServiceCards.tsx` : grille de 6 service-cards avec chips
- `ProcessSteps.tsx` : etapes numerotees
- `ContactPole.tsx` : formulaire contact specifique au pole

Composants specifiques Artiste dans `src/components/artiste/` :
- `PackCards.tsx` : 3 cards verticales, Pack 2 "Recommande" avec border neon + gradient, hover glow complexe (radial-gradient + translateY + box-shadow). Mobile : slider avec 3 onglets (fond gris, actif = vert + texte noir) + swipe
- `CustomOffer.tsx` : CTA arrondi "Demander un devis personnalise"
- `QuoteWizard.tsx` : formulaire 5 etapes avec barre segmentee, validation par etape, shake si invalide, ecran succes. Types : radio (icones), textarea, radio, date, checkbox

## Phase 4 -- Animations premium

- Scroll reveal (IntersectionObserver, classe `.rv` avec fade-in + translateY)
- Compteurs animes au scroll
- Hover effects cards artistes (grayscale(1)->grayscale(0) + scale(1.06) + glow neon)
- Hover effects pack cards (radial gradient vert + translateY(-6px) + box-shadow neon)
- Hover logos entreprises (grayscale(1) opacity(.4)->filter:none opacity(1) + scale(1.08))
- Marquee infini CSS (triple items pour boucle)
- Auto-scroll artistes JS (rAF, 0.7px/frame, drag, reset)
- Transitions entre vues (fadeSlide)
- Boutons : tous border-radius 28px

## Phase 5 -- Lovable Cloud (Supabase)

**Tables a creer via migrations :**
- `site_settings` (key TEXT PK, value TEXT, type TEXT)
- `team_members` (id, name, role, description, image_url, display_order)
- `artist_categories` (id, name, slug, display_order)
- `artists` (id, name, image_url, category_id FK, display_order)
- `client_categories` (id, name, display_order)
- `clients` (id, name, logo_url, category_id FK, display_order)
- `packs` (id, number, name, subtitle, price, price_suffix, featured, badge, bonus, reassurance, display_order)
- `pack_features` (id, pack_id FK, text, display_order)
- `services_artiste` (id, number, title, description, display_order)
- `service_artiste_chips` (id, service_id FK, text, display_order)
- `services_entreprise` + chips (meme structure)
- `expertise_artiste` / `expertise_entreprise` (id, number, title, text, display_order)
- `process_artiste` / `process_entreprise` (id, number, title, text, display_order)
- `stats` (id, page TEXT, value TEXT, label TEXT, suffix TEXT, display_order)
- `portfolio_cases` (id, icon, tag, title, description, display_order)
- `case_metrics` (id, case_id FK, value TEXT, label TEXT, display_order)
- `form_steps` (id, title, question, hint, type, placeholder, display_order)
- `form_options` (id, step_id FK, label, icon, display_order)
- `contact_submissions` (id, type, name, email, message, created_at)
- `quote_requests` (id, profile, project_desc, budget, deadline, expectations TEXT[], created_at)

**RLS** : lecture publique sur toutes les tables de contenu, ecriture admin uniquement. Insert public sur contact_submissions et quote_requests.

**Hooks React** : `useSettings()`, `useTeam()`, `useArtists()`, `useClients()`, `usePacks()`, `useServices()`, `useStats()`, `usePortfolio()`, etc. -- chacun avec React Query + fallback sur constantes statiques.

**Seed data** : insertion des donnees actuelles via l'outil insert.

## Phase 6 -- Formulaire devis (envoi Email + DB + WhatsApp)

- Stockage en DB (table `quote_requests`)
- Email de confirmation via Lovable Cloud transactional emails (Edge Function `send-transactional-email`)
- Bouton WhatsApp pre-rempli avec resume du devis (`https://wa.me/33...?text=...`)
- Formulaire contact : meme logique (DB + email + WhatsApp)

## Phase 7 -- Admin Dashboard

- Route `/admin` protegee par authentification (email/password via Lovable Cloud)
- Interface 100% en francais
- Sections admin :
  - Parametres generaux (textes hero, vision, CTA, contacts)
  - Equipe (CRUD membres avec upload image)
  - References Artistes (CRUD categories + artistes)
  - References Entreprises (CRUD categories + clients)
  - Packs (CRUD packs + features)
  - Services Artiste / Entreprise (CRUD)
  - Stats (edition des chiffres)
  - Portfolio (CRUD cases + metriques)
  - Formulaire devis (edition etapes + options)
  - Demandes recues (lecture contact_submissions + quote_requests)
- Upload images vers Supabase Storage

## Phase 8 -- Polish final

- Custom cursor (cercle suivant la souris, desktop only)
- Loader initial (logo + barre progression)
- SEO (meta tags, Open Graph)
- Responsive final (breakpoints 860px, 900px, 520px)
- Performance (lazy loading images, code splitting)

---

## Details techniques

- **Images** : Les 19 photos artistes et 15 logos entreprises seront references via les URLs GitHub fournies dans les constantes, puis remplacees par Supabase Storage quand l'admin uploade
- **Fonts** : Clash Display via Fontshare CDN, Outfit + JetBrains Mono via Google Fonts, charges dans `index.html`
- **SPA** : React Router avec 3 routes principales + `/admin` + `/admin/login`
- **Easing** : `cubic-bezier(0.16, 1, 0.3, 1)` applique globalement via variable CSS
- **Boutons** : tous `border-radius: 28px`
- **Logos entreprises** : `filter: grayscale(1); opacity: 0.4` (jamais brightness/invert)
- **Pack cards hover** : radial-gradient vert + translateY(-6px) + box-shadow neon -- non simplifie

---

## Ordre d'implementation

L'implementation se fera phase par phase. Phase 1 en premier pour poser les fondations, puis Phase 2 pour le contenu visible, etc. Chaque phase sera testable independamment.

