interface LogoItem {
  name: string;
  logoUrl?: string;
  label?: string;
}

interface MarqueeTextProps {
  words?: string[];
  logos?: LogoItem[];
}

const SPACING = 96; // px entre chaque item

const MarqueeText = ({ words, logos }: MarqueeTextProps) => {
  const items = logos
    ? logos.map((logo, i) => (
        <div key={i} className="mq-item">
          {logo.name === "THE ARTIST" ? (
            // THE ARTIST: logo + label
            <div className="mq-artist-container">
              {logo.logoUrl && (
                <img
                  src={logo.logoUrl}
                  alt={logo.name}
                  className="mq-logo mq-logo--artist"
                  loading="lazy"
                  draggable={false}
                />
              )}
              <span className="mq-artist-label">{logo.label || logo.name}</span>
            </div>
          ) : logo.logoUrl ? (
            // Regular logo
            <img
              src={logo.logoUrl}
              alt={logo.name}
              className={`mq-logo ${logo.name === "UNIVERSAL MUSIC" ? "mq-logo--universal" : ""} ${logo.name === "YOUTUBE" ? "mq-logo--youtube" : ""}`}
              loading="lazy"
              draggable={false}
            />
          ) : (
            // Logo without URL (e.g., UNIVERSAL MUSIC): show label
            <span className="mq-word">{logo.label || logo.name}</span>
          )}
        </div>
      ))
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

        /* margin-right sur chaque item = espace uniforme y compris après le dernier */
        .mq-item {
          margin-right: ${SPACING}px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mq-logo {
          height: 52px;
          max-width: 180px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.5;
          transition: opacity 0.35s ease;
          display: block;
        }

        .mq-logo--universal {
          height: 64px;
          max-width: 200px;
        }

        .mq-logo--youtube {
          filter: brightness(0) invert(1) hue-rotate(180deg) contrast(1.3);
        }

        .mq-artist-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mq-logo--artist {
          height: 48px;
          max-width: 140px;
          width: auto;
          object-fit: contain;
          filter: grayscale(1);
          opacity: 0.6;
          transition: opacity 0.35s ease, filter 0.35s ease;
          display: block;
        }

        .mq-artist-label {
          font-family: 'Clash Display', sans-serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: hsl(var(--foreground));
          opacity: 0.6;
          white-space: nowrap;
          transition: opacity 0.35s ease;
          flex-shrink: 0;
        }

        .mq-item:hover .mq-logo {
          opacity: 1;
        }

        .mq-item:hover .mq-logo--artist {
          opacity: 1;
          filter: grayscale(0.3);
        }

        .mq-item:hover .mq-artist-label {
          opacity: 1;
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
          .mq-logo { height: 38px; }
          .mq-logo--artist { height: 44px; }
          .mq-item { margin-right: 56px; }
          .mq-track { animation-duration: 36s; }
        }
      `}</style>
    </div>
  );
};

export default MarqueeText;
