import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SITE } from "@/lib/constants";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Accueil", path: "/" },
  { label: "Pôle Artiste", path: "/artiste" },
  { label: "Pôle Entreprise", path: "/entreprise" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isArtiste = location.pathname === "/artiste";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "hsla(73,100%,50%,0.03)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
        borderBottom: scrolled ? "1px solid hsla(0,0%,100%,0.06)" : "1px solid transparent",
      }}
    >
      {/* Subtle top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{
          background: scrolled
            ? "linear-gradient(to right, hsl(73 100% 50% / 0.3), transparent 30%, transparent 70%, hsl(73 100% 50% / 0.15))"
            : "transparent",
          transition: "background 0.5s",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center h-16 md:h-[72px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 relative z-10 group">
          <div className="relative">
            <img
              src={isArtiste ? SITE.logoWhite : SITE.logoGreen}
              alt={SITE.name}
              className="h-7 md:h-9 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105"
            />
            {/* Glow behind logo on hover */}
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0"
              style={{
                background: "radial-gradient(circle, hsl(73 100% 50% / 0.15) 0%, transparent 70%)",
                transform: "scale(2.5)",
              }}
            />
          </div>
          <span className="font-clash font-bold text-base md:text-lg tracking-tight text-foreground/90 group-hover:text-primary transition-colors duration-300">
            MUST AGENCE
          </span>
        </Link>

        {/* Nav desktop — pill container */}
        <nav
          className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2 rounded-full px-1 py-1"
          style={{
            background: "hsla(0,0%,100%,0.04)",
            border: "1px solid hsla(0,0%,100%,0.07)",
            backdropFilter: "blur(12px)",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-5 py-2 rounded-full font-mono text-[11px] uppercase tracking-[0.15em] transition-all duration-300"
                style={{
                  color: isActive ? "hsl(var(--primary-foreground))" : "hsla(0,0%,100%,0.45)",
                  background: isActive ? "hsl(73 100% 50%)" : "transparent",
                  boxShadow: isActive ? "0 0 16px hsl(73 100% 50% / 0.3), 0 2px 8px hsl(73 100% 50% / 0.15)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "hsla(0,0%,100%,0.85)";
                    (e.currentTarget as HTMLElement).style.background = "hsla(0,0%,100%,0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "hsla(0,0%,100%,0.45)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA right (optional decorative element) */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <a
            href="#contact"
            className="px-5 py-2 rounded-full font-mono text-[10px] uppercase tracking-[0.15em] transition-all duration-300"
            style={{
              border: "1px solid hsla(73,100%,50%,0.25)",
              color: "hsl(73 100% 50%)",
              background: "hsla(73,100%,50%,0.05)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "hsl(73 100% 50%)";
              (e.currentTarget as HTMLElement).style.color = "hsl(var(--primary-foreground))";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px hsl(73 100% 50% / 0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "hsla(73,100%,50%,0.05)";
              (e.currentTarget as HTMLElement).style.color = "hsl(73 100% 50%)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            Contact
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2.5 ml-auto rounded-lg transition-all duration-300"
          style={{
            border: "1px solid hsla(0,0%,100%,0.08)",
            background: mobileOpen ? "hsla(73,100%,50%,0.1)" : "hsla(0,0%,100%,0.04)",
            color: mobileOpen ? "hsl(73 100% 50%)" : "hsla(0,0%,100%,0.7)",
          }}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="md:hidden px-6 pb-6 pt-2"
          style={{
            background: "hsla(0,0%,4%,0.95)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid hsla(0,0%,100%,0.06)",
            animation: "navSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {NAV_ITEMS.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 py-3.5 transition-colors"
                style={{
                  color: isActive ? "hsl(73 100% 50%)" : "hsla(0,0%,100%,0.5)",
                  borderBottom: idx < NAV_ITEMS.length - 1 ? "1px solid hsla(0,0%,100%,0.04)" : "none",
                  animation: `navSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.05}s both`,
                }}
              >
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" style={{ boxShadow: "0 0 6px hsl(73 100% 50% / 0.5)" }} />
                )}
                <span className="font-mono text-sm uppercase tracking-[0.15em]">{item.label}</span>
              </Link>
            );
          })}

          <a
            href="#contact"
            className="mt-4 block w-full text-center py-3 rounded-full font-mono text-xs uppercase tracking-[0.15em] bg-primary text-primary-foreground"
          >
            Contact
          </a>
        </nav>
      )}

      <style>{`
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
};

export default Header;
