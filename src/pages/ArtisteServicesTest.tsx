import ArtisteServicesV1 from "@/components/artiste/ArtisteServicesV1";
import ArtisteServicesV2 from "@/components/artiste/ArtisteServicesV2";
import ArtisteServicesV3 from "@/components/artiste/ArtisteServicesV3";
import ArtisteServicesV4 from "@/components/artiste/ArtisteServicesV4";
import ArtisteServicesV4B from "@/components/artiste/ArtisteServicesV4B";

const VARIANTS = [
  { id: 1, name: "BENTO 3D FLOATING" },
  { id: 2, name: "TIMELINE CINÉMATIQUE VERTICALE" },
  { id: 3, name: "MORPHING SHAPES / GLASSMORPHISM" },
  { id: 4, name: "SPLIT-SCREEN — VISUEL (icône + chips)" },
  { id: 5, name: "SPLIT-SCREEN — TEXTE (cartes info)" },
];

const VariantDivider = ({ id, name }: { id: number; name: string }) => (
  <div
    className="relative w-full py-6 overflow-hidden"
    style={{ background: "#000000" }}
  >
    {/* Top border */}
    <div
      className="absolute top-0 left-0 right-0 h-px"
      style={{
        background:
          "linear-gradient(to right, transparent, hsla(73,100%,50%,0.5), transparent)",
      }}
    />
    {/* Bottom border */}
    <div
      className="absolute bottom-0 left-0 right-0 h-px"
      style={{
        background:
          "linear-gradient(to right, transparent, hsla(73,100%,50%,0.5), transparent)",
      }}
    />

    <div className="flex items-center justify-center gap-4">
      <div
        className="h-px flex-1 max-w-xs"
        style={{
          background:
            "linear-gradient(to right, transparent, hsla(73,100%,50%,0.4))",
        }}
      />

      <div className="flex items-center gap-3">
        <span
          className="font-mono text-[9px] tracking-[.35em] uppercase"
          style={{ color: "hsla(73,100%,50%,0.4)" }}
        >
          VARIANTE
        </span>
        <span
          className="font-mono font-bold text-sm"
          style={{ color: "hsl(73 100% 50%)" }}
        >
          {String(id).padStart(2, "0")}
        </span>
        <span
          className="w-px h-4"
          style={{ background: "hsla(73,100%,50%,0.3)" }}
        />
        <span
          className="font-mono text-[9px] tracking-[.25em] uppercase"
          style={{ color: "hsla(73,100%,50%,0.7)" }}
        >
          {name}
        </span>
      </div>

      <div
        className="h-px flex-1 max-w-xs"
        style={{
          background:
            "linear-gradient(to left, transparent, hsla(73,100%,50%,0.4))",
        }}
      />
    </div>
  </div>
);

const ArtisteServicesTest = () => {
  return (
    <div style={{ background: "#070707", minHeight: "100vh" }}>
      {/* Page header */}
      <div
        className="px-8 py-12 text-center"
        style={{
          background: "#000000",
          borderBottom: "1px solid hsla(73,100%,50%,0.15)",
        }}
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[.6em] mb-3"
          style={{ color: "hsla(73,100%,50%,0.6)" }}
        >
          Page de test
        </p>
        <h1
          className="font-clash font-black text-white mb-2"
          style={{
            fontSize: "clamp(1.5rem, 3vw, 3rem)",
            letterSpacing: "-0.02em",
          }}
        >
          ArtisteServices{" "}
          <span
            style={{
              color: "transparent",
              WebkitTextStroke: "1px hsl(73 100% 50%)",
            }}
          >
            — 4 Variantes
          </span>
        </h1>
        <p
          className="font-outfit text-sm"
          style={{ color: "hsla(0,0%,100%,0.3)" }}
        >
          Section &ldquo;Tout ce qu&apos;on fait pour vos carrières&rdquo; — Comparaison des designs
        </p>

        {/* Quick nav */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {VARIANTS.map((v) => (
            <a
              key={v.id}
              href={`#variante-${v.id}`}
              className="font-mono text-[9px] uppercase tracking-[.3em] px-4 py-2 rounded-full transition-all duration-300 hover:border-primary/40 hover:text-primary"
              style={{
                border: "1px solid hsla(0,0%,100%,0.1)",
                color: "hsla(0,0%,100%,0.35)",
              }}
            >
              V{v.id} — {v.name}
            </a>
          ))}
        </div>
      </div>

      {/* Variante 1 */}
      <div id="variante-1">
        <VariantDivider id={1} name={VARIANTS[0].name} />
        <ArtisteServicesV1 />
      </div>

      {/* Variante 2 */}
      <div id="variante-2">
        <VariantDivider id={2} name={VARIANTS[1].name} />
        <ArtisteServicesV2 />
      </div>

      {/* Variante 3 */}
      <div id="variante-3">
        <VariantDivider id={3} name={VARIANTS[2].name} />
        <ArtisteServicesV3 />
      </div>

      {/* Variante 4 */}
      <div id="variante-4">
        <VariantDivider id={4} name={VARIANTS[3].name} />
        <ArtisteServicesV4 />
      </div>

      {/* Variante 5 */}
      <div id="variante-5">
        <VariantDivider id={5} name={VARIANTS[4].name} />
        <ArtisteServicesV4B />
      </div>

      {/* Footer */}
      <div
        className="px-8 py-10 text-center"
        style={{
          background: "#000000",
          borderTop: "1px solid hsla(73,100%,50%,0.1)",
        }}
      >
        <span
          className="font-mono text-[9px] uppercase tracking-[.5em]"
          style={{ color: "hsla(0,0%,100%,0.2)" }}
        >
          theArtist — must-agence — Design System Test
        </span>
      </div>
    </div>
  );
};

export default ArtisteServicesTest;
