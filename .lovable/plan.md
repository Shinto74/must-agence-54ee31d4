## Contexte — ce que j'ai mal compris

Tu as raison sur tout. Vérifications faites dans le code :

1. **La "Page d'accueil" du site = `GatewayPage`** (split Pôle Artiste / Pôle Entreprise). Le composant `Index.tsx` qui contient Hero/Vision/Team/etc. **n'est jamais affiché** : la route `/` est interceptée par `GatewayPage` dans `App.tsx`. Mon panneau "Page d'accueil" éditait donc une page fantôme.
2. **Vision** et **Équipe** ne sont visibles **que** sur `/artiste` (page utilisateur). À retirer complètement de la "page d'accueil" admin.
3. **Clip Portugal** : l'icône emoji enregistrée en BDD est ignorée — le composant force un cercle SVG codé en dur (`defaultIcon`).
4. **Vision** : le champ `vision_quote` (la phrase « Dans un monde de bruit… ») n'est pas exposé dans l'admin, donc impossible à éditer.
5. **Galerie multi-images** : actuellement seulement sur Artistes — à généraliser à tous les visuels du site.

---

## Plan

### 1. Refondre l'admin pour qu'il colle au site réel

**Renommer "Page d'accueil" → "Page d'entrée (Gateway)"** et n'y mettre QUE ce qui est sur `GatewayPage` :
- Image de fond Pôle Artiste (avec galerie multi-images, choix de l'active)
- Image de fond Pôle Entreprise (idem)
- Logo central (déjà géré dans Identité)
- Textes des deux côtés (titres, sous-titres, libellés boutons)
- Baseline du bas (« Influence · Musique · Marques »)

**Supprimer du panneau Gateway** : Hero, Marquee, PolesGateway (ce composant n'est jamais rendu), Références, Vision, Équipe, CTA Band, Contact (ils n'existent pas sur cette page).

**Page Artiste** : conserver Vision + Équipe ici (et seulement ici), retirer les mentions « partagé avec accueil ».

**Page Entreprise** : nettoyer aussi (`ClientsEditor` actuellement dupliqué, à n'afficher que là où c'est pertinent).

### 2. Compléter la section Vision dans l'admin

Ajouter dans le panneau Page Artiste, section "Notre Vision" :
- `vision_kicker` (sur-titre — déjà là)
- `vision_title_line1` + `vision_title_line2` (« L'influence est » / « une science. ») — actuellement absents
- `vision_quote` (la citation manquante : « Dans un monde de bruit… ») — actuellement absent
- `vision_text` (déjà là)

### 3. Réparer les icônes Clip Portugal

Modifier `ClipPortugal.tsx` pour afficher l'icône du DB (emoji ou nom Lucide) au lieu du cercle SVG hardcodé. Si l'icône est un emoji court → l'afficher dans la pastille. Sinon → mapper vers une icône Lucide (Play, Map, Plane, Users, etc.). Garder un fallback élégant.

### 4. Système universel de galerie multi-images

Créer un composant `MediaGallery` réutilisable (basé sur le pattern `ArtistGalleryEditor` actuel) + table SQL générique, et l'appliquer à tous les contenus visuels :

| Contenu | Champ image actuel |
|---|---|
| Artistes | `artists.image_url` ✅ déjà fait |
| Clients (logos) | `clients.logo_url` |
| Équipe (photos) | `team_members.image_url` |
| Secteurs entreprise | `entreprise_sectors.image_url` |
| Portfolio cases | (à vérifier) |
| Hero Artiste (vidéo + poster) | `hero_artiste_video_url` |
| Hero Entreprise (vidéo) | `hero_entreprise_video_url` |
| Clip Portugal (vidéo + poster) | `clip_portugal_video_url`, `clip_portugal_poster` |
| Gateway (images des deux pôles) | `gateway_image_artiste`, `gateway_image_entreprise` |
| Logos identité (green / white) | `logo_green`, `logo_white` |

**Implémentation** : table `media_galleries(id, owner_table, owner_id, url, display_order, created_at)` + RLS, et un composant `<MediaGalleryEditor ownerTable="..." ownerId="..." activeUrl={...} onSelectActive={...} />` branché partout. Pour les `site_settings` (pas d'`owner_id`), on utilise la `key` comme owner_id virtuel.

### 5. Ordre d'exécution

1. Migration SQL : table `media_galleries` + seed (recopier les `image_url` actuels).
2. Composant `MediaGalleryEditor` générique.
3. Refonte `PageAccueilPanel` → `PageGatewayPanel` (renommage + nettoyage radical).
4. Mise à jour `AdminLayout` (libellé "Page d'entrée").
5. Compléter le bloc Vision dans `PageArtistePanel` (3 champs manquants).
6. Mettre à jour `Vision.tsx` pour lire `vision_title_line1/2` séparés.
7. Fix icônes `ClipPortugal.tsx` (lire le champ `icon` du DB).
8. Brancher `MediaGalleryEditor` dans : `ClientsEditor`, `TeamEditor`, `SectorsEditor`, panneau Identité, panneau Gateway, panneaux Hero Artiste/Entreprise, section Clip Portugal.

---

## Questions de clarification

- Pour les **logos clients** (souvent un seul logo par marque) : tu veux quand même la galerie multi-versions (utile pour A/B tester un logo couleur vs noir & blanc), ou un simple upload remplaçable suffit ?
- Pour la **page d'entrée (Gateway)** : tu veux pouvoir éditer aussi les libellés des boutons (« Je suis un Artiste » / « Je suis une Entreprise ») et les sous-titres (« Musique · Influence · Lancement ») ? Ils sont actuellement codés en dur.
