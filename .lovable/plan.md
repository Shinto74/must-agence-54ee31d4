## Refonte du module Demandes — scalable jusqu'à 1000+ leads

### Objectif
Transformer l'onglet "Tableau de bord" en véritable CRM léger : recherche, filtres, archivage, fiche détaillée complète, notes internes, suivi de réponse — pensé pour 500 packs vendus + 400 contacts/an.

---

### 1. Base de données (migration)

**Champs ajoutés à `quote_requests`** (le wizard ne capture aucun moyen de recontact aujourd'hui — bloquant) :
- `name`, `email`, `phone`, `company` (étape "Coordonnées" obligatoire dans le wizard)
- `source` (`artiste` / `entreprise` / `pack-X`) — d'où vient la demande
- `archived_at` (timestamp, null = active)
- `assigned_to` (texte libre, ex. "Baptiste")
- `last_activity_at` (mis à jour à chaque note/changement de statut)

**Champs ajoutés à `contact_submissions`** :
- `company`, `sector`, `budget_estimate` (aujourd'hui crammés dans `message`, on les sépare)
- `source` (`artiste` / `entreprise` / `home`)
- `archived_at`, `assigned_to`, `last_activity_at`

**Nouvelle table `request_notes`** (fil de notes internes, partagé devis + contacts) :
- `request_type` (`quote` | `contact`), `request_id`, `author` (auth.uid), `body`, `created_at`
- RLS : lecture/écriture admin uniquement

**Statuts unifiés** (enum textuel) : `nouveau` → `en_cours` → `attente_client` → `traite` → `termine` → (archivé via `archived_at`)

**Auto-archivage** : trigger ou cron quotidien qui passe `archived_at = now()` quand `status = 'termine'` depuis 30 jours.

---

### 2. Wizard Devis — étape "Coordonnées"

Nouvelle étape finale obligatoire dans `QuoteWizard.tsx` :
- Prénom + Nom, Email (validé), Téléphone, Entreprise (optionnel)
- Validation Zod, message d'erreur clair, bouton "Envoyer ma demande" remplace l'actuel
- Mise à jour de l'insert Supabase pour stocker ces champs séparément

Côté `ContactSection.tsx` : on découpe l'objet `message` actuel en colonnes propres (`company`, `sector`, `budget_estimate`) au lieu d'une string concaténée.

---

### 3. Nouvel onglet "Demandes" (séparé du Dashboard)

Le Dashboard reste pour les KPIs + graphique 14j + bloc Stripe. **Tout le bloc liste de demandes part dans un onglet dédié** `RequestsPanel`.

**Structure de la page** :

```text
┌─────────────────────────────────────────────────────────────┐
│ [Recherche full-text]  [Vue: Inbox | Kanban]  [+ Filtres]   │
├──────────┬──────────────────────────────────┬───────────────┤
│ Sidebar  │  Liste (Inbox) ou Colonnes (KB) │ Fiche détail  │
│          │                                  │   (panneau    │
│ Tous (X) │  ☐ Marie L. — Pack Essentiel    │    droit)     │
│ Devis    │     "Notoriété + Image"          │               │
│ Contacts │     Il y a 2h • nouveau          │  Toutes les   │
│ ─────    │  ☐ Acme SAS — Contact           │  infos +      │
│ Nouveau  │     Budget 5k€ • secteur Tech    │  notes +      │
│ En cours │     Hier • en_cours              │  bouton       │
│ Attente  │  ...                             │  mailto       │
│ Traité   │                                  │               │
│ ─────    │                                  │               │
│ Archives │                                  │               │
└──────────┴──────────────────────────────────┴───────────────┘
```

**Filtres combinables** (en barre haute, chips multi-select) :
- Type : Devis / Contact
- Statut : nouveau / en_cours / attente_client / traité / terminé
- Source : page Artiste / page Entreprise / Home / Pack X
- Période : 7j / 30j / 90j / tout
- Assigné à : (liste membres)
- Inclure les archives (off par défaut)

**Recherche** : input full-text en haut, scanne nom + email + téléphone + entreprise + message + notes (debounced 300ms).

**Pagination** : 25 résultats / page, scroll infini ou bouton "Charger plus" — JAMAIS tout charger d'un coup.

---

### 4. Fiche détail (panneau latéral droit, drawer)

Quand on clique une demande, panneau slide-in avec :

**En-tête** : nom + email + téléphone (cliquable `tel:` / `mailto:`), badge type + source + statut éditable, date de création.

**Bloc "Demande"** : TOUS les champs du formulaire affichés en clair, bien hiérarchisés :
- Devis : profil, description projet (long), budget, deadline, attentes (chips)
- Contact : type de demande, entreprise, secteur, budget estimé, message complet

**Bloc "Notes internes"** : timeline chronologique, textarea pour ajouter une note, auteur + date affichés.

**Actions** :
- Bouton primaire **"Répondre par email"** → ouvre `mailto:` avec sujet pré-rempli (`Re: votre demande [pack/sujet]`) et corps incluant un rappel de la demande
- Bouton "Appeler" → `tel:`
- Bouton "Copier les infos" → presse-papier
- Bouton "Marquer comme traité" / "Archiver"
- Menu kebab : Assigner à…, Supprimer (avec confirmation double)

**Tracking** : chaque changement de statut ou note ajoutée met à jour `last_activity_at` → utile pour trier par "demandes oubliées".

---

### 5. Vue Kanban (bascule)

Toggle `Inbox ⇄ Kanban` dans la barre haute.
4 colonnes : **Nouveau · En cours · Attente client · Traité**. Drag & drop change le statut. Carte compacte : nom + 1 ligne + badge type + temps écoulé. Click ouvre la même fiche détail. Les "terminé" + archives ne s'affichent pas en Kanban (visibles en Inbox uniquement).

---

### 6. Archivage — "auto + manuel"

- **Bouton "Archiver"** sur chaque fiche (toujours dispo, met `archived_at = now()`)
- **Auto** : pg_cron quotidien archive tout `status = 'termine'` depuis 30 jours
- **Filtre "Inclure archives"** off par défaut → l'inbox reste légère même à 1000+ demandes
- **Onglet "Archives"** dans la sidebar avec compteur, mêmes filtres, possibilité de désarchiver

---

### 7. Export CSV intelligent

Le bouton "Exporter" exporte **les résultats filtrés courants** (pas tout). Colonnes propres et nommées en français, séparateur `;` pour Excel FR, BOM UTF-8 pour les accents.

---

### 8. Notifications

Le hook `useAdminNotifications` reste inchangé : badge sur l'onglet "Demandes" = nombre de `nouveau` + `en_cours` non archivés.

---

### Détails techniques

- **React Query** : clé `['admin_requests', filters, page]`, `keepPreviousData: true`, invalidation ciblée après mutation
- **Supabase** : queries paginées avec `.range(start, end)`, `.or()` pour la recherche full-text sur plusieurs colonnes, comptage séparé via `count: 'exact', head: true` pour la pagination
- **UI** : `Drawer` shadcn pour la fiche, `@hello-pangea/dnd` ou simple HTML5 DnD pour le Kanban (déjà léger), `Command` shadcn pour la recherche/filtres avancés
- **Validation wizard** : `zod` (déjà présent dans le projet)

### Fichiers touchés

**Nouveaux** :
- `src/components/admin/panels/RequestsPanel.tsx` (page principale)
- `src/components/admin/requests/RequestsList.tsx` (vue Inbox)
- `src/components/admin/requests/RequestsKanban.tsx` (vue Kanban)
- `src/components/admin/requests/RequestDetail.tsx` (drawer fiche)
- `src/components/admin/requests/RequestFilters.tsx` (barre filtres)
- `src/components/admin/requests/RequestNotes.tsx` (fil de notes)
- `src/hooks/useRequests.ts` (queries + mutations paginées)
- Migration Supabase (colonnes + table `request_notes` + cron archivage)

**Modifiés** :
- `src/components/artiste/QuoteWizard.tsx` (+ étape Coordonnées)
- `src/components/home/ContactSection.tsx` (insert champs séparés)
- `src/components/admin/panels/DashboardPanel.tsx` (retirer la liste, garder KPIs + graphique + Stripe + activité récente)
- `src/components/admin/AdminLayout.tsx` (réintroduire onglet "Demandes")
- `src/pages/Admin.tsx` (route)

---

### Hors scope (à confirmer si besoin plus tard)
- Envoi d'emails depuis le site (Resend) — choix actuel : `mailto:` natif
- Intégration calendrier / rappels automatiques
- Tags personnalisés par lead
