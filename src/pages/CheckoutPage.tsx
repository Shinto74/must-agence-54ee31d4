import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { ArrowLeft } from "lucide-react";

const PACKS = [
  { id: "essentiel_once", name: "L'Essentiel", price: "350€", subtitle: "Pack 1" },
  { id: "ascension_once", name: "L'Ascension", price: "550€", subtitle: "Pack 2" },
  { id: "explosion_once", name: "L'Explosion", price: "1 500€", subtitle: "Pack 3" },
];

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const priceIdParam = searchParams.get("pack");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [started, setStarted] = useState(false);

  const selectedPack = PACKS.find((p) => p.id === priceIdParam) || PACKS[0];

  if (started) {
    return (
      <div className="min-h-screen bg-background">
        <PaymentTestModeBanner />
        <div className="max-w-2xl mx-auto px-4 py-10">
          <h1 className="font-clash text-2xl font-bold text-foreground mb-6 text-center">
            Paiement — {selectedPack.name}
          </h1>
          <StripeEmbeddedCheckout
            priceId={selectedPack.id}
            customerEmail={email}
            customerName={name}
            customerPhone={phone}
            packName={selectedPack.name}
            returnUrl={`${window.location.origin}/checkout/confirmation?session_id={CHECKOUT_SESSION_ID}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PaymentTestModeBanner />
      <div className="max-w-md mx-auto px-4 py-10">
        <Link to="/artiste" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Retour
        </Link>

        <h1 className="font-clash text-3xl font-bold text-foreground mb-2">Paiement</h1>
        <p className="text-muted-foreground text-sm mb-8">
          {selectedPack.name} — {selectedPack.price} HT
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wider">Nom complet</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wider">Téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33 6 00 00 00 00"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
            />
          </div>

          <button
            onClick={() => setStarted(true)}
            disabled={!email || !name}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-mono text-sm uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-40 mt-4"
          >
            Procéder au paiement
          </button>
        </div>
      </div>
    </div>
  );
}
