
## Contexte / diagnostic

J'ai vérifié la base et le code, voici ce qui cloche réellement :

1. **Vision manque dans l'admin Artiste** : le composant `<Vision />` est bien rendu sur la page Artiste (`src/pages/Artiste.tsx`) mais l'éditeur n'apparaît que dans "Sections partagées".
2. **Doublon "Catégories d'artistes + Artistes"** : il existe **deux éditeurs différents** pour la même donnée :
   - `ArtistesEditor` (dans Sections partagées) → version moderne TabbedEditor avec galerie multi-photos, mais sans champs KPI.
   - `ArtistDetailsEditor` (dans Page Artiste) → uniquement les fiches détails (stratégie, description, plateformes, chiffre) avec une UX confuse : sélecteur d'artiste + liste de fiches (alors qu'on veut UNE fiche par artiste).
3. **KPI vides** : confirmé en BDD — 9 artistes sur 18 n'ont **aucune ligne** dans `artist_details` (Pierre Garnier, Franglish, Héléna Bailly, Theodora, Jeck, RnBoi, Moral, Ofenbach, The Avener) et le champ `chiffre` est vide partout sauf un. C'est pour ça que rien ne s'affiche.
4. **"Sections partagées" est un fourre-tout incorrect** : il contient `ClientsEditor` (utilisé seulement sur Accueil + Entreprise, pas Artiste) et `PortfolioEditor` qui n'a rien de partagé non plus.
5. **Équipe** : `<Team />` est bien partagé Accueil + Artiste, donc l'éditeur peut rester dans "partagées" — mais il faut quand même qu'il soit accessible depuis Page Artiste pour ne pas que l'utilisateur se perde.

## Plan d'action

### 1. Réorganisation des panneaux admin

**Page Artiste** (réécriture de `PageArtistePanel.tsx`) — sections dans l'ordre exact du rendu :
1. Hero
2. Marquee artiste
3. Piliers (en-tête + items)
4. Références artistes — titres + **éditeur Artistes (TabbedEditor unifié)** ← déplacé depuis "partagées", supprime le doublon
5. Packs
6. TheArtist
7. Clip Portugal
8. **Vision** ← nouveau bloc ici
9. **Équipe** ← nouveau bloc ici
10. CtaBand
11. Contact

**Page Accueil** (`PageAccueilPanel.tsx`) :
- Ajouter blocs Vision, Équipe, Références artistes (lecture seule / lien vers la version maître), Catégories clients + Clients.

**Page Entreprise** (`PageEntreprisePanel.tsx`) :
- Ajouter Catégories clients + Clients (utilisés sur cette page aussi via le hero/refs).

**Sections partagées** (`PartagePanel.tsx`) :
- Renommer en "Référentiels globaux" pour clarifier.
- Garder uniquement : Vision, Équipe, Artistes (catégories + fiches), Portfolio.
- Retirer Clients (déplacé vers Accueil + Entreprise).
- Note explicite : "modifier ici met à jour partout".

### 2. Fusion `ArtistesEditor` + `ArtistDetailsEditor` en UN seul éditeur

Refonte de `ArtistesEditor.tsx` (TabbedEditor) pour qu'**un onglet artiste affiche TOUT** dans une seule fiche :
- Identité : nom, catégorie, position
- **KPI / Fiche détaillée (inline, 1-1)** : titre stratégie, description, chiffre clé, plateformes (CSV)
  - Auto-création de la ligne `artist_details` si elle n'existe pas (upsert sur `artist_id`).
- Galerie photos (déjà présente)

Suppression de `ArtistDetailsEditor.tsx` (devenu inutile).

### 3. Seed des fiches manquantes

Insertion en BDD des `artist_details` manquantes pour les 9 artistes sans fiche, avec valeurs par défaut éditables :
- Stratégie générique cohérente avec leur catégorie
- Description courte placeholder
- `chiffre` vide (l'admin remplira)
- `plateformes` génériques selon catégorie (Spotify/YouTube/TikTok pour urbain, etc.)

### 4. UX : invisibilité du sélecteur "Artiste ciblé"

Déjà corrigé dans la version actuelle de `ArtistDetailsEditor` (cards). En fusionnant dans TabbedEditor, on bénéficie automatiquement de la visibilité tabs. Plus de problème de contraste.

## Détails techniques

```text
PageArtistePanel
├── 1. Hero (settings)
├── 2. Marquee
├── 3. Piliers (settings + PillarItemsEditor)
├── 4. Références artistes (settings + ArtistesEditor unifié)
│        ArtistesEditor
│        ├── TableEditor "Catégories d'artistes"
│        └── TabbedEditor "Artistes" — un onglet par artiste
│             ├── Bloc Identité (TabbedEditor existant)
│             ├── Bloc Fiche détaillée (NOUVEAU, upsert artist_details)
│             └── ArtistGalleryEditor (existant)
├── 5. Packs (PacksEditor)
├── 6. TheArtist
├── 7. Clip Portugal
├── 8. Vision (settings : vision_kicker, vision_title, vision_text)
├── 9. Équipe (TeamEditor)
├── 10. CTA
└── 11. Contact
```

**Migration de données** (pas de schéma) — INSERT seulement :
```sql
INSERT INTO artist_details (artist_id, strategie, description, chiffre, plateformes)
SELECT a.id, 'Stratégie à définir', 'Description à compléter dans l''admin.', '', '{Spotify,YouTube}'
FROM artists a
WHERE NOT EXISTS (SELECT 1 FROM artist_details d WHERE d.artist_id = a.id);
```

**Composant clé — sous-éditeur fiche inline** dans `ArtistesEditor` :
```tsx
function ArtistDetailsInline({ artistId }: { artistId: string }) {
  const { data, refetch } = useQuery(...artist_details where artist_id);
  const [draft, setDraft] = useState(data ?? defaultEmpty);
  const save = () => supabase.from("artist_details").upsert({ artist_id: artistId, ...draft });
  // formulaire inline avec Stratégie / Description / Chiffre / Plateformes
}
```

## Hors scope (déjà OK ou à traiter ensuite)
- Logo Hero accueil → tu m'as confirmé "INCORRECT" à un tour précédent ; je le retraite après cette restructuration si tu reposes le problème (le code Hero pointe bien sur `logo_white` mais le rendu ne passe pas — sans doute un bug spécifique au composant Hero, à debugger isolément).
- Loader initial : déjà branché sur `useSiteSettings`.
