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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      {/* Green diagonal corner — large triangle matching reference */}
      <div className="absolute top-0 left-0 pointer-events-none" style={{ width: '140px', height: '300px', overflow: 'hidden' }}>
        <div className="absolute bg-primary" style={{ width: '400px', height: '400px', top: '-200px', left: '-200px', transform: 'rotate(65deg)', transformOrigin: 'bottom right' }} />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 flex items-center h-16 md:h-20">
        {/* Logo - left */}
        <Link to="/" className="flex items-center gap-2 shrink-0 relative z-10">
          <img
            src={isArtiste ? SITE.logoWhite : SITE.logoGreen}
            alt={SITE.name}
            className="h-8 md:h-10 w-auto"
          />
        </Link>

        {/* Desktop nav - centered */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-pill font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle - right */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground p-2 ml-auto"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-background/95 backdrop-blur-md border-b border-border px-6 pb-6 animate-fadeSlide">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block py-3 font-mono text-sm uppercase tracking-wider transition-colors ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
