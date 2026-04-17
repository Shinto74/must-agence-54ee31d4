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
  "THE ARTIST": "130, 100, 255",
  "INSTAGRAM": "225, 48, 108",
  "GOOGLE": "66, 133, 244",
  "META": "24, 119, 242",
  "SNAPCHAT": "255, 252, 0",
};

const MarqueeText = ({ words, logos, page }: MarqueeTextProps) => {
  // If a page is passed, try to load items from DB. They override words/logos.
  const { data: dbItems } = useMarqueeItems(page ?? "home");
  const useDb = !!page && Array.isArray(dbItems) && dbItems.length > 0;

  const items = useDb
    ? dbItems!.map((it: any, i: number) => {
        if (it.kind === "logo" && it.image_url) {
          const brandColor = BRAND_COLORS[it.text_value?.toUpperCase?.() || ""] || "255, 255, 255";
          return (
            <div key={i} className="mq-item" style={{ "--brand-color": brandColor } as React.CSSProperties}>
              <div className="mq-partner">
                <img src={it.image_url} alt={it.text_value || ""} className="mq-logo" loading="lazy" draggable={false} />
              </div>
            </div>
          );
        }
        return (
          <div key={i} className="mq-item">
            <span className="mq-word">{it.text_value}</span>
          </div>
        );
      })
    : logos
    ? logos.map((logo, i) => {
        const brandColor = BRAND_COLORS[logo.name] || "255, 255, 255";
        return (
          <div
            key={i}
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
        <div key={i} className="mq-item">
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
          padding: 48px 0;
          border-top: 1px solid hsl(var(--foreground) / 0.08);
          border-bottom: 1px solid hsl(var(--foreground) / 0.08);
          background: linear-gradient(
            180deg,
            hsl(var(--background)) 0%,
            hsl(var(--foreground) / 0.03) 50%,
            hsl(var(--background)) 100%
          );
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
          position: relative;
        }

        .mq-track {
          display: flex;
          width: max-content;
          animation: mq-scroll 55s linear infinite;
          will-change: transform;
        }

        .mq-list {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .mq-item {
          margin-right: ${SPACING}px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          padding: 14px 24px;
          border-radius: 16px;
          transition: background 0.4s ease, box-shadow 0.4s ease;
          cursor: default;
        }

        .mq-item:hover {
          background: rgba(var(--brand-color), 0.06);
          box-shadow: 0 0 40px rgba(var(--brand-color), 0.08);
        }

        .mq-partner {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .mq-logo {
          height: 60px;
          max-width: 200px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.85;
          transition: filter 0.5s ease, opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          display: block;
          flex-shrink: 0;
        }

        .mq-logo--large {
          height: 65px;
          max-width: 220px;
        }

        .mq-item:hover .mq-logo {
          filter: grayscale(0) brightness(1) drop-shadow(0 0 20px rgba(var(--brand-color), 0.5));
          opacity: 1;
          transform: scale(1.1);
        }

        .mq-label {
          font-family: 'Clash Display', sans-serif;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: hsl(var(--foreground));
          opacity: 0.6;
          white-space: nowrap;
          transition: opacity 0.4s ease, text-shadow 0.4s ease;
          flex-shrink: 0;
        }

        .mq-item:hover .mq-label {
          opacity: 1;
          text-shadow: 0 0 24px rgba(var(--brand-color), 0.45);
        }

        .mq-word {
          font-family: 'Clash Display', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: hsl(var(--foreground));
          opacity: 0.45;
          white-space: nowrap;
          transition: opacity 0.35s ease;
        }

        .mq-item:hover .mq-word {
          opacity: 1;
        }

        @keyframes mq-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        @media (max-width: 768px) {
          .mq-root { padding: 28px 0; }
          .mq-logo { height: 38px; max-width: 140px; }
          .mq-logo--large { height: 44px; max-width: 160px; }
          .mq-label { font-size: 14px; letter-spacing: 0.18em; }
          .mq-item { margin-right: 56px; padding: 10px 14px; }
          .mq-track { animation-duration: 40s; }
          .mq-partner { gap: 10px; }
        }
      `}</style>
    </div>
  );
};

export default MarqueeText;
