import { Link, useLocation } from "react-router-dom";
import { SITE } from "@/lib/constants";

const Footer = () => {
  const location = useLocation();
  const isEntreprise = location.pathname === "/entreprise";
  const gold = "hsl(43 55% 55%)";
  const goldBg = "hsl(43 55% 55% / 0.5)";
  const goldBorder = "hsl(43 55% 55% / 0.4)";
  const neon = "hsl(var(--primary))";
  const neonBg = "hsl(var(--primary) / 0.5)";
  const neonBorder = "hsl(var(--primary) / 0.4)";

  const accentColor = isEntreprise ? gold : neon;
  const accentBg = isEntreprise ? goldBg : neonBg;
  const accentBorder = isEntreprise ? goldBorder : neonBorder;

  return (
    <footer
      className="relative border-t pt-16 pb-8"
      style={{
        background: isEntreprise ? "hsl(0 0% 8%)" : "hsl(var(--background))",
        borderColor: isEntreprise ? "hsl(0 0% 15%)" : "hsl(var(--border))",
        color: isEntreprise ? "hsl(0 0% 100%)" : "hsl(var(--foreground))",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${accentBg}, transparent)` }} />

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={SITE.logoWhite} alt={SITE.name} className="h-9 w-auto" />
              <span className="font-clash font-bold text-xl" style={{ color: isEntreprise ? "#fff" : "hsl(var(--foreground))" }}>MUST AGENCE</span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: isEntreprise ? "hsl(0 0% 55%)" : "hsl(var(--muted-foreground))" }}>
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
                  className="w-9 h-9 rounded-full border flex items-center justify-center font-mono text-[10px] transition-all duration-300"
                  style={{
                    borderColor: isEntreprise ? "hsl(0 0% 22%)" : "hsl(var(--border))",
                    color: isEntreprise ? "hsl(0 0% 50%)" : "hsl(var(--muted-foreground))",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = accentColor;
                    (e.currentTarget as HTMLElement).style.borderColor = accentBorder;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = isEntreprise ? "hsl(0 0% 50%)" : "";
                    (e.currentTarget as HTMLElement).style.borderColor = isEntreprise ? "hsl(0 0% 22%)" : "hsl(var(--border))";
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
                  className="text-sm transition-colors duration-300 w-fit"
                  style={{ color: isEntreprise ? "hsl(0 0% 55%)" : "hsl(var(--muted-foreground))" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = isEntreprise ? "#fff" : "hsl(var(--foreground))"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = isEntreprise ? "hsl(0 0% 55%)" : ""; }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>Contact</p>
            <div className="flex flex-col gap-2.5 text-sm" style={{ color: isEntreprise ? "hsl(0 0% 55%)" : "hsl(var(--muted-foreground))" }}>
              <a
                href={`mailto:${SITE.contact.email}`}
                className="transition-colors duration-300"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = accentColor; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = isEntreprise ? "hsl(0 0% 55%)" : ""; }}
              >
                {SITE.contact.email}
              </a>
              <a
                href={`tel:${SITE.contact.phone}`}
                className="transition-colors duration-300"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = accentColor; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = isEntreprise ? "hsl(0 0% 55%)" : ""; }}
              >
                {SITE.contact.phone}
              </a>
              <span>{SITE.contact.location}</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: `1px solid ${isEntreprise ? "hsl(0 0% 15%)" : "hsl(var(--border))"}` }}>
          <p className="text-[11px] font-mono" style={{ color: isEntreprise ? "hsl(0 0% 35%)" : "hsl(var(--muted-foreground) / 0.6)" }}>
            © {new Date().getFullYear()} {SITE.name} — Tous droits réservés.
          </p>
          <p className="text-[11px] font-mono" style={{ color: isEntreprise ? "hsl(0 0% 25%)" : "hsl(var(--muted-foreground) / 0.4)" }}>
            Fait avec précision à Paris.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
