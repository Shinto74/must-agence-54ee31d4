import { CreditCard, ExternalLink } from "lucide-react";

export default function PaiementsPanel() {
  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl border border-border bg-surface text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CreditCard size={20} className="text-primary" />
        </div>
        <h2 className="font-clash text-xl font-bold text-foreground mb-2">
          Paiements gérés directement par Stripe
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
          Les paiements des packs passent désormais par les liens Stripe Payment Link configurés dans chaque pack.
          Pour consulter, rembourser ou exporter vos transactions, ouvrez directement votre tableau de bord Stripe.
        </p>
        <a
          href="https://dashboard.stripe.com/payments"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider hover:brightness-110 transition-all"
        >
          Ouvrir Stripe Dashboard <ExternalLink size={14} />
        </a>
        <p className="text-[11px] text-muted-foreground/70 mt-6">
          Astuce : pour modifier un lien de paiement, rendez-vous dans <strong>Page Artiste → Packs</strong>.
        </p>
      </div>
    </div>
  );
}
