interface LogoItem {
  name: string;
  logoUrl?: string;
  label?: string;
}

interface MarqueeTextProps {
  words?: string[];
  logos?: LogoItem[];
}

const SPACING = 80;

// Brand colors for hover glow (RGB)
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

const MarqueeText = ({ words, logos }: MarqueeTextProps) => {
  const items = logos
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
          padding: 40px 0;
          border-top: 1px solid hsl(var(--border));
          border-bottom: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }

        .mq-track {
          display: flex;
          width: max-content;
          animation: mq-scroll 50s linear infinite;
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
          padding: 10px 16px;
          border-radius: 12px;
          transition: background 0.4s ease;
          cursor: default;
        }

        .mq-item:hover {
          background: rgba(var(--brand-color), 0.08);
        }

        .mq-partner {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .mq-logo {
          height: 40px;
          max-width: 160px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.55;
          transition: filter 0.4s ease, opacity 0.4s ease, transform 0.4s ease;
          display: block;
          flex-shrink: 0;
        }

        .mq-logo--large {
          height: 52px;
          max-width: 190px;
        }

        .mq-item:hover .mq-logo {
          filter: grayscale(0) brightness(1) drop-shadow(0 0 16px rgba(var(--brand-color), 0.55));
          opacity: 1;
          transform: scale(1.06);
        }

        .mq-label {
          font-family: 'Clash Display', sans-serif;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: hsl(var(--foreground));
          opacity: 0.55;
          white-space: nowrap;
          transition: opacity 0.4s ease, text-shadow 0.4s ease, color 0.4s ease;
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
          opacity: 0.4;
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
          .mq-root { padding: 24px 0; }
          .mq-logo { height: 30px; max-width: 120px; }
          .mq-logo--large { height: 38px; }
          .mq-label { font-size: 14px; letter-spacing: 0.18em; }
          .mq-item { margin-right: 48px; padding: 8px 10px; }
          .mq-track { animation-duration: 38s; }
          .mq-partner { gap: 10px; }
        }
      `}</style>
    </div>
  );
};

export default MarqueeText;
