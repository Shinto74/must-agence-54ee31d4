import { Link } from "react-router-dom";
import { SITE } from "@/lib/constants";

const Footer = () => (
  <footer className="border-t border-border bg-background py-12">
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <img src={SITE.logoGreen} alt={SITE.name} className="h-8 w-auto" />
          <div>
            <p className="font-clash font-semibold text-foreground">{SITE.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{SITE.tagline}</p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Accueil</Link>
          <Link to="/artiste" className="hover:text-foreground transition-colors">Pôle Artiste</Link>
          <Link to="/entreprise" className="hover:text-foreground transition-colors">Pôle Entreprise</Link>
        </nav>

        <p className="text-xs text-text-dim font-mono">
          © {new Date().getFullYear()} {SITE.name} — Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
