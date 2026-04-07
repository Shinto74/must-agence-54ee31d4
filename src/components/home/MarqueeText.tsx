interface LogoItem {
  name: string;
  logoUrl?: string;
  label?: string;
}

interface MarqueeTextProps {
  words?: string[];
  logos?: LogoItem[];
}

const SPACING = 96;

// Brand colors for hover glow
const BRAND_COLORS: Record<string, string> = {
  "SPOTIFY": "30, 215, 96",
  "TIKTOK": "255, 0, 80",
  "YOUTUBE": "255, 0, 0",
  "UNIVERSAL MUSIC": "0, 100, 210",
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
            {logo.name === "THE ARTIST" ? (
              <div className="mq-artist-container">
                {logo.logoUrl && (
                  <img
                    src={logo.logoUrl}
                    alt={logo.name}
                    className="mq-logo mq-logo--colored"
                    loading="lazy"
                    draggable={false}
                  />
                )}
                <span className="mq-artist-label">{logo.label || logo.name}</span>
              </div>
            ) : logo.logoUrl ? (
              <img
                src={logo.logoUrl}
                alt={logo.name}
                className={`mq-logo mq-logo--colored ${logo.name === "UNIVERSAL MUSIC" ? "mq-logo--universal" : ""}`}
                loading="lazy"
                draggable={false}
              />
            ) : (
              <span className="mq-word">{logo.label || logo.name}</span>
            )}
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
          padding: 36px 0;
          border-top: 1px solid hsl(var(--border));
          border-bottom: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
        }

        .mq-track {
          display: flex;
          width: max-content;
          animation: mq-scroll 45s linear infinite;
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
          padding: 8px 12px;
          border-radius: 12px;
          transition: background 0.4s ease;
        }

        .mq-item:hover {
          background: rgba(var(--brand-color), 0.06);
        }

        /* All logos: white/grey by default, brand color on hover */
        .mq-logo--colored {
          height: 52px;
          max-width: 180px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.5;
          transition: filter 0.4s ease, opacity 0.4s ease, transform 0.4s ease;
          display: block;
        }

        .mq-logo--universal {
          height: 64px;
          max-width: 200px;
        }

        .mq-item:hover .mq-logo--colored {
          filter: grayscale(0) brightness(1);
          opacity: 1;
          transform: scale(1.08);
          -webkit-filter: grayscale(0) brightness(1) drop-shadow(0 0 14px rgba(var(--brand-color), 0.5));
          filter: grayscale(0) brightness(1) drop-shadow(0 0 14px rgba(var(--brand-color), 0.5));
        }

        .mq-artist-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mq-artist-label {
          font-family: 'Clash Display', sans-serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: hsl(var(--foreground));
          opacity: 0.4;
          white-space: nowrap;
          transition: opacity 0.4s ease, text-shadow 0.4s ease;
          flex-shrink: 0;
        }

        .mq-item:hover .mq-artist-label {
          opacity: 1;
          text-shadow: 0 0 20px rgba(var(--brand-color), 0.4);
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
          100% { transform: translateX(-50%); }
        }

        @media (max-width: 768px) {
          .mq-root { padding: 24px 0; }
          .mq-logo--colored { height: 38px; }
          .mq-item { margin-right: 56px; }
          .mq-track { animation-duration: 36s; }
        }
      `}</style>
    </div>
  );
};

export default MarqueeText;
