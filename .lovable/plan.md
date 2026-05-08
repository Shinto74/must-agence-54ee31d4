## Objectif

Simplifier les formulaires (qualification business, pas juste format) et alléger drastiquement le panneau "Demandes & Contacts" en cockpit lisible, avec un score lead automatique et une alerte de relance >24h.

## 1. Refonte du formulaire devis (QuoteWizard)

Nouveau parcours — `src/lib/constants.ts` (`QUOTE_STEPS`) + `QuoteWizard.tsx` (logique conditionnelle).

Étapes :
1. **Profil** — Artiste indépendant / Label / Entreprise (inchangé)
2. **Style musical** *(si Artiste/Label)* OU **Taille entreprise** *(si Entreprise)* — branchement conditionnel
   - Musique : Rap · Pop · Afro · Électro · Variété · Autre
   - Entreprise : Solo · Startup · PME · Marque établie
3. **Objectif principal** *(NOUVEAU, multi-choix)* — Visibilité · Image · Écoutes · Lancement projet · Stratégie long terme · Ventes · Communauté
4. **Description du projet** (textarea, inchangée)
5. **Budget** *(simplifié visuellement)* — <1k · 1k–3k · 3k–5k · 5k–10k · 10k+
6. **Délai** *(NOUVEAU, remplace le calendrier en première intention)* — ASAP · Ce mois-ci · 1–3 mois · Je me renseigne
   - Le calendrier précis reste disponible mais s'affiche uniquement si "ASAP" ou "Ce mois-ci" (réservé aux leads chauds)
7. **Coordonnées** (inchangé)

Le secteur côté artiste est supprimé (remplacé par style musical).

## 2. Refonte du formulaire contact (ContactSection)

`src/components/home/ContactSection.tsx` :
- Sur la page Artiste : remplacer "Secteur" par "Style musical" (réutilise une nouvelle table `artist_styles` ou un setting JSON simple).
- Sur la page Entreprise : ajouter "Taille entreprise" (Solo/Startup/PME/Marque).
- Ajouter un champ "Objectif principal" (select).
- Ajouter "Délai" (4 options).
- Le champ libre Message reste.

## 3. Stockage BDD

Migration ajoutant aux tables existantes les colonnes business :
- `quote_requests` : `style` text, `company_size` text, `objective` text, `timeline` text, `lead_score` int (calculé côté serveur via trigger sur insert/update).
- `contact_submissions` : `style` text, `company_size` text, `objective` text, `timeline` text, `lead_score` int.

Trigger PL/pgSQL `compute_lead_score()` :
```text
+30 si budget contient "5k", "10k", "+"
+20 si timeline = "asap" ou "ce_mois"
+20 si objective non vide
+30 si project_desc/message > 80 caractères
```
Recalculé sur INSERT et UPDATE des champs concernés.

## 4. Refonte du cockpit "Demandes & Contacts"

`src/components/admin/panels/RequestsPanel.tsx` — réécriture allégée.

**Statuts simplifiés (6 colonnes Kanban)** :
Nouveau · À rappeler · En discussion · Client signé · Sans réponse · Archivé

**Vues** : Kanban (par défaut) + Liste compacte. Suppression de la vue Bento, Table avancée, Activity feed, KPI cliquables, widget "Priorités" — trop lourds.

**Carte lead (lecture rapide)** :
```text
[🔥 hot]  [🎵 artiste / 💼 entreprise]
Nom · email
💰 5k+ · ⏱ ASAP · 🎯 Visibilité
Score 82 · il y a 2h
[Statut select]   [Archiver]
```
- 🔥 si `lead_score ≥ 70`
- Badge rouge "RELANCE" si `status ∈ {nouveau, à_rappeler}` ET `last_activity_at < now() - 24h`

**Filtres essentiels uniquement** : Type (Artiste/Entreprise) · Budget · Statut · Période · Recherche libre. Suppression du reste.

**Drawer détail** : conservé mais épuré (coordonnées, demande, notes internes, actions Répondre/Appeler/Copier/Archiver).

## 5. Détails techniques

- Mapping source → type d'icône (🎵 si `source ∈ {artiste, pack-*}`, 💼 si `entreprise`).
- `lead_score` calculé en SQL (trigger) pour rester cohérent même si quelqu'un édite la demande.
- Le badge "RELANCE >24h" est calculé côté front (pas besoin de cron).
- Aucune automatisation email, aucun assignement multi-utilisateur, pas d'API externe.

## Fichiers touchés

- `src/lib/constants.ts` — refonte `QUOTE_STEPS` (logique conditionnelle gérée dans le wizard)
- `src/components/artiste/QuoteWizard.tsx` — branches conditionnelles + envoi nouveaux champs
- `src/components/home/ContactSection.tsx` — nouveaux champs (style/taille/objectif/délai)
- `src/components/admin/panels/RequestsPanel.tsx` — refonte cockpit, suppression Bento/Table/Activity
- `supabase/migrations/...sql` — colonnes + trigger `compute_lead_score`

## Hors scope (volontairement)

- Pas d'envoi d'email automatique
- Pas d'assignation utilisateur multi-membres
- Pas de SLA configurable (24h en dur)
- Pas d'export CSV avancé
