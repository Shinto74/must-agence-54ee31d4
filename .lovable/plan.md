## Plan

### 1. Suppression du panneau « Sections partagées »
- Retirer l'entrée `partage` de la sidebar admin (`src/components/admin/AdminLayout.tsx`).
- Retirer le case `partage` et l'import dans `src/pages/Admin.tsx`.
- Supprimer les fichiers :
  - `src/components/admin/panels/PartagePanel.tsx`
  - `src/components/admin/panels/editors/PortfolioEditor.tsx`
- Aucun changement de base de données (les tables Portfolio restent, juste plus éditables — sans risque).

### 2. Sélecteur de langue FR/EN dans la navbar (traduction auto temps réel)

**Composant `LanguageSwitcher`** ajouté dans le header (desktop + mobile) :
- Pill « FR | EN » au style cohérent avec la navbar (vert néon sur Artiste, doré sur Entreprise).
- État stocké dans `localStorage` (`site_lang`) + contexte React (`LanguageContext`).

**Mécanisme de traduction** :
- Edge function `translate-page` qui reçoit un tableau de chaînes FR et renvoie les traductions EN via Lovable AI (`google/gemini-3-flash-preview`).
- Hook `useTranslate()` qui :
  1. Si `lang === 'fr'` → retourne le texte tel quel.
  2. Si `lang === 'en'` → collecte tous les nœuds texte visibles du `<main>`, les envoie en batch à l'edge function, puis remplace les `textContent` dans le DOM.
  3. Met en cache les traductions dans `localStorage` (clé = hash du texte FR) pour éviter de re-traduire à chaque navigation.
- Re-déclenché à chaque changement de route et à chaque rechargement des données React Query (via `MutationObserver` léger sur `<main>`).

**Zones traduites** :
- Tout le contenu de `<main>` (textes hardcodés + contenus issus de Supabase).
- Header (labels nav, CTA contact).
- Footer.
- Exclusions : noms propres (MUST AGENCE), code, emails, URLs.

**Indicateur visuel** : petit spinner discret pendant la traduction initiale d'une page.

### 3. Détails techniques

```
src/contexts/LanguageContext.tsx        (nouveau)
src/hooks/useAutoTranslate.ts           (nouveau)
src/components/layout/LanguageSwitcher.tsx (nouveau)
supabase/functions/translate/index.ts   (nouvelle edge function, verify_jwt = false)
```

Modifications :
- `src/App.tsx` : wrap dans `<LanguageProvider>` + monter `useAutoTranslate()`.
- `src/components/layout/Header.tsx` : insérer `<LanguageSwitcher />` avant le bouton Contact.
- `src/pages/Admin.tsx` + `src/components/admin/AdminLayout.tsx` : nettoyage panneau Partage.

### 4. Limitations à signaler
- La traduction auto est rapide mais peut produire de petites imperfections (idiomes, jeux de mots).
- Premier chargement EN d'une page = ~1-2 s de latence ; ensuite cache local instantané.
- Coût Lovable AI : minime grâce au cache (chaque chaîne traduite une seule fois).
