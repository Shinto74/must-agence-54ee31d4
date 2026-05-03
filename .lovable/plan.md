## Objectif
Garder **tout le contenu FR tel quel**. Refaire uniquement les **traductions EN** pour qu'elles sonnent natives, premium, fluides — et **fixer les 2 bugs visibles** côté packs et pages légales EN.

## Ce que je NE fais PAS
- Aucune modification du copy FR
- Aucun changement de structure de pack, prix, features
- Aucune réécriture marketing

---

## Travail

### 1. Fix bug "il manque des i" sur les packs EN
Cause : dans `PackCards.tsx`, le matching des **icônes** et **tooltips** se fait par `feature.startsWith("Promotion Playlisting"…)` en français. En EN, le texte change → plus d'icône spécifique, plus de bouton "i" tooltip.

Fix minimal sans toucher au schéma BDD : matcher sur le **texte FR original** récupéré depuis `row` (avant traduction par `translateRows`). Adapter `usePacks` / `usePackTooltips` pour exposer un champ `text_fr` / `feature_prefix_fr` stable, puis les utiliser pour le matching dans `PackCards.tsx`.

### 2. Pages légales : externaliser le texte FR en dur
Dans `src/pages/legal/CGU.tsx`, `CGV.tsx`, `MentionsLegales.tsx`, `PolitiqueConfidentialite.tsx`, `PolitiqueCookies.tsx` → les **titres de sections** ("1. Accès au site"…) et plusieurs paragraphes sont hardcodés en français. Donc en EN ils restent en FR.

Fix : remplacer chaque texte en dur par `get("legal_xxx", "fallback FR identique")`, ajouter les clés correspondantes dans `PagesLegalesPanel.tsx`. Le FR visible reste identique au pixel près (fallback = texte actuel).

### 3. Retraduire EN proprement (sans toucher au FR)
Refaire les `translations.en` de toutes les lignes où l'EN sonne traduit/calqué. Périmètre :

- `packs` : name, subtitle, bonus, reassurance, badge
- `pack_features` (21 lignes)
- `pack_tooltips` (11 lignes)
- `site_settings` (clés `legal_*`, `cookie_banner_*`, tagline, hero, footer, CTA…)
- `services_artiste`, `services_entreprise`, `service_*_chips`
- `expertise_artiste`, `expertise_entreprise`
- `process_artiste`, `process_entreprise`
- `artist_pillars`, `pillar_left_items`, `pillar_right_items`
- `team_members` (role + description)
- `theartist_features`, `clip_portugal_advantages`
- `form_steps`, `form_options`, `contact_sectors`, `contact_form_types`
- `entreprise_sectors`, `portfolio_cases`, `case_metrics`
- `artist_categories`, `artist_details` (chiffre / description / strategie)
- `marquee_items`, `stats`, `client_categories`

Méthode : pour chaque ligne, je remplace `translations.en.<field>` par une version **rédigée en anglais natif** (pas une transposition mot-à-mot). Exemples :
- *"1 mois d'abonnement The Artist offert"* → ~~"1 month of TheArtist subscription offered"~~ → **"1 month of TheArtist, included"**
- *"Un interlocuteur dédié vous accompagne de A à Z…"* → ~~"A dedicated contact accompanies you…"~~ → **"One dedicated lead, end to end."**
- *"Force de frappe supérieure pour transformer votre titre en succès"* → **"Heavier firepower to turn your release into a hit."**
- *"War Room digitale à votre service"* → **"A digital war room at your back."**

Toutes les écritures via `supabase--insert` (UPDATE des `translations.en`, jamais des `value` FR).

### 4. Vérification
- Switch FR ↔ EN sur Home, Artiste, Entreprise, /cgu, /cgv, /mentions-legales, /politique-confidentialite, /politique-cookies
- Confirmer : icônes packs + tooltips "i" présents en EN, pages légales 100% en EN, copy EN ne sonne plus traduite, FR strictement inchangé

## Fichiers impactés
- `src/components/artiste/PackCards.tsx` (fix matching icônes/tooltips)
- `src/hooks/useArtistePage.ts` (exposer texte FR pour matching)
- `src/pages/legal/*.tsx` (5 fichiers — externaliser strings)
- `src/components/admin/panels/PagesLegalesPanel.tsx` (ajouter les nouvelles clés)
- Data : ~150 UPDATE SQL via `supabase--insert` sur `translations.en` uniquement
