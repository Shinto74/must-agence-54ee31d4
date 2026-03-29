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

  const scrollToCategory = useCallback((slug: string) => {
    setActiveSlug(slug);
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.querySelector(`[data-slug="${slug}"]`);
    if (firstCard) {
      const containerRect = el.getBoundingClientRect();
      const cardRect = firstCard.getBoundingClientRect();
      el.scrollTo({
        left: el.scrollLeft + (cardRect.left - containerRect.left) - 24,
        behavior: "smooth",
      });
    }
  }, []);

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

  const handleTouchStart = (e: React.TouchEvent) => { isDragging.current = true; startX.current = e.touches[0].pageX; };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    scrollRef.current.scrollLeft -= e.touches[0].pageX - startX.current;
    startX.current = e.touches[0].pageX;
  };
  const handleTouchEnd = () => { isDragging.current = false; };

  return (
    <section ref={sectionRef} className="py-20">
      <div className="max-w-[1400px] mx-auto px-6 mb-8">
        <p className="rv font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">{ARTIST_REFERENCES.label}</p>
        <h2 className="rv font-clash text-3xl md:text-4xl font-bold text-foreground">
          {ARTIST_REFERENCES.titleLine1} <br /><span className="text-primary">{ARTIST_REFERENCES.titleLine2}</span>
        </h2>

        {/* Category tabs — rectangular, large, matching reference */}
        <div className="rv flex justify-center gap-4 mt-8">
          {cats.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => scrollToCategory(cat.slug)}
              className={`relative px-8 py-3.5 text-xs sm:text-sm font-mono uppercase tracking-[0.15em] transition-all duration-300 border ${
                activeSlug === cat.slug
                  ? "border-primary text-primary bg-primary/5"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              {cat.name}
              {activeSlug === cat.slug && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Artist cards strip */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
        className="flex gap-3 sm:gap-4 overflow-x-auto px-4 sm:px-6 cursor-grab active:cursor-grabbing pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {[...allArtists, ...allArtists].map((artist, i) => (
          <div key={`${artist.name}-${i}`} data-slug={artist.slug} className="shrink-0 w-[165px] sm:w-[200px] md:w-[240px] group">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border transition-all duration-[550ms] group-hover:border-primary/30 group-hover:shadow-[0_0_20px_hsl(var(--neon)/0.12)]">
              <img src={artist.image} alt={artist.name} className="w-full h-full object-cover grayscale transition-all duration-[550ms] group-hover:grayscale-0 group-hover:scale-[1.06]" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <p className="font-clash font-semibold text-foreground text-xs sm:text-sm">{artist.name}</p>
                <p className="font-mono text-[9px] sm:text-[10px] text-primary uppercase tracking-wider">{artist.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArtistReferences;
