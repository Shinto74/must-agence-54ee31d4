import { useMarqueeItems } from "@/hooks/useSiteContent";
import { optimizeImage } from "@/lib/imageOptimizer";

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

const SPACING = 88;

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
  const { data: dbItems } = useMarqueeItems(page ?? "home");
  const useDb = !!page && Array.isArray(dbItems) && dbItems.length > 0;

  const items = useDb
    ? dbItems!.map((it: any, i: number) => {
        const text = (it.text_value || "").trim();
        const isLogo = it.kind === "logo" && it.image_url;
        const upper = text.toUpperCase();
        const brandColor = BRAND_COLORS[upper] || "204, 255, 0";
        const isLarge = upper === "UNIVERSAL MUSIC";
        // Règle simplifiée : dès qu'un texte est saisi dans l'admin, il s'affiche à côté du logo.
        const showLabel = isLogo && !!text;
        return (
          <div key={it.id ?? `${upper}-${i}`} className="mq-item" style={{ "--brand-color": brandColor } as React.CSSProperties}>
            {isLogo ? (
              <>
                <img
                  src={optimizeImage(it.image_url, { width: isLarge ? 240 : 160, quality: 80, resize: "contain" })}
                  alt={text}
                  className={`mq-logo ${isLarge ? "mq-logo--large" : ""}`}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
                {showLabel && <span className="mq-label">{text}</span>}
              </>
            ) : (
              text && <span className="mq-word">{text}</span>
            )}
          </div>
        );
      })
    : logos
    ? logos.map((logo, i) => {
        const brandColor = BRAND_COLORS[logo.name.toUpperCase()] || "204, 255, 0";
        const isLarge = logo.name.toUpperCase() === "UNIVERSAL MUSIC";
        const showLabel = !!logo.label;
        return (
          <div key={`${logo.name}-${i}`} className="mq-item" style={{ "--brand-color": brandColor } as React.CSSProperties}>
            {logo.logoUrl && (
              <img
                src={optimizeImage(logo.logoUrl, { width: isLarge ? 240 : 160, quality: 80, resize: "contain" })}
                alt={logo.name}
                className={`mq-logo ${isLarge ? "mq-logo--large" : ""}`}
                loading="eager"
                decoding="async"
                draggable={false}
              />
            )}
            {showLabel && <span className="mq-label">{logo.label}</span>}
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
      {/* Mini-titre "Exclusive Syndicate" */}
      <div className="mq-eyebrow">
        <div className="mq-eyebrow-line" />
        <span className="mq-eyebrow-text">Exclusive Syndicate</span>
        <div className="mq-eyebrow-line" />
      </div>

      <div className="mq-stage">
        <div className="mq-track">
          <div className="mq-list">{items}</div>
          <div className="mq-list" aria-hidden="true">{items}</div>
          <div className="mq-list" aria-hidden="true">{items}</div>
        </div>
      </div>

      <style>{`
        .mq-root {
          width: 100%;
          padding: 64px 0 72px;
          background:
            radial-gradient(ellipse 60% 50% at 50% 50%, hsl(var(--neon) / 0.03), transparent 70%),
            linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--foreground) / 0.015) 50%, hsl(var(--background)) 100%);
          border-top: 1px solid hsl(var(--foreground) / 0.06);
          border-bottom: 1px solid hsl(var(--foreground) / 0.06);
          position: relative;
        }

        .mq-eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 40px;
        }
        .mq-eyebrow-line {
          height: 1px;
          width: 40px;
          background: hsl(var(--foreground) / 0.2);
        }
        .mq-eyebrow-text {
          font-family: 'Clash Display', 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: hsl(var(--foreground) / 0.4);
        }

        .mq-stage {
          width: 100%;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
        }

        .mq-track {
          display: flex;
          width: max-content;
          animation: mq-scroll 50s linear infinite;
          will-change: transform;
        }

        .mq-list { display: flex; align-items: center; flex-shrink: 0; }

        .mq-item {
          margin-right: ${SPACING}px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          flex-shrink: 0;
          position: relative;
          padding: 14px 4px;
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
        }

        .mq-item::after {
          content: "";
          position: absolute;
          right: -${SPACING / 2}px;
          top: 50%;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: hsl(var(--foreground) / 0.18);
          transform: translateY(-50%);
        }

        .mq-item:hover { transform: translateY(-2px); }

        .mq-logo {
          height: 44px;
          max-width: 150px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.7;
          transition: filter 0.5s ease, opacity 0.5s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          display: block;
          flex-shrink: 0;
        }

        .mq-logo--large { height: 50px; max-width: 180px; }

        .mq-item:hover .mq-logo {
          filter: brightness(1) drop-shadow(0 0 18px rgba(var(--brand-color), 0.6));
          opacity: 1;
          transform: scale(1.06);
        }

        .mq-label {
          font-family: 'Clash Display', 'Inter', sans-serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: hsl(var(--foreground));
          opacity: 0.78;
          white-space: nowrap;
          transition: color 0.5s ease, opacity 0.5s ease, text-shadow 0.5s ease;
          flex-shrink: 0;
          line-height: 1;
        }

        .mq-item:hover .mq-label {
          opacity: 1;
          color: rgb(var(--brand-color));
          text-shadow: 0 0 24px rgba(var(--brand-color), 0.45);
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
          transition: opacity 0.4s ease, color 0.4s ease, text-shadow 0.4s ease;
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
          .mq-root { padding: 36px 0 44px; }
          .mq-eyebrow { margin-bottom: 24px; gap: 10px; }
          .mq-eyebrow-line { width: 24px; }
          .mq-eyebrow-text { font-size: 9px; letter-spacing: 0.3em; }
          .mq-logo { height: 30px; max-width: 110px; }
          .mq-logo--large { height: 36px; max-width: 130px; }
          .mq-label { font-size: 18px; }
          .mq-word { font-size: 11px; letter-spacing: 0.18em; }
          .mq-item { margin-right: 48px; padding: 8px 4px; gap: 12px; }
          .mq-item::after { right: -24px; }
          .mq-track { animation-duration: 38s; }
        }
      `}</style>
    </div>
  );
};

export default MarqueeText;
