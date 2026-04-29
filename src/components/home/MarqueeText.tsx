import { useMarqueeItems } from "@/hooks/useSiteContent";

interface LogoItem {
  name: string;
  logoUrl?: string;
  label?: string;
}

interface MarqueeTextProps {
  words?: string[];
  logos?: LogoItem[];
  /** Optional: fetch items from DB for this page; overrides words/logos when items exist */
  page?: "home" | "artiste" | "entreprise";
}

const SPACING = 100;

const BRAND_COLORS: Record<string, string> = {
  "SPOTIFY": "30, 215, 96",
  "TIKTOK": "255, 0, 80",
  "YOUTUBE": "255, 0, 0",
  "UNIVERSAL MUSIC": "0, 51, 160",
  "THE ARTIST": "204, 255, 0",
  "THEARTIST": "204, 255, 0",
  "INSTAGRAM": "225, 48, 108",
  "GOOGLE": "66, 133, 244",
  "META": "24, 119, 242",
  "SNAPCHAT": "255, 252, 0",
  "APPLE MUSIC": "250, 87, 60",
  "SOUNDCLOUD": "255, 85, 0",
  "DEEZER": "162, 56, 255",
};

const MarqueeText = ({ words, logos, page }: MarqueeTextProps) => {
  // If a page is passed, try to load items from DB. They override words/logos.
  const { data: dbItems } = useMarqueeItems(page ?? "home");
  const useDb = !!page && Array.isArray(dbItems) && dbItems.length > 0;

  const items = useDb
    ? dbItems!.map((it: any, i: number) => {
        const text = (it.text_value || "").trim();
        const isLogo = it.kind === "logo" && it.image_url;
        const upper = text.toUpperCase();
        const brandColor = BRAND_COLORS[upper] || "255, 255, 255";
        // Logos avec wordmark intégré (pas besoin d'afficher le texte à côté)
        const LOGOS_WITH_WORDMARK = new Set([
          "SPOTIFY",
          "TIKTOK",
          "YOUTUBE",
          "UNIVERSAL MUSIC",
          "INSTAGRAM",
          "APPLE MUSIC",
          "SOUNDCLOUD",
          "DEEZER",
          "META",
          "GOOGLE",
          "SNAPCHAT",
        ]);
        // Pour tous les autres logos (icône seule, monogramme…), on affiche le label à côté
        const showLabelWithLogo = isLogo && text && !LOGOS_WITH_WORDMARK.has(upper);
        const isLarge = upper === "UNIVERSAL MUSIC";
        return (
          <div key={it.id ?? `${upper}-${i}`} className="mq-item" style={{ "--brand-color": brandColor } as React.CSSProperties}>
            <div className="mq-partner">
              {isLogo ? (
                <>
                  <img
                    src={it.image_url}
                    alt={text}
                    className={`mq-logo ${isLarge ? "mq-logo--large" : ""}`}
                    loading="lazy"
                    draggable={false}
                  />
                  {showLabelWithLogo && <span className="mq-label">{text}</span>}
                </>
              ) : (
                text && <span className="mq-word">{text}</span>
              )}
            </div>
          </div>
        );
      })
    : logos
    ? logos.map((logo, i) => {
        const brandColor = BRAND_COLORS[logo.name] || "255, 255, 255";
        return (
          <div
            key={`${logo.name}-${i}`}
            className="mq-item"
            style={{ "--brand-color": brandColor } as React.CSSProperties}
          >
            <div className="mq-partner">
              {logo.logoUrl && (
                <img
                  src={logo.logoUrl}
                  alt={logo.name}
                  className={`mq-logo ${logo.name === "UNIVERSAL MUSIC" ? "mq-logo--large" : ""}`}
                  loading="lazy"
                  draggable={false}
                />
              )}
            </div>
          </div>
        );
      })
    : words?.map((word, i) => (
        <div key={`${word}-${i}`} className="mq-item">
          <span className="mq-word">{word}</span>
        </div>
      ));

  return (
    <div className="mq-root">
      <div className="mq-track">
        <div className="mq-list">{items}</div>
        <div className="mq-list" aria-hidden="true">{items}</div>
        <div className="mq-list" aria-hidden="true">{items}</div>
      </div>

      <style>{`
        .mq-root {
          width: 100%;
          overflow: hidden;
          padding: 56px 0;
          border-top: 1px solid hsl(var(--foreground) / 0.06);
          border-bottom: 1px solid hsl(var(--foreground) / 0.06);
          background:
            radial-gradient(ellipse 80% 60% at 50% 50%, hsl(var(--neon) / 0.025), transparent 70%),
            linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--foreground) / 0.02) 50%, hsl(var(--background)) 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          position: relative;
        }

        .mq-track {
          display: flex;
          width: max-content;
          animation: mq-scroll 60s linear infinite;
          will-change: transform;
        }

        /* pas de pause au survol — défilement continu */

        .mq-list { display: flex; align-items: center; flex-shrink: 0; }

        .mq-item {
          margin-right: ${SPACING}px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          padding: 16px 28px;
          border-radius: 18px;
          transition: background 0.5s ease, box-shadow 0.5s ease, transform 0.5s ease;
          cursor: default;
        }

        .mq-item::after {
          content: "";
          position: absolute;
          right: -${SPACING / 2}px;
          top: 50%;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: hsl(var(--foreground) / 0.18);
          transform: translateY(-50%);
        }

        .mq-item:hover {
          background: rgba(var(--brand-color), 0.07);
          box-shadow: 0 0 50px rgba(var(--brand-color), 0.12), inset 0 0 30px rgba(var(--brand-color), 0.04);
          transform: translateY(-2px);
        }

        .mq-partner { display: flex; align-items: center; gap: 16px; }

        .mq-logo {
          height: 56px;
          max-width: 180px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.72;
          transition: filter 0.5s ease, opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          display: block;
          flex-shrink: 0;
        }

        .mq-logo--large { height: 62px; max-width: 200px; }

        .mq-item:hover .mq-logo {
          filter: grayscale(0) brightness(1) drop-shadow(0 0 24px rgba(var(--brand-color), 0.55));
          opacity: 1;
          transform: scale(1.08);
        }

        .mq-label {
          font-family: 'Clash Display', 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: hsl(var(--foreground));
          opacity: 0.7;
          white-space: nowrap;
          transition: opacity 0.4s ease, text-shadow 0.4s ease, color 0.4s ease;
          flex-shrink: 0;
        }

        .mq-item:hover .mq-label {
          opacity: 1;
          color: rgb(var(--brand-color));
          text-shadow: 0 0 28px rgba(var(--brand-color), 0.55);
        }

        .mq-word {
          font-family: 'Clash Display', 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: hsl(var(--foreground));
          opacity: 0.55;
          white-space: nowrap;
          transition: opacity 0.4s ease, text-shadow 0.4s ease, color 0.4s ease;
        }

        .mq-item:hover .mq-word {
          opacity: 1;
          color: rgb(var(--brand-color));
          text-shadow: 0 0 24px rgba(var(--brand-color), 0.5);
        }

        @keyframes mq-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        @media (max-width: 768px) {
          .mq-root { padding: 32px 0; }
          .mq-logo { height: 36px; max-width: 130px; }
          .mq-logo--large { height: 42px; max-width: 150px; }
          .mq-label { font-size: 12px; letter-spacing: 0.16em; }
          .mq-word { font-size: 11px; letter-spacing: 0.18em; }
          .mq-item { margin-right: 56px; padding: 10px 16px; }
          .mq-item::after { right: -28px; }
          .mq-track { animation-duration: 42s; }
          .mq-partner { gap: 10px; }
        }
      `}</style>
    </div>
  );
};

export default MarqueeText;
