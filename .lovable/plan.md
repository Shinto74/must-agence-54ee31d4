

# Audit complet — Cahier des charges vs. site actuel

## Résumé des écarts identifiés

Après analyse complète des 3 parties du cahier des charges, du LOVABLE_MIGRATION.md et du code actuel, voici les problèmes à corriger.

---

## PARTIE 1 — Identité Visuelle & Structure

### Conforme
- Dark mode #0A0A0A avec accent vert fluo #CCFF00
- Polices Clash Display, Outfit, JetBrains Mono
- Pôle Artiste et Pôle Entreprise séparés
- Création Visuelle, Stratégie de Lancement, Marketing & Influence, Brand Content, Booking — tous les 6 services artiste sont présents
- Pôle Entreprise : Social Media, Production de Contenu, Growth Marketing, Branding & Design, E-Réputation — les 6 services sont présents
- Équipe présente
- Portfolio / Références présent
- Contact avec formulaire + WhatsApp

### Écarts à corriger
1. **Contact : numéro de téléphone absent de l'affichage** — Le cahier mentionne un lien WhatsApp ET un téléphone. Le `ContactSection` n'affiche pas le téléphone (`phone` n'est même pas passé en prop ni rendu).
2. **Contact : adresse "Paris, France" absente** — Le cahier mentionne une localisation. Non affichée.

---

## PARTIE 2 — Packs & Formulaire Devis

### Conforme
- 3 packs avec bons tarifs (350€, 550€, 1500€ HT)
- Pack 2 a le badge "Recommandé"
- Bonus et textes de réassurance corrects
- Formulaire devis 5 étapes avec les bons types (radio, textarea, date, checkbox)
- Options de profil : Artiste Indépendant / Label / Entreprise
- Options budget : Moins de 1k€ / 1k€–3k€ / 3k€–5k€ / +5k€
- Options attentes : Notoriété / Ventes / Image de marque / Accompagnement humain
- CTA "Demander un devis personnalisé" sous les packs
- Section sur-mesure avec texte correct

### Écarts à corriger
3. **Pack 1 features incomplètes** — Le cahier des charges (Partie 2) détaille :
   - "Promotion Playlisting (1 mois) : Placement sur Spotify, Deezer, Apple Music (Niches précises, trafic qualifié)"
   - "Ads Pop-up Multi-plateformes : Promotion d'un teaser (Google, Meta, TikTok) avec lien de redirection direct"
   - "DA & Stratégie Social Media : Planning éditorial personnalisé pour optimiser votre feed et l'algorithme"
   
   Dans le code, les features sont raccourcies. Les descriptions détaillées après les ":" sont tronquées.

4. **Pack 2 features incomplètes** — Même problème, les détails après ":" sont absents :
   - "Playlisting Étendu : Campagne massive auprès d'un réseau élargi de curateurs et playlists majeures"
   - "Double Impact Publicitaire : Promotion de 2 teasers publicitaires pour une visibilité omniprésente"
   - "Community Management (1 mois) : Un CM dédié s'immerge dans votre projet pour animer et engager votre communauté"
   - "Content Design : Création de visuels de résultats (Stats playlists, certifications, caps franchis)"

5. **Pack 3 features incomplètes** — Détails tronqués pour les 7 features.

6. **CTA "Nous contacter" ou "Demander un devis" manquant après chaque pack** — Le cahier dit "Intégrer des boutons Nous contacter ou Demander un devis après chaque description de pack". Les cards ont un bouton "Nous contacter" vers #contact. C'est conforme mais pointe vers le contact général et non vers le formulaire de devis (#devis). A vérifier si c'est volontaire.

7. **Icônes modernes pour chaque point des packs** — Le cahier dit "Utiliser des icônes modernes pour chaque point des packs". Actuellement les features utilisent un simple "✓" vert.

---

## PARTIE 3 — Références & Design

### Conforme
- 19 artistes avec les bonnes photos et catégories (Urbain 7, Pop/Variété 4, Électro/International 8)
- 15 logos entreprises avec les 4 bonnes sous-catégories
- Animations parallax/fade-in au scroll
- Logos entreprises : marquee défilant sobre, monochrome au repos
- Artistes : portraits avec animations grayscale → couleur au hover

### Écarts à corriger
8. **"Le Pain Quotidien" — nom raccourci** — Dans constants.ts ligne 165, le nom est "Le Pain Quotidien" ce qui est correct. Conforme.

9. **Logos entreprises hover : le cahier dit "reprend ses couleurs au survol"** — L'implémentation utilise `grayscale(1) opacity(.4)` → `grayscale-0 opacity(100) scale(1.08)`. Conforme.

10. **Artistes visuels "portraits/covers avec des animations fluides (fade-in, parallax)"** — Le fade-in au scroll est là. Le parallax sur les cartes artistes n'est pas implémenté (seulement le grayscale → color + scale). Écart mineur.

---

## LOVABLE_MIGRATION.md — Écarts additionnels

11. **Vision section : pas de logo affiché** — Le migration doc dit "Vision (quote + texte + logo)". Le composant Vision n'affiche pas le logo Must Agence.

12. **Footer : liens manquants** — Le migration doc mentionne les liens : Pôle Artiste, Pôle Entreprise, Équipe, Portfolio, Contact. Le footer actuel n'a que Accueil, Pôle Artiste, Pôle Entreprise. Il manque Équipe, Portfolio, Contact.

13. **Footer description manquante** — "Agence d'influence spécialisée musique et marques. Paris." devrait apparaître dans le footer.

---

## Plan de corrections

### Fichiers à modifier

**1. `src/lib/constants.ts`** — Enrichir les features des 3 packs avec les descriptions complètes du cahier des charges Partie 2.

**2. `src/components/home/ContactSection.tsx`** — Ajouter l'affichage du téléphone et de la localisation (passer `phone` et `location` en props).

**3. `src/pages/Index.tsx`** — Passer phone et location au ContactSection.

**4. `src/components/home/Vision.tsx`** — Ajouter le logo Must Agence.

**5. `src/components/layout/Footer.tsx`** — Ajouter les liens Équipe, Portfolio, Contact + description agence + mention Paris.

**6. `src/components/artiste/PackCards.tsx`** — (Optionnel) Remplacer les "✓" par des icônes modernes via Lucide icons.

### Ce qui est déjà conforme (pas de changement nécessaire)
- Structure des 3 pages (Home, Artiste, Entreprise)
- Ordre des sections sur chaque page
- Les 19 artistes et 15 logos avec bonnes catégories
- Design system (couleurs, polices, easing)
- Packs : tarifs, badges, bonus, réassurance
- Formulaire devis 5 étapes
- Animations (curseur, loader, slash transition, scroll reveal, compteurs, orbes, marquee, hover effects)
- Header avec navigation
- Section sur-mesure + CTA

