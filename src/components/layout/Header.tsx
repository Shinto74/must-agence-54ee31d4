import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { SITE } from "@/lib/constants";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

const DEFAULT_NAV_ITEMS = [
  { key: "home", label: "Accueil", path: "/" },
  { key: "artiste", label: "Pôle Artiste", path: "/artiste" },
  { key: "entreprise", label: "Pôle Entreprise", path: "/entreprise" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const lastScrollY = useRef(0);
  const { get } = useSiteSettings();
  const logoWhite = get("logo_white", SITE.logoWhite);
  const logoGreen = get("logo_green", SITE.logoGreen);
  const brandName = get("brand_name", "MUST AGENCE");
  const contactCtaLabel = get("header_contact_label", "Contact");
  const NAV_ITEMS = DEFAULT_NAV_ITEMS.map((item) => ({
    ...item,
    label: get(`header_nav_${item.key}`, item.label),
  }));

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setScrolled((prev) => {
        const next = y > 40;
        return prev === next ? prev : next;
      });
      if (y > 100) {
        if (y > lastScrollY.current + 5) {
          setHidden((prev) => (prev ? prev : true));
        } else if (y < lastScrollY.current - 3) {
          setHidden((prev) => (prev ? false : prev));
        }
      } else {
        setHidden((prev) => (prev ? false : prev));
      }
      lastScrollY.current = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isArtiste = location.pathname === "/artiste";
  const isEntreprise = location.pathname === "/entreprise";
  const isLightPage = isEntreprise;

  // Colors
  const gold = "hsl(43 55% 55%)";
  const goldDark = "hsl(43 55% 35%)";
  const neon = "hsl(73 100% 50%)";
  const accentColor = isEntreprise ? gold : neon;

  // Determine if we're on top of the hero (dark video bg) or scrolled into light content
  const onHero = !scrolled;
  // On Entreprise: hero has dark video overlay, but scrolled content is light cream
  const needsDarkText = isLightPage && scrolled;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        transform: hidden ? "translateY(-110%)" : "translateY(0)",
        transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease, height 0.4s ease, padding 0.4s ease",
        background: scrolled
          ? needsDarkText
            ? "hsla(40, 30%, 95%, 0.88)"
            : "hsla(0, 0%, 4%, 0.8)"
          : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(1.5)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px) saturate(1.5)" : "none",
        borderBottom: scrolled
          ? needsDarkText
            ? "1px solid hsla(43, 55%, 55%, 0.12)"
            : "1px solid hsla(0,0%,100%,0.06)"
          : "1px solid transparent",
        boxShadow: scrolled
          ? needsDarkText
            ? "0 4px 30px hsla(43, 30%, 30%, 0.08)"
            : "0 4px 30px hsla(0, 0%, 0%, 0.2)"
          : "none",
      }}
    >
      {/* Subtle top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none transition-opacity duration-500"
        style={{
          background: scrolled
            ? `linear-gradient(to right, transparent 10%, ${accentColor.replace(')', ' / 0.4)')}, transparent 90%)`
            : "transparent",
        }}
      />

      <div
        className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center"
        style={{
          height: scrolled ? "56px" : "72px",
          transition: "height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 relative z-10 group">
          <div className="relative">
            <img
              src={isEntreprise ? logoWhite : isArtiste ? logoWhite : logoGreen}
              alt={SITE.name}
              className="h-7 md:h-9 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105"
              style={{
                filter: needsDarkText ? "brightness(0.3) sepia(1) hue-rotate(10deg) saturate(3)" : "none",
              }}
            />
          </div>
          <span
            className="font-clash font-bold text-base md:text-lg tracking-tight transition-colors duration-300"
            style={{
              color: needsDarkText ? goldDark : "hsl(0 0% 90%)",
            }}
          >
            {brandName}
          </span>
        </Link>

        {/* Nav desktop — pill container */}
        <nav
          className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2 rounded-full px-1.5 py-1.5 transition-all duration-500"
          style={{
            background: needsDarkText
              ? "hsla(43, 40%, 85%, 0.5)"
              : "hsla(0,0%,100%,0.06)",
            border: needsDarkText
              ? "1px solid hsla(43, 55%, 55%, 0.2)"
              : "1px solid hsla(0,0%,100%,0.08)",
            backdropFilter: "blur(12px)",
            boxShadow: needsDarkText
              ? "0 2px 16px hsla(43, 40%, 30%, 0.08)"
              : "0 2px 16px hsla(0, 0%, 0%, 0.15)",
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
                  color: isActive
                    ? needsDarkText ? "#fff" : isEntreprise ? "#fff" : "hsl(var(--primary-foreground))"
                    : needsDarkText ? "hsla(43, 30%, 25%, 0.65)" : "hsla(0,0%,100%,0.5)",
                  background: isActive
                    ? isEntreprise ? gold : accentColor
                    : "transparent",
                  boxShadow: isActive
                    ? `0 0 16px ${accentColor.replace(')', ' / 0.25)')}, 0 2px 8px ${accentColor.replace(')', ' / 0.15)')}`
                    : "none",
                  fontWeight: isActive ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = needsDarkText ? "hsla(43, 30%, 20%, 0.9)" : "hsla(0,0%,100%,0.9)";
                    (e.currentTarget as HTMLElement).style.background = needsDarkText ? "hsla(43, 40%, 80%, 0.4)" : "hsla(0,0%,100%,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = needsDarkText ? "hsla(43, 30%, 25%, 0.65)" : "hsla(0,0%,100%,0.5)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA right */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <LanguageSwitcher needsDarkText={needsDarkText} accentColor={accentColor} />
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-contact-modal"))}
            className="px-5 py-2 rounded-full font-mono text-[10px] uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer"
            style={{
              border: `1px solid ${needsDarkText ? "hsla(43, 55%, 55%, 0.35)" : isEntreprise ? "hsl(var(--burgundy-light) / 0.3)" : "hsla(73,100%,50%,0.25)"}`,
              color: needsDarkText ? goldDark : accentColor,
              background: needsDarkText ? "hsla(43, 55%, 55%, 0.08)" : isEntreprise ? "hsl(var(--burgundy) / 0.08)" : "hsla(73,100%,50%,0.05)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = isEntreprise ? gold : accentColor;
              (e.currentTarget as HTMLElement).style.color = "#fff";
              (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${accentColor.replace(')', ' / 0.3)')}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = needsDarkText ? "hsla(43, 55%, 55%, 0.08)" : isEntreprise ? "hsl(var(--burgundy) / 0.08)" : "hsla(73,100%,50%,0.05)";
              (e.currentTarget as HTMLElement).style.color = needsDarkText ? goldDark : accentColor;
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            {contactCtaLabel}
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2.5 ml-auto rounded-lg transition-all duration-300"
          style={{
            border: needsDarkText ? "1px solid hsla(43, 55%, 55%, 0.2)" : "1px solid hsla(0,0%,100%,0.08)",
            background: mobileOpen
              ? needsDarkText ? "hsla(43, 55%, 55%, 0.15)" : "hsla(73,100%,50%,0.1)"
              : needsDarkText ? "hsla(43, 40%, 85%, 0.3)" : "hsla(0,0%,100%,0.04)",
            color: mobileOpen
              ? accentColor
              : needsDarkText ? goldDark : "hsla(0,0%,100%,0.7)",
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
            background: needsDarkText ? "hsla(40, 30%, 95%, 0.97)" : "hsla(0,0%,4%,0.95)",
            backdropFilter: "blur(20px)",
            borderTop: needsDarkText ? "1px solid hsla(43, 55%, 55%, 0.1)" : "1px solid hsla(0,0%,100%,0.06)",
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
                  color: isActive
                    ? needsDarkText ? gold : "hsl(73 100% 50%)"
                    : needsDarkText ? "hsla(43, 30%, 25%, 0.5)" : "hsla(0,0%,100%,0.5)",
                  borderBottom: idx < NAV_ITEMS.length - 1
                    ? needsDarkText ? "1px solid hsla(43, 55%, 55%, 0.08)" : "1px solid hsla(0,0%,100%,0.04)"
                    : "none",
                  animation: `navSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.05}s both`,
                }}
              >
                {isActive && (
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: accentColor,
                      boxShadow: `0 0 6px ${accentColor.replace(')', ' / 0.5)')}`,
                    }}
                  />
                )}
                <span className="font-mono text-sm uppercase tracking-[0.15em]">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => { window.dispatchEvent(new CustomEvent("open-contact-modal")); setMobileOpen(false); }}
            className="mt-4 block w-full text-center py-3 rounded-full font-mono text-xs uppercase tracking-[0.15em] cursor-pointer"
            style={{
              background: isEntreprise ? gold : "hsl(73 100% 50%)",
              color: "#fff",
            }}
          >
            {contactCtaLabel}
          </button>

          <div className="mt-4 flex justify-center">
            <LanguageSwitcher needsDarkText={needsDarkText} accentColor={accentColor} mobile />
          </div>
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