## Objectif

Le client a fourni 3 liens Stripe Payment Link directement (hosted by Stripe). On ne crée plus de session Checkout côté serveur — on redirige simplement vers son lien. Les liens doivent être **modifiables depuis l'admin** pour chaque pack (au cas où il en change un).

## Liens fournis

- Pack Essentiel → `https://buy.stripe.com/00w4gz28S9gXcZp4qOcbC11`
- Pack Ascension → `https://buy.stripe.com/00w9AT3cW0Kr3oP7D0cbC12`
- Pack Explosion → `https://buy.stripe.com/fZubJ16p8eBh1gHbTgcbC13`
- Pack 4 (sur devis) → reste sur le wizard (pas de lien)

## Changements

### 1. Base de données
Ajouter une colonne `payment_link_url text` (nullable) à la table `packs`. Backfill avec les 3 URLs ci-dessus pour les packs 1-2-3 selon `display_order`.

### 2. Admin (`PacksEditor.tsx`)
Ajouter un champ éditable « Lien de paiement Stripe » (placeholder `https://buy.stripe.com/...`, hint « Laisser vide = bouton Devis »). Position dans le formulaire : juste après `price_suffix`.

### 3. Front pack (`PackCards.tsx`)
- Supprimer le `PACK_PRICE_MAP` codé en dur et `resolvePriceId`.
- Lire `pack.paymentLinkUrl` (mappé depuis `payment_link_url`).
- Logique du bouton :
  - Si `paymentLinkUrl` présent → `<a href={url} target="_blank" rel="noopener noreferrer">Choisir ce pack</a>` (redirige vers Stripe hosted).
  - Sinon → bouton « Obtenir un devis » (wizard actuel).
- Ajouter `paymentLinkUrl` dans l'interface `Pack` et la projection du hook `useSupabaseData` / `usePacks`.

### 4. Nettoyage
- Routes `/checkout` et `/checkout/confirmation` (`CheckoutPage.tsx`, `CheckoutReturn.tsx`, `StripeEmbeddedCheckout.tsx`) deviennent inutiles pour les packs. **Question** : on les **supprime entièrement** (plus simple, le client ne les utilise pas) ou on les **garde dormantes** au cas où il voudrait revenir à un checkout intégré plus tard ? → recommandation : **supprimer** + retirer la route dans `App.tsx` et l'edge function `create-checkout` / `get-stripe-price` qui ne servent plus.
- `PaymentTestModeBanner` peut rester (sans effet en prod) ou être retiré.

### 5. Admin — paiements
Le panel `PaiementsPanel.tsx` lit la table `payments` qui était alimentée par le webhook Stripe Checkout. Avec des Payment Links externes, **les paiements ne reviennent plus dans notre BDD** sauf à brancher un webhook sur le compte Stripe du client (ce qui demande ses clés API). 
**Question** : on cache l'onglet « Paiements » de l'admin ou on le garde avec un message « Voir directement sur le dashboard Stripe » ?

## Détails techniques

```sql
ALTER TABLE public.packs ADD COLUMN payment_link_url text;
```
Puis insertions/updates des 3 URLs sur les packs `display_order` 1, 2, 3.

```ts
// PackCards.tsx
const url = (pack as any).paymentLinkUrl;
const isQuotePack = !url;
// ...
{isQuotePack ? <button onClick={onOpenQuote}>…</button>
            : <a href={url} target="_blank" rel="noopener noreferrer">Choisir ce pack</a>}
```

Fichiers touchés : `supabase/migrations/*` (nouvelle), data insert, `PacksEditor.tsx`, `PackCards.tsx`, `useSupabaseData.ts` (mapper `payment_link_url`→`paymentLinkUrl`), éventuellement `App.tsx` + suppression de `CheckoutPage.tsx`, `CheckoutReturn.tsx`, `StripeEmbeddedCheckout.tsx`, edge functions `create-checkout` & `get-stripe-price`.

## Questions avant implémentation

1. **Routes /checkout et edge functions Stripe** : je supprime tout (recommandé) ou je garde dormant ?
2. **Onglet « Paiements » admin** : je le masque, ou je garde avec un message renvoyant vers Stripe ?
3. Le bouton ouvre le lien Stripe en **nouvel onglet** (recommandé, pour ne pas perdre la nav du site) ou dans le **même onglet** ?
