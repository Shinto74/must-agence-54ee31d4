import { forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { SITE } from "@/lib/constants";
import { useSiteSettings } from "@/hooks/useSiteContent";

const Footer = forwardRef<HTMLElement>((_props, ref) => {
  const location = useLocation();
  const { get } = useSiteSettings();
  const logoWhite = get("logo_white", SITE.logoWhite);
  const brandName = get("brand_name", SITE.name?.toUpperCase() || "MUST AGENCE");
  const contactEmail = get("contact_email", SITE.contact.email);
  const contactPhone = get("contact_phone", SITE.contact.phone);
  const contactLocation = get("contact_location", SITE.contact.location);
  const footerTagline = get("footer_tagline", "Agence d'influence spécialisée musique et marques. Paris, France.");

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
      ref={ref}
      className="relative border-t pt-16 pb-8"
      style={{
        background: isEntreprise
          ? "linear-gradient(180deg, hsl(44 65% 30%) 0%, hsl(43 60% 24%) 100%)"
          : "hsl(var(--background))",
        borderColor: isEntreprise ? "hsl(44 60% 28%)" : "hsl(var(--border))",
        color: isEntreprise ? "hsl(45 30% 95%)" : "hsl(var(--foreground))",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: isEntreprise ? "linear-gradient(to right, transparent, hsl(45 80% 60% / 0.5), transparent)" : `linear-gradient(to right, transparent, ${accentBg}, transparent)` }} />

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={SITE.logoWhite} alt={SITE.name} className="h-9 w-auto" />
              <span className="font-clash font-bold text-xl" style={{ color: isEntreprise ? "hsl(45 30% 97%)" : "hsl(var(--foreground))" }}>MUST AGENCE</span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: isEntreprise ? "hsl(45 20% 82%)" : "hsl(var(--muted-foreground))" }}>
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
                    color: isEntreprise ? "hsl(45 20% 78%)" : "hsl(var(--muted-foreground))",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = accentColor;
                    (e.currentTarget as HTMLElement).style.borderColor = accentBorder;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = isEntreprise ? "hsl(45 20% 78%)" : "";
                    (e.currentTarget as HTMLElement).style.borderColor = isEntreprise ? "hsl(45 50% 45%)" : "hsl(var(--border))";
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] mb-4" style={{ color: isEntreprise ? "hsl(45 30% 97%)" : accentColor }}>Navigation</p>
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
                  style={{ color: isEntreprise ? "hsl(45 20% 82%)" : "hsl(var(--muted-foreground))" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = isEntreprise ? "hsl(45 30% 97%)" : "hsl(var(--foreground))"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = isEntreprise ? "hsl(45 20% 82%)" : ""; }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] mb-4" style={{ color: isEntreprise ? "hsl(45 30% 97%)" : accentColor }}>Contact</p>
            <div className="flex flex-col gap-2.5 text-sm" style={{ color: isEntreprise ? "hsl(45 20% 82%)" : "hsl(var(--muted-foreground))" }}>
              <a
                href={`mailto:${SITE.contact.email}`}
                className="transition-colors duration-300"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = accentColor; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = isEntreprise ? "hsl(45 20% 82%)" : ""; }}
              >
                {SITE.contact.email}
              </a>
              <a
                href={`tel:${SITE.contact.phone}`}
                className="transition-colors duration-300"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = accentColor; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = isEntreprise ? "hsl(45 20% 82%)" : ""; }}
              >
                {SITE.contact.phone}
              </a>
              <span>{SITE.contact.location}</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: `1px solid ${isEntreprise ? "hsl(45 40% 28%)" : "hsl(var(--border))"}` }}>
          <p className="text-[11px] font-mono" style={{ color: isEntreprise ? "hsl(45 20% 70%)" : "hsl(var(--muted-foreground) / 0.6)" }}>
            © {new Date().getFullYear()} {SITE.name} — Tous droits réservés.
          </p>
          <p className="text-[11px] font-mono" style={{ color: isEntreprise ? "hsl(45 20% 62%)" : "hsl(var(--muted-foreground) / 0.4)" }}>
            Fait avec précision à Paris.
          </p>
          <Link
            to="/admin/login"
            className="text-[10px] font-mono opacity-30 hover:opacity-60 transition-opacity"
            style={{ color: isEntreprise ? "hsl(45 20% 62%)" : "hsl(var(--muted-foreground))" }}
          >
            Administration
          </Link>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
