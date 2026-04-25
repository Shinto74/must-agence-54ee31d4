## Objectif

Réparer en profondeur la page **Entreprise** (admin + front) et corriger plusieurs incohérences sur les pages **Artiste**, **Gateway** et **Identité**.

---

## 1. Page Entreprise — Admin (PageEntreprisePanel)

**A. Réorganiser dans l'ordre EXACT du rendu front :**
```
1. Hero (+ stats hero)
2. Marquee
3. Services 3D — "Ce qu'on fait pour vous" ← MANQUANT
4. Secteurs (titres + Orbit3D)
5. Références (titres + catégories + clients)
6. CTA Final ("Prêt à grandir") ← MANQUANT (réécrit)
7. Contact (page Entreprise)
```

**B. Ajouter la section "Services — Ce qu'on fait pour vous"** (composant `Services3DScroll`) : éditeur de settings pour kicker, titre, sous-titre + table `services_entreprise` (gestion des services 3D).

**C. Ajouter la section "Références — En-têtes"** :
- `entreprise_ref_kicker` ("Références")
- `entreprise_ref_title_part1` ("Ils nous font")
- `entreprise_ref_title_accent` ("confiance")
- `entreprise_ref_subtitle` ("Des marques ambitieuses qui ont choisi l'excellence.")
- `entreprise_ref_footer_note` ("+ de 150 projets réalisés avec succès")

**D. Remplacer la section "CTA Band" (qui n'existe pas dans le design)** par un éditeur **"6. Section finale — Prêt à grandir"** alignée avec le composant `FinalCta` réel :
- `final_cta_kicker` ("Prêt à grandir ?")
- `final_cta_title_line1` ("Faites passer votre entreprise")
- `final_cta_title_line2` ("au niveau supérieur")
- `final_cta_subtitle` (textarea, ex : "Stratégie sur-mesure...")
- `final_cta_button` ("Contactez-nous")

→ Suppression définitive du bloc obsolète `ctaband_entreprise_*`.

**E. Câbler ces nouveaux settings dans `Entreprise.tsx`** (Hero ✅ déjà OK, Sections + Refs + FinalCta).

---

## 2. Page Entreprise — Front (corrections visuelles)

**A. Logo MUST AGENCE manquant dans "Expertise terrain / Secteurs d'expertise"** : ajouter dans `ExpertiseSection` un petit lock-up logo (utilise `logo_green` depuis settings) au-dessus du kicker, comme sur les autres sections.

**B. Section Références — fix complet :**
1. **Brancher sur la BDD** au lieu du tableau hardcodé `REFERENCES` : utiliser les tables `client_categories` (4 catégories) + `clients` (15 logos) avec galerie multi-versions.
2. **Affichage par catégories (4 catégories)** : ajouter au-dessus du carrousel des onglets ou sous-titres pour chacune des 4 catégories existantes en BDD.
3. **Tous les logos doivent défiler** (15 actuellement, pas seulement 5) : remplacer la grille fixe `lg:grid-cols-5` par un **carrousel défilant** identique à `ArtistReferences` (auto-scroll horizontal infini, drag possible, cards qui s'enchaînent).
4. Texte du footer (`+ de 150 projets…`) issu du setting `entreprise_ref_footer_note`.

---

## 3. Page Artiste — Corrections demandées

**A. KPI auto-créés à supprimer** : la migration précédente a inséré 9 fiches `artist_details` vides. Il faut **supprimer toutes les fiches `artist_details` dont tous les champs sont vides** (`strategie='' AND description='' AND chiffre='' AND plateformes='{}'`).

→ Dans `ArtistDetailsInline.tsx`, NE PAS pré-créer la ligne. Garder le comportement upsert actuel (insert seulement à la 1ère sauvegarde quand l'utilisateur remplit), avec le badge "À créer" déjà présent.

**B. Section Contact (page Artiste) — pas synchro BDD** : le composant `ContactSection` reçoit ses props depuis `ARTISTE_PAGE.contact` (constants.ts) et `SITE.contact`. Refactoriser `Artiste.tsx` pour lire ces valeurs depuis `useSiteSettings` :
- `contact_artiste_heading` / `contact_artiste_text` / `contact_artiste_subtext` (déjà dans l'admin)
- `contact_email` / `contact_phone` / `contact_location` (déjà dans Identité)

Appliquer la même correction sur `Entreprise.tsx` (Contact entreprise).

---

## 4. Galeries d'images — uniformiser

Sur **toutes les sections où on utilise déjà `MediaGalleryEditor`** (clients, identité/logos, gateway, sectors, team, artistes), retirer le champ "image active" (input `Logo actif` / `Image active`) du `SettingsBlock` ou `TableEditor` qui le précède : la galerie suffit (on clique sur une vignette pour activer).

Concrètement :
- `IdentitePanel` : retirer les champs `logo_white` et `logo_green` du `SettingsBlock` (garder uniquement le titre + la galerie en dessous).
- `PageAccueilPanel` (Gateway) : retirer les `SettingsBlock` "Image active" pour `gateway_image_artiste` et `gateway_image_entreprise`.
- `ClientsEditor` : retirer le champ `logo_url` (type image) du `TableEditor.fields` — la galerie en dessous gère tout.
- `SectorsEditor` / `TeamEditor` / `ArtistesEditor` : pareil pour les champs image principale du formulaire d'identité.

---

## 5. Page d'entrée (Gateway) — admin

Ajouter dans `PageAccueilPanel` les champs textuels qui sont actuellement codés en dur dans `GatewayPage.tsx` :
- Sous-titre "Pôle Artiste" et "Pôle Entreprise"
- Libellés des labels secondaires (ex : "Musique · Influence · Lancement")
- CTA boutons

Settings : `gateway_artiste_label`, `gateway_artiste_subtitle`, `gateway_artiste_cta`, `gateway_entreprise_label`, `gateway_entreprise_subtitle`, `gateway_entreprise_cta`.

---

## Détails techniques

**Migrations / data ops (via insert tool) :**
- `DELETE FROM artist_details WHERE strategie='' AND description='' AND chiffre='' AND coalesce(array_length(plateformes,1),0)=0;`
- Seed des nouveaux site_settings (entreprise_ref_*, final_cta_*, gateway_*) avec valeurs courantes.

**Pas de changement de schéma de table** (toutes les tables nécessaires existent déjà : `services_entreprise`, `clients`, `client_categories`, `site_settings`, `media_galleries`).

**Composants à modifier :**
- `src/components/admin/panels/PageEntreprisePanel.tsx` (réorg + nouvelles sections)
- `src/components/admin/panels/PageAccueilPanel.tsx` (gateway labels)
- `src/components/admin/panels/IdentitePanel.tsx` (retirer doublons image)
- `src/components/admin/panels/editors/ClientsEditor.tsx` (retirer logo_url du form)
- `src/components/admin/panels/editors/SectorsEditor.tsx`, `TeamEditor.tsx`, `ArtistesEditor.tsx` (idem)
- `src/pages/Entreprise.tsx` (logo dans Expertise, References branchées BDD avec carrousel, FinalCta câblé settings, Contact câblé)
- `src/pages/Artiste.tsx` (Contact câblé settings)
- `src/pages/GatewayPage.tsx` (lire les nouveaux settings)

---

## Questions

Avant d'attaquer, deux confirmations rapides :
