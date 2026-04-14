import { Link, useLocation } from "react-router-dom";
import { SITE } from "@/lib/constants";

const Footer = () => {
  const location = useLocation();
  const isEntreprise = location.pathname === "/entreprise";
  const accentColor = isEntreprise ? "hsl(43 55% 55%)" : "hsl(var(--primary))";
  const accentBg = isEntreprise ? "hsl(43 55% 55% / 0.5)" : "hsl(var(--primary) / 0.5)";
  const accentBorder = isEntreprise ? "hsl(43 55% 55% / 0.4)" : "hsl(var(--primary) / 0.4)";

  return (
    <footer className="relative border-t border-border bg-background pt-16 pb-8">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${accentBg}, transparent)` }} />

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={isEntreprise ? SITE.logoWhite : SITE.logoGreen} alt={SITE.name} className="h-9 w-auto" />
              <span className="font-clash font-bold text-xl text-foreground">MUST AGENCE</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Agence d'influence spécialisée musique et marques. Paris, France.
            </p>
            <div className="flex gap-3">
              {[
                { label: "IG", href: "#" },
                { label: "TK", href: "#" },
                { label: "LI", href: "#" },
                { label: "YT", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-9 h-9 rounded-full border flex items-center justify-center font-mono text-[10px] text-muted-foreground transition-all duration-300"
                  style={{ borderColor: "hsl(var(--border))" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = accentColor;
                    (e.currentTarget as HTMLElement).style.borderColor = accentBorder;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "";
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--border))";
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>Navigation</p>
            <nav className="flex flex-col gap-2.5">
              {[
                { label: "Accueil", to: "/" },
                { label: "Pôle Artiste", to: "/artiste" },
                { label: "Pôle Entreprise", to: "/entreprise" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 w-fit"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>Contact</p>
            <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <a href={`mailto:${SITE.contact.email}`} className="transition-colors duration-300 hover:text-foreground" style={{ ["--hover-color" as string]: accentColor }}>
                {SITE.contact.email}
              </a>
              <a href={`tel:${SITE.contact.phone}`} className="transition-colors duration-300 hover:text-foreground">
                {SITE.contact.phone}
              </a>
              <span>{SITE.contact.location}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground/60 font-mono">
            © {new Date().getFullYear()} {SITE.name} — Tous droits réservés.
          </p>
          <p className="text-[11px] text-muted-foreground/40 font-mono">
            Fait avec précision à Paris.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
