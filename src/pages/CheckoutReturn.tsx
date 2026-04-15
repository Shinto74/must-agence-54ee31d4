import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function CheckoutReturn() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {sessionId ? (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-clash text-3xl font-bold text-foreground mb-3">
              Paiement confirmé !
            </h1>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              Merci pour votre confiance. Vous allez recevoir un email de confirmation avec tous les détails de votre commande.
            </p>
            <Link
              to="/artiste"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-sm uppercase tracking-wider hover:brightness-110 transition-all"
            >
              Retour au site <ArrowRight size={16} />
            </Link>
          </>
        ) : (
          <>
            <h1 className="font-clash text-2xl font-bold text-foreground mb-3">
              Aucune session trouvée
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              Il semble qu'il y ait eu un problème avec votre paiement.
            </p>
            <Link
              to="/artiste"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-mono text-sm hover:bg-muted/20 transition-colors"
            >
              Retour au site
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
