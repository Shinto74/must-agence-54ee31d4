import { useEffect, useRef, useState, useCallback } from "react";
import { ARTIST_REFERENCES } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ArtistReferencesProps {
  categories?: { name: string; slug: string; artists: { name: string; image: string }[] }[];
}

const ArtistReferences = ({ categories }: ArtistReferencesProps) => {
  const cats = categories || ARTIST_REFERENCES.categories.map((c) => ({
    name: c.name, slug: c.slug,
    artists: c.artists.map((a) => ({ name: a.name, image: a.image })),
  }));

  const allArtists = cats.flatMap((cat) =>
    cat.artists.map((a) => ({ ...a, category: cat.name, slug: cat.slug }))
  );

  const sectionRef = useScrollReveal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlug, setActiveSlug] = useState(cats[0]?.slug || "");
  const rafRef = useRef<number>(0);
  const isDragging = useRef(false);
  const startX = useRef(0);

  const autoScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isDragging.current) {
      rafRef.current = requestAnimationFrame(autoScroll);
      return;
    }
    el.scrollLeft += 0.7;
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
      el.scrollLeft = 0;
    }
    const centerX = el.scrollLeft + el.clientWidth / 2;
    const cards = el.querySelectorAll<HTMLElement>("[data-slug]");
    let closestSlug = activeSlug;
    let closestDist = Infinity;
    cards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - centerX);
      if (dist < closestDist) { closestDist = dist; closestSlug = card.dataset.slug || activeSlug; }
    });
    if (closestSlug !== activeSlug) setActiveSlug(closestSlug);
    rafRef.current = requestAnimationFrame(autoScroll);
  }, [activeSlug]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoScroll]);

  const handleMouseDown = (e: React.MouseEvent) => { isDragging.current = true; startX.current = e.pageX; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    scrollRef.current.scrollLeft -= e.pageX - startX.current;
    startX.current = e.pageX;
  };
  const handleMouseUp = () => { isDragging.current = false; };

  return (
    <section ref={sectionRef} className="py-20">
      <div className="max-w-[1400px] mx-auto px-6 mb-8">
        <p className="rv font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">{ARTIST_REFERENCES.label}</p>
        <h2 className="rv font-clash text-3xl md:text-4xl font-bold text-foreground">
          {ARTIST_REFERENCES.titleLine1} <br /><span className="text-primary">{ARTIST_REFERENCES.titleLine2}</span>
        </h2>
        <div className="rv flex gap-2 mt-6">
          {cats.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                setActiveSlug(cat.slug);
                scrollRef.current?.querySelector(`[data-slug="${cat.slug}"]`)?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
              }}
              className={`relative px-4 py-2 rounded-lg text-xs font-mono transition-all duration-300 border ${
                activeSlug === cat.slug ? "border-primary/40 text-primary bg-primary/5" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeSlug === cat.slug && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary animate-tabPop" />}
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={scrollRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
        className="flex gap-4 overflow-x-auto px-6 cursor-grab active:cursor-grabbing pb-4 scrollbar-hide" style={{ scrollbarWidth: "none" }}
      >
        {[...allArtists, ...allArtists].map((artist, i) => (
          <div key={`${artist.name}-${i}`} data-slug={artist.slug} className="shrink-0 w-[200px] md:w-[240px] group">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border transition-all duration-[550ms] group-hover:border-primary/30 group-hover:shadow-[0_0_20px_hsl(var(--neon)/0.12)]">
              <img src={artist.image} alt={artist.name} className="w-full h-full object-cover grayscale transition-all duration-[550ms] group-hover:grayscale-0 group-hover:scale-[1.06]" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-clash font-semibold text-foreground text-sm">{artist.name}</p>
                <p className="font-mono text-[10px] text-primary uppercase tracking-wider">{artist.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArtistReferences;
