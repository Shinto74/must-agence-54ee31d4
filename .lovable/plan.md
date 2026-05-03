# Traductions EN inline dans chaque page admin

## Objectif
Supprimer l'onglet "Traductions" centralisé. Pour chaque champ éditable d'une section (Hero Artiste, Piliers, Packs, Vision, Équipe, Hero Entreprise, Services, Secteurs, Contact, Légal, Identité…), afficher **directement à côté du champ FR un champ EN** qui écrit dans la colonne `translations` JSONB de la ligne correspondante. L'admin reste organisé page par page, section par section, fidèle au visuel.

## Principe technique
Toutes les tables ont déjà une colonne `translations jsonb` (forme `{ en: { field: "..." } }`) et `useSiteContent` / `useSupabaseData` / `translateRow` la consomment déjà côté front. Il suffit donc de **brancher l'UI d'édition** sur cette colonne — aucune migration nécessaire.

## Changements UI

### 1. `SettingsBlock.tsx` (utilisé partout : Hero, Vision, Identité, Légal…)
- Pour chaque `SettingRow`, ajouter un second input EN sous le champ FR.
- Lecture : `dbRow.translations?.en?.value`.
- Écriture : merge dans `translations` puis `crud.save({ key, value, type, translations: { ...existing, en: { value: enValue } } })`.
- Visuel : petit drapeau 🇫🇷 / 🇬🇧 ou label `FR` / `EN` à gauche, même style d'input, auto-save au blur.
- Boolean / image / vidéo : pas de champ EN (non traduisible).

### 2. `TableEditor.tsx` (Packs, Piliers, Artistes, Clients, Secteurs, Team, Clip Portugal, Process, Services, Marquee, Form, Stats…)
- Dans le formulaire d'édition, sous chaque champ texte/textarea, ajouter un champ EN miroir.
- Stockage dans `editing.translations.en[fieldKey]`.
- Save existant inchangé (la colonne `translations` est envoyée telle quelle).
- Champs non traduisibles ignorés : `image`, `number`, `select`, `checkbox`, `display_order`, `image_url`, `logo_url`, `slug`, `icon`, `id`, `*_url`.
- Liste des champs traduisibles dérivée automatiquement (type `text`/`textarea` et clé non listée comme non-traduisible).

### 3. `AdminField.tsx`
- Ajouter une prop optionnelle `translation?: { value: string; onChange: (v: string) => void }`.
- Quand fournie, render un second input plus compact sous le principal, libellé `EN`.

### 4. Éditeurs custom (PacksEditor, PillarItemsEditor, ArtistesEditor, TeamEditor, ServicesEntrepriseEditor, ClipPortugalEditor, ContactFormTypesEditor, MarqueeEditor, ArtistDetailsInline, PackTooltipsEditor, etc.)
- La plupart utilisent déjà `TableEditor` → bénéficient automatiquement.
- Les éditeurs avec rendu custom (ex. `ArtistDetailsInline`, `PackTooltipsEditor`) recevront le même traitement : un champ EN miroir sous chaque textarea/input traduisible.

### 5. Suppression de l'ancien onglet "Traductions"
- Retirer l'entrée `traductions` de `AdminLayout.tsx` (sidebar).
- Retirer le bloc `tab === "traductions"` dans `Admin.tsx`.
- Garder le fichier `TraductionsPanel.tsx` archivé (ou le supprimer) — au choix.
- Le dictionnaire statique `src/lib/i18n/dictionary.ts` reste pour les libellés purement UI codés en dur (boutons, labels framework). Pas touché.

## Détails techniques

### Helper `translations` (nouveau, `src/lib/i18n/adminTranslate.ts`)
```ts
export function getEn(row: any, field: string): string {
  return row?.translations?.en?.[field] ?? "";
}
export function setEn(translations: any, field: string, value: string) {
  const en = { ...(translations?.en || {}) };
  if (value) en[field] = value; else delete en[field];
  return { ...(translations || {}), en };
}
```

### Champs non-traduisibles (liste noire)
`id`, `display_order`, `created_at`, `updated_at`, `image_url`, `logo_url`, `video_url`, `url`, `slug`, `icon`, `accent_hue`, `featured`, `freeze_on_hover`, `kind`, `page`, `category_id`, `pillar_id`, `pack_id`, `artist_id`, `step_id`, `service_id`, `case_id`, `owner_*`, `price`, `number`, `stripe_*`, `feature_prefix`, et tout `*_url` / `*_id` / `*_order`.

### `site_settings` cas particulier
Les clés `*_url`, `*_show`, `*_index`, `*_video_url`, `*_image_*` ne sont pas traduisibles. Détection par suffixe + par `field.type` (`image`/`video`/`media`/`boolean`/`number` → pas d'EN).

## Ordre d'exécution (livraison en un coup)
1. Créer `src/lib/i18n/adminTranslate.ts`.
2. Modifier `SettingsBlock.tsx` — ajouter row EN + auto-save translations.
3. Modifier `AdminField.tsx` — accepter prop `translation`.
4. Modifier `TableEditor.tsx` — passer `translation` à chaque AdminField traduisible.
5. Patcher les rares éditeurs custom (`ArtistDetailsInline`, `PackTooltipsEditor`, `MarqueeEditor` si custom inputs) pour exposer EN.
6. Retirer l'onglet `Traductions` de `AdminLayout.tsx` + `Admin.tsx`.
7. Vérifier visuellement sur 3 sections clés (Hero Artiste, Pack, Pillar).

## Hors scope
- Pas de changement de schéma BDD.
- Pas de ré-génération automatique IA (les valeurs déjà traduites en bulk restent et apparaîtront dans les champs EN).
- Pas de touche au front public ni aux hooks de traduction (déjà OK).
