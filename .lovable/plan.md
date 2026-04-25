## Diagnostic — Pourquoi tout est cassé

J'ai cartographié les bugs en 4 familles :

### 1. Logos invisibles (Gateway `/` + écran de chargement)
- Les URLs sont **bien en BDD** (`logo_white`, `logo_green` → HTTP 200).
- MAIS `GatewayPage.tsx` (page `/`) utilise `SITE.logoGreen` / `SITE.logoWhite` hardcodés à `""` dans `src/lib/constants.ts`.
- Idem pour `InitialLoader.tsx`.
- → Les composants n'ont jamais lu la BDD pour ces logos.

### 2. Pack "Devis sur mesure" hardcodé hors BDD
- BDD = 3 packs uniquement (`L'Essentiel`, `L'Ascension`, `L'Explosion`).
- Le 4ème (`DevisPersonnaliseCard`) est **hardcodé en dur** dans `PackCards.tsx` (titre, features, bonus, réassurance).
- → L'admin ne le voit pas et ne peut pas l'éditer.

### 3. Admin "à l'arrache" : mauvaise UX et champs cachés
- Le pattern `TableEditor` = liste + bouton "Modifier" qui ouvre un formulaire flottant en bas. Sur des entités riches (packs, piliers, artistes) c'est confus : on voit les items mais on doit re-cliquer pour éditer.
- Le `<select>` de `AdminField` (catégories d'artistes p.ex.) est blanc sur blanc → invisible.
- Champs `featured` / "ciblé" / "recommandé" : checkbox standard non distincte.
- Pas de feedback visuel sur l'item en cours d'édition.

### 4. Galerie d'artistes : une seule image, pas de versioning
- Table `artists` = 1 colonne `image_url`. Si on change l'image, l'ancienne est perdue.
- Demande : pouvoir uploader plusieurs photos, choisir laquelle est active.

---

## Plan d'action

### Étape 1 — Fix immédiat des logos (GatewayPage + Loader)

**`src/pages/GatewayPage.tsx`** : remplacer `SITE.logoGreen` et `SITE.logoWhite` par `useSiteSettings().get("logo_green", "")` et `get("logo_white", "")`. Ajouter un fallback URL Supabase pour éviter le rendu vide pendant le chargement.

**`src/components/shared/InitialLoader.tsx`** : transformer en consommateur `useSiteSettings`. Si la BDD n'a pas encore répondu, afficher un placeholder neutre (le texte "MUST AGENCE" est déjà rendu en bas) plutôt qu'une `<img src="">` cassée.

### Étape 2 — Seed le Pack 4 en BDD + supprimer le hardcode

**Migration data** (via outil insert) :
- INSERT dans `packs` : `name="Devis sur mesure"`, `subtitle`, `price="Sur devis"`, `price_suffix=""`, `featured=false`, `badge="Personnalisé"`, `bonus="1 an TheArtist offert"`, `reassurance`, `display_order=3`.
- INSERT dans `pack_features` : les 7 features actuellement hardcodées (`Diagnostic Complet`, `Stratégie Propriétaire`, etc.).

**`src/components/artiste/PackCards.tsx`** :
- Supprimer le composant `DevisPersonnaliseCard` et son rendu spécial.
- Tous les packs sont rendus uniformément via `PackCard`.
- Détection "Pack devis" = `pack.price === "Sur devis"` → bouton "Obtenir un devis" + ouverture modale.
- Mettre `theartistTexts` en BDD plus tard (out of scope ici, ou via colonne dédiée sur `packs`). Pour l'instant garder la lecture par index.

### Étape 3 — Refonte UX du panneau Admin (le gros chantier)

#### 3.1 Composant `AdminField` — Visibilité
- `select` : ajouter `bg-white` explicite + `text-slate-900` + bordure plus visible. Le select natif a un fond système qui peut être blanc/transparent selon l'OS — forcer les styles.
- Checkbox "featured" : remplacer par un toggle visuel (switch) avec label clair "⭐ Mis en avant" coloré quand actif.

#### 3.2 Nouveau composant `TabbedEditor` (remplace `TableEditor` pour packs/piliers/artistes)
Au lieu de "liste + form flottant", on a :
- **Header** : grille de cartes-onglets (une par item) montrant `01 — Nom`, état actif visible.
- **Body** : formulaire d'édition **toujours ouvert** sur l'item sélectionné, plus son sous-contenu (features pour pack, items left/right pour pillar, fiche détails pour artiste).
- **Actions** : bouton "Ajouter un nouveau" en haut à droite, bouton "Supprimer cet item" rouge en bas du form.

Cas d'usage :
- `PacksEditor` : tab par pack, dans le tab → champs du pack + sous-éditeur `pack_features` + sous-éditeur `pack_tooltips`.
- Pillars : tab par pilier, dans le tab → champs + sous-éditeurs left/right items (existant `PillarItemsEditor` à fusionner).
- Artistes : tab par artiste, dans le tab → champs + galerie + sous-éditeur `artist_details`.

#### 3.3 Audit global "couleurs invisibles"
Passer en revue tous les éditeurs (`SectorsEditor`, `ClientsEditor`, `StatsEditor`, `PortfolioEditor`, etc.) pour vérifier :
- Aucun texte blanc sur fond blanc.
- Tous les `select` lisibles.
- Tous les states "actif/sélectionné" ont un contraste fort.

### Étape 4 — Galerie multi-images pour artistes

**Migration BDD** :
```sql
CREATE TABLE artist_images (
  id uuid PK,
  artist_id uuid NOT NULL,
  url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
-- RLS : public read, admin CRUD (mêmes patterns que les autres tables)
```

Le champ `artists.image_url` reste comme **pointeur vers l'image active** (URL réelle, pas un FK — pour rester compatible avec le frontend existant).

**Nouveau composant `ArtistGalleryEditor`** dans le tab Artiste :
- Grille de vignettes (toutes les images de la galerie).
- Une vignette est marquée "Active" (bordure néon) = celle dont l'URL est dans `artists.image_url`.
- Click sur une vignette = définit cette URL comme active dans `artists.image_url`.
- Bouton "Ajouter image" = upload vers `artist_images`.
- Bouton "Supprimer" sur chaque vignette (avec confirmation, et si c'est l'active, en sélectionner une autre auto).

**Seed** : pour chaque artiste existant, copier `artists.image_url` actuelle dans `artist_images` comme première entrée.

### Étape 5 — Cleanup constants

Vider `src/lib/constants.ts` des fallbacks devenus inutiles maintenant que la BDD est seedée et stable. Garder uniquement le strict minimum (textes par défaut courts qui évitent un "blanc" pendant le premier chargement).

---

## Récap fichiers touchés

**Créés** :
- `src/components/admin/panels/editors/TabbedEditor.tsx` (composant générique)
- `src/components/admin/panels/editors/ArtistGalleryEditor.tsx`
- Migration SQL pour `artist_images` + RLS
- Insert SQL pour seed Pack 4 et galerie artistes

**Modifiés** :
- `src/pages/GatewayPage.tsx` (logos via BDD)
- `src/components/shared/InitialLoader.tsx` (logos via BDD)
- `src/components/artiste/PackCards.tsx` (supprimer DevisPersonnaliseCard)
- `src/components/admin/AdminField.tsx` (select + switch)
- `src/components/admin/panels/editors/PacksEditor.tsx` (utilise TabbedEditor)
- `src/components/admin/panels/editors/PillarItemsEditor.tsx` (intégré dans TabbedEditor pillars)
- `src/components/admin/panels/editors/ArtistDetailsEditor.tsx` (intégré dans TabbedEditor artistes)
- `src/components/admin/panels/editors/ArtistesEditor.tsx` (utilise TabbedEditor + galerie)
- `src/components/admin/panels/PageArtistePanel.tsx` (réorganisation)
- `src/lib/constants.ts` (cleanup)

---

## Notes d'implémentation

- Pas de régression frontend : la page Artiste continue de lire `artists.image_url` comme avant.
- Le Pack 4 sera désormais 100% éditable dans l'admin (titre, features, prix, badge).
- L'audit "couleurs invisibles" sera fait sur **tous** les éditeurs admin, pas seulement ceux cités.
- Estimation : ~10-12 fichiers modifiés, 2 migrations BDD (1 schéma `artist_images`, 1 data Pack 4 + seed gallery).
