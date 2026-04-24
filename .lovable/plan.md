## Objectif
Refondre le CRM pour qu’il soit simple, logique et sans doublons, avec une organisation centrée sur les pages du site, et internaliser tous les contenus utilisés pour ne plus dépendre de liens externes.

## Constats actuels
- Le CRM mélange plusieurs logiques :
  - édition par table métier (`Packs`, `Services`, `Équipe`, `Artistes`, `Clients`)
  - édition par regroupement éditorial (`Contenu sections`)
  - pseudo entrée globale (`Éditeur visuel`)
- Une partie du contenu est éditable à plusieurs endroits.
- Les `site_settings` servent de conteneur trop générique, ce qui produit une liste de paramètres difficile à comprendre.
- Une partie des images, vidéos et logos repose encore sur des URLs externes ou sur des constantes locales.
- L’organisation suit la technique, pas la logique métier d’édition.

## Plan proposé

### 1. Repenser la navigation admin par page
Remplacer la sidebar actuelle par une structure simple :
- Dashboard
- Demandes
- Paiements
- Accueil
- Page Artiste
- Page Entreprise
- Global / Identité
- Paramètres techniques

Chaque onglet regroupera uniquement ce qui alimente réellement la page correspondante.

### 2. Fusionner l’édition en un seul point cohérent
Supprimer le doublon entre `Éditeur visuel`, `Contenu sections`, `Packs`, `Services`, `Équipe`, `Artistes`, `Clients`.

Nouvelle logique :
- `Accueil` : hero, vision, CTA, stats, équipe, pôles, portfolio, contact, marquee home
- `Page Artiste` : hero, services, expertise, process, packs, TheArtist, Clip Portugal, artistes, marquee artiste
- `Page Entreprise` : hero, secteurs, services, expertise, process, clients, marquee entreprise
- `Global / Identité` : logos, nom de marque, footer, header, contacts, réseaux
- `Paramètres techniques` : seulement ce qui ne relève pas du contenu marketing

### 3. Transformer les paramètres techniques en formulaires lisibles
Au lieu d’exposer une liste brute de clés, afficher des sections métier avec labels clairs.

Exemples :
- `Hero Entreprise`
  - Badge
  - Titre ligne 1
  - Titre ligne 2
  - Description
  - CTA principal
  - CTA secondaire
  - Vidéo
- `Identité`
  - Logo blanc
  - Logo vert
  - Nom de marque
  - Email
  - Téléphone

Les clés internes resteront masquées.

### 4. Garder la base actuelle au départ, mais masquer sa complexité
Dans un premier temps :
- conserver les tables existantes
- conserver `site_settings` pour les champs simples
- réorganiser l’interface admin par page et par section
- retirer les écrans redondants

Dans un second temps, normaliser si certaines zones restent trop dispersées.

### 5. Importer dans le backend tous les contenus dépendants de liens externes
Ajouter un lot dédié pour supprimer la dépendance aux URLs externes.

Travail prévu :
- recenser tous les médias externes encore utilisés dans le front et dans les constantes
- rapatrier ces fichiers dans le stockage du projet
- remplacer les URLs externes par des URLs internes stockées dans la base
- s’assurer que logos, images, vidéos et assets modifiables passent tous par le backend et le CRM
- identifier ce qui doit vivre dans `site_settings` et ce qui doit rester dans des tables dédiées

Objectif :
- plus de dépendance GitHub/CDN externe pour les contenus métier du site
- tous les médias importants modifiables depuis le CRM
- le site reste fonctionnel même si les liens externes disparaissent

### 6. Sécuriser le mapping “CRM -> site”
Pour chaque écran admin, vérifier précisément :
- quels composants front lisent quelles données
- quels champs sont encore hardcodés
- quels contenus sont en double
- quels formulaires admin modifient vraiment le rendu du site
- quels médias sont encore locaux ou externes au lieu d’être pilotés par la base

Livrable attendu : une cartographie propre entre chaque bloc du CRM, la source de données et la section réelle du site.

### 7. Simplifier l’expérience d’édition
Dans chaque page admin :
- sections repliables
- aperçu clair quand utile
- boutons Ajouter / Modifier / Supprimer cohérents
- upload direct dans le stockage du projet
- intitulés français clairs
- suppression des écrans techniques inutiles

### 8. Audit final après refonte
À la fin, produire un audit clair avec :
- ce qui est modifiable depuis le CRM
- ce qui est désormais internalisé dans la base et le stockage
- ce qui est encore hardcodé
- ce qui est encore local/externe
- ce qui est relié en direct au site
- ce qui reste à faire pour rendre le back-office totalement pilotable

## Résultat attendu
Un CRM beaucoup plus simple à comprendre :
- on édite une page depuis l’onglet de cette page
- on ne voit plus plusieurs fois le même contenu
- les réglages techniques sont séparés du contenu marketing
- les textes, listes, images, logos et vidéos importants sont modifiables depuis un seul endroit logique
- le site ne dépend plus de liens externes pour ses contenus métier

## Détails techniques
- Réorganiser `src/components/admin/AdminLayout.tsx` pour une navigation par page.
- Remplacer ou refondre `VisualEditorPanel` et `ContentSectionsPanel` pour produire des panels orientés page.
- Réutiliser `useAdminCrud` et les tables existantes (`artists`, `clients`, `packs`, `services_*`, `site_settings`, `marquee_items`, `entreprise_sectors`, etc.) sans exposer leur structure technique dans l’UI.
- Ajouter une couche de configuration UI côté admin pour grouper les champs par page/section.
- Auditer les composants front qui consomment encore des constantes, des assets locaux ou des liens externes.
- Rapatrier les médias externes vers le stockage du projet, puis mettre à jour les données pour qu’elles pointent vers des URLs internes.
- Prévoir, si nécessaire, de nouveaux champs de données uniquement quand ils servent réellement l’édition et évitent des hacks dans `site_settings`.

## Recommandation d’exécution
Je recommande 3 étapes :
1. Refonte complète du CRM par page et suppression des doublons visuels.
2. Internalisation de tous les médias et contenus encore dépendants de sources externes.
3. Audit final de raccordement pour lister ce qui reste hardcodé et ce qui doit encore être branché.