Plan de correction

1. Remplacer le mécanisme fragile de traduction DOM
- Garder le dictionnaire manuel pour les textes statiques simples, mais arrêter de compter uniquement sur le MutationObserver exact-text.
- Ajouter une vraie fonction de traduction utilisable dans React, capable de traduire les chaînes, les fragments, les textes avec ponctuation, et les valeurs dynamiques.
- Ajouter les traductions manquantes immédiates relevées visuellement : hero Artiste, services/piliers, catégories artistes, packs, tooltips, Portugal, vision, équipe, formulaires, page Entreprise, accueil/gateway, footer, cookies et pages légales.

2. Traduire les données dynamiques via les colonnes JSONB déjà créées
- Mettre à jour les hooks publics pour appliquer `row.translations.en` quand la langue active est EN :
  - `site_settings`
  - `artist_pillars`, `pillar_left_items`, `pillar_right_items`
  - `artist_categories`, `artists`, `artist_details`
  - `packs`, `pack_features`, `pack_tooltips`
  - `clip_portugal_advantages`
  - `team_members`
  - `theartist_features`
  - `contact_form_types`, `contact_sectors`
  - `services_entreprise`, `service_entreprise_chips`, `entreprise_sectors`, `clients/client_categories`
  - `form_steps`, `form_options`, stats, process/expertise si affichés
- Laisser les noms propres/projets protégés non traduits quand c’est normal : Must Agence, TheArtist, noms d’artistes, noms de marques.

3. Remplir les traductions anglaises en base
- Créer une migration qui renseigne les JSONB `translations.en` pour les contenus existants déjà visibles sur le site.
- Couvrir explicitement les exemples que tu as listés :
  - `Influence Artistique` → `Artistic Influence`
  - `On ne suit pas les tendances on les crée` → `We don’t follow trends, we create them`
  - `Influence & TikTok Activation` et toutes ses descriptions/items
  - `Urbain`, `Pop / Variété`, `Électro / International`
  - Tous les packs, features, bonus, rassurances, badges, prix suffixes et boutons
  - Section Portugal complète
  - Vision complète
  - Équipe complète
  - Tous les formulaires et états d’envoi
- Corriger aussi les mélanges actuels comme `Choisissez la formule tailored to your ambition.` en traduisant la phrase entière, pas seulement un fragment.

4. Ajouter la gestion EN dans l’admin pour chaque section, pas seulement un dictionnaire global
- Étendre les éditeurs admin existants pour afficher, dans chaque formulaire public, un champ “Version anglaise” pour les champs textuels visibles.
- Sauvegarder ces champs dans `translations.en.<champ>` de la ligne concernée.
- Pour `site_settings`, stocker la version anglaise dans la colonne JSONB de la ligne setting plutôt que seulement dans `i18n.en.*`.
- Garder le panneau “Traductions EN” comme secours global/recherche, mais le rendre utile pour auditer les chaînes non rattachées à une table.

5. Audit visuel page par page
- Tester en EN sur : `/`, `/artiste`, `/entreprise`, `/checkout`, `/mentions-legales`, `/politique-confidentialite`, `/cgv`, `/cgu`, `/politique-cookies`.
- Extraire le texte visible section par section et corriger tout résidu français non voulu.
- Vérifier aussi les modales, tooltips, boutons, carrousels, formulaires, toast/messages, menus mobile et footer.

Résultat attendu
- En mode EN, le site ne doit plus afficher de sections “moitié français / moitié anglais”.
- Tous les textes visibles par le visiteur sont traduits manuellement.
- L’admin permet de gérer la version anglaise des contenus éditables, section par section.