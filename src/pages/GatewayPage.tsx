import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/constants";

type Side = "artiste" | "entreprise" | null;

const GatewayPage = () => {
  const [hovered, setHovered] = useState<Side>(null);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={SITE.logoWhite} alt={SITE.name} className="h-8 md:h-10 w-auto" />
            <span className="font-clash font-bold text-xl md:text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
              MUST AGENCE
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: "Pôle Artiste", path: "/artiste" },
              { label: "Pôle Entreprise", path: "/entreprise" },
            ].map((item) => (
              <Link key={item.path} to={item.path} className="relative font-medium text-sm text-muted-foreground hover:text-foreground transition-colors group py-2">
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-full" />
              </Link>
            ))}
          </nav>
          <Link to="/artiste#contact" className="hidden md:inline-flex items-center justify-center px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full hover:brightness-105 transition-all duration-300 hover:scale-[1.02] active:scale-95 text-sm">
            Nous Contacter
          </Link>
        </div>
      </header>

      {/* SPLIT SCREEN */}
      <main className="flex-1">
        <section className="relative h-[100svh] w-full flex flex-col md:flex-row overflow-hidden">

          {/* LOGO CENTRÉ */}
          <div
            className="absolute z-30 pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 100,
              height: 100,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: hovered === "entreprise"
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(204,255,0,0.06)",
                transition: "background 0.4s ease",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `1.5px solid ${hovered === "entreprise" ? "rgba(255,255,255,0.5)" : "rgba(204,255,0,0.5)"}`,
                boxShadow: hovered === "entreprise"
                  ? "0 0 20px rgba(255,255,255,0.15), inset 0 0 20px rgba(255,255,255,0.04)"
                  : "0 0 20px rgba(204,255,0,0.2), inset 0 0 20px rgba(204,255,0,0.04)",
                transition: "border-color 0.4s ease, box-shadow 0.4s ease",
              }}
            />
            <img
              src={SITE.logoGreen}
              alt={SITE.name}
              style={{
                height: 62,
                width: "auto",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${hovered === "artiste" ? 1.08 : 1})`,
                opacity: hovered === "entreprise" ? 0 : 1,
                transition: "opacity 0.4s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
            <img
              src={SITE.logoWhite}
              alt={SITE.name}
              style={{
                height: 62,
                width: "auto",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${hovered === "entreprise" ? 1.08 : 1})`,
                opacity: hovered === "entreprise" ? 1 : 0,
                transition: "opacity 0.4s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </div>

          {/* GAUCHE — Artiste */}
          <div
            className="relative h-1/2 md:h-full overflow-hidden flex items-center justify-center cursor-pointer"
            style={{
              width: hovered === "artiste" ? "60%" : hovered === "entreprise" ? "40%" : "50%",
              transition: "width 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={() => setHovered("artiste")}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="absolute inset-0 bg-background z-0">
              <img
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80"
                alt="Artist Performance"
                className="w-full h-full object-cover"
                style={{
                  opacity: hovered === "artiste" ? 0.6 : 0.4,
                  transform: hovered === "artiste" ? "scale(1.06)" : "scale(1)",
                  transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse at 40% 60%, rgba(204,255,0,0.1) 0%, transparent 65%)",
                  opacity: hovered === "artiste" ? 1 : 0,
                  transition: "opacity 0.7s ease",
                }}
              />
            </div>
            <Link to="/artiste" className="relative z-10 text-center px-6 w-full h-full flex flex-col items-center justify-center">
              <h2 className="font-clash text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
                Pôle Artiste
              </h2>
              <span
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full"
                style={{
                  transform: hovered === "artiste" ? "scale(1.05)" : "scale(1)",
                  boxShadow: hovered === "artiste" ? "0 0 30px rgba(204,255,0,0.4)" : "none",
                  transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease",
                }}
              >
                Je suis un Artiste
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          </div>

          {/* DROITE — Entreprise */}
          <div
            className="relative h-1/2 md:h-full overflow-hidden flex items-center justify-center cursor-pointer"
            style={{
              width: hovered === "entreprise" ? "60%" : hovered === "artiste" ? "40%" : "50%",
              transition: "width 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={() => setHovered("entreprise")}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="absolute inset-0 bg-background z-0">
              <img
                src="https://images.unsplash.com/photo-1637137467932-844c5736adc3?w=1200&q=80"
                alt="Brand Strategy"
                className="w-full h-full object-cover"
                style={{
                  opacity: hovered === "entreprise" ? 0.55 : 0.35,
                  transform: hovered === "entreprise" ? "scale(1.06)" : "scale(1)",
                  filter: hovered === "entreprise" ? "grayscale(0%)" : "grayscale(80%)",
                  transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.7s ease",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse at 60% 60%, rgba(255,255,255,0.06) 0%, transparent 65%)",
                  opacity: hovered === "entreprise" ? 1 : 0,
                  transition: "opacity 0.7s ease",
                }}
              />
            </div>
            <Link to="/entreprise" className="relative z-10 text-center px-6 w-full h-full flex flex-col items-center justify-center">
              <h2 className="font-clash text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
                Pôle Entreprise
              </h2>
              <span
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full"
                style={{
                  transform: hovered === "entreprise" ? "scale(1.05)" : "scale(1)",
                  boxShadow: hovered === "entreprise" ? "0 0 30px rgba(255,255,255,0.2)" : "none",
                  transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease",
                }}
              >
                Je suis une Entreprise
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
};

export default GatewayPage;
