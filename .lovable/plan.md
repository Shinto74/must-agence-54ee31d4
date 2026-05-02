## 1. Section Piliers (split-screen) — fix d'affichage & scroll

**Problème** : la section disparaît parfois, les éléments se superposent, le scroll-jack 3D est lourd.

- `ArtisteServicesV4B.tsx` : remplacer le `useScrollIndex` basé sur `getBoundingClientRect / window.innerHeight` (peu fiable selon le contexte) par `IntersectionObserver` ou `useScroll` de Framer Motion mappé sur la progression du wrapper.
- Stabiliser le header (qui chevauche la carte gauche) : le placer **dans** le panneau gauche, en flux normal (pas en `absolute`), avec un padding supérieur clair — ça empêche la superposition avec le titre actif.
- Ajouter un fallback **mobile/tablette** propre : empilement vertical (déjà partiellement présent mais le wrapper garde `height: pillars.length * 100vh` même sur mobile → bug). Conditionner cette hauteur à `lg:`.
- Ajouter une transition d'entrée/sortie sur le wrapper sticky pour éviter les flashs vides quand la query React est en revalidation.

## 2. Admin — fix du `<select>` vert/illisible

Le composant `AdminField` rend un `<select>` natif sans classes texte explicites. Sur certains OS, le bandeau de design dark de la page admin colore le texte en vert néon par héritage.

- Ajouter explicitement `text-slate-900 bg-white` au `<select>` et forcer `color-scheme: light` pour qu'il s'affiche en couleurs neutres normales (texte noir, fond blanc), avec une bordure indigo au focus comme les autres inputs.

## 3. Bandeau logos marquee — remplacement sans suppression

Actuellement on doit supprimer un logo pour le remplacer.

- Dans `MarqueeEditor`, transformer le champ `image_url` en éditeur de **galerie multi-images** (réutiliser `MediaGalleryEditor` en mode `row` ciblant `marquee_items.image_url`). On pourra empiler plusieurs versions d'un logo et basculer en un clic sur celui qui s'affiche.

## 4. Hero artiste — tout rendre éditable

Le bloc « Influence Artistique / MUST AGENCE / On ne suit pas les tendances » a son label et sous-titre éditables, mais les **lettres MUST AGENCE** sont en dur.

- Ajouter dans `Page Artiste → 1. Hero` les nouveaux champs :
  - `hero_artiste_brand_text` (texte affiché, ex. « MUST AGENCE »)
  - `hero_artiste_brand_accent_index` (index de la lettre en vert, ex. 5 pour le « A »)
  - `hero_artiste_signature` (signature animée sous le titre — déjà mappée à `hero_artiste_subtitle`, juste renommer le label admin pour clarifier).
- `Hero.tsx` : générer dynamiquement `BRAND_LETTERS` depuis ces settings, avec fallback sur les valeurs actuelles.

## 5. Pages légales et obligatoires (RGPD français)

Création de toutes les pages obligatoires pour un site commercial français qui collecte des données + vend en ligne :

- `/mentions-legales` — éditeur, hébergeur, directeur de publication, SIRET
- `/politique-confidentialite` — données collectées, finalités, base légale, durée, droits RGPD, DPO
- `/cgv` — CGV pour les packs (fournisseur, prix, paiement Stripe, rétractation 14j ou exclusion B2B, garanties, litiges)
- `/cgu` — règles d'utilisation du site
- `/politique-cookies` — liste des cookies, consentement, durée
- **Bannière de consentement cookies** (composant global `CookieBanner`) : Accepter / Refuser / Personnaliser, stockage du choix dans `localStorage`, blocage des scripts non essentiels tant que pas de consentement.

Côté admin : nouveau panneau **« Pages légales »** avec un éditeur riche (textarea long) par page, alimenté depuis `site_settings` (clés `legal_mentions_*`, `legal_privacy_*`, `legal_cgv_*`, `legal_cgu_*`, `legal_cookies_*`) + champs structurés société (nom, SIRET, adresse, hébergeur).

Ajout des liens dans le **footer** (colonne dédiée « Légal »).

## 6. Identité — toggles afficher/masquer

Dans `IdentitePanel`, ajouter pour chaque coordonnée et bloc social un **switch** (composant `checkbox` déjà existant dans `AdminField`) :

- `show_contact_email`, `show_contact_phone`, `show_contact_location`
- `show_social_instagram`, `show_social_tiktok`, `show_social_linkedin`, `show_social_youtube`
- `show_logo_white`, `show_logo_green` (masque le logo respectif là où il apparaît)

Côté rendu : `Footer.tsx`, `ContactSection.tsx` lisent ces flags via `useSiteSettings.getBool()` (à ajouter au hook) et masquent l'élément correspondant. Valeurs par défaut = `true` pour ne rien casser.

## 7. Migration BDD

Une seule migration ajoute toutes les nouvelles clés `site_settings` avec leurs valeurs par défaut (textes légaux génériques pré-remplis, flags = `'true'`).

---

### Détails techniques

**Fichiers modifiés**
- `src/components/artiste/ArtisteServicesV4B.tsx` (scroll/header)
- `src/components/admin/AdminField.tsx` (select)
- `src/components/admin/panels/editors/MarqueeEditor.tsx` (galerie multi-logos)
- `src/components/home/Hero.tsx` (lettres dynamiques)
- `src/components/admin/panels/PageArtistePanel.tsx` (champs hero brand)
- `src/components/admin/panels/IdentitePanel.tsx` (toggles + champs société)
- `src/components/layout/Footer.tsx` (liens légaux + toggles)
- `src/components/home/ContactSection.tsx` (toggles)
- `src/hooks/useSiteContent.ts` (helper `getBool`)
- `src/App.tsx` (routes /mentions-legales etc. + `<CookieBanner />` global)

**Fichiers créés**
- `src/pages/legal/MentionsLegales.tsx`
- `src/pages/legal/PolitiqueConfidentialite.tsx`
- `src/pages/legal/CGV.tsx`
- `src/pages/legal/CGU.tsx`
- `src/pages/legal/PolitiqueCookies.tsx`
- `src/components/legal/CookieBanner.tsx`
- `src/components/legal/LegalLayout.tsx` (mise en page commune sobre)
- `src/components/admin/panels/PagesLegalesPanel.tsx`

**Migration Supabase** : INSERT de ~30 nouvelles `site_settings` (textes légaux + flags `show_*`).
