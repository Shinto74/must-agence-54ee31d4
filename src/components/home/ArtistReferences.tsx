import { useEffect, useRef, useState, useCallback } from "react";
import { ARTIST_REFERENCES, ARTIST_DETAILS } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { X, Info } from "lucide-react";
import { createPortal } from "react-dom";
 
interface ArtistReferencesProps {
  categories?: { name: string; slug: string; artists: { name: string; image: string }[] }[];
}
 
const ArtistReferences = ({ categories }: ArtistReferencesProps) => {
  const cats = categories || ARTIST_REFERENCES.categories.map((c) => ({
    name: c.name,
    slug: c.slug,
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
  const pauseAutoScrollUntil = useRef(0);
 
  // State pour la modale
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  // State pour le tooltip - specifique à chaque artiste par index
  const [hoveredInfoIcon, setHoveredInfoIcon] = useState<string | null>(null);
 
  const scrollToCategory = useCallback((slug: string) => {
    const el = scrollRef.current;
    if (!el) return;
 
    const firstIndex = allArtists.findIndex((artist) => artist.slug === slug);
    if (firstIndex === -1) return;
 
    const firstCard = el.querySelector<HTMLElement>(`[data-index="${firstIndex}"]`);
    if (!firstCard) return;
 
    pauseAutoScrollUntil.current = Date.now() + 1400;
    setActiveSlug(slug);
    el.scrollTo({
      left: Math.max(firstCard.offsetLeft - 24, 0),
      behavior: "smooth",
    });
  }, [allArtists]);
 
  const autoScroll = useCallback(() => {
    const el = scrollRef.current;
    const isPaused = Date.now() < pauseAutoScrollUntil.current;
 
    if (!el || isDragging.current || isPaused) {
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
      if (dist < closestDist) {
        closestDist = dist;
        closestSlug = card.dataset.slug || activeSlug;
      }
    });
 
    if (closestSlug !== activeSlug) setActiveSlug(closestSlug);
    rafRef.current = requestAnimationFrame(autoScroll);
  }, [activeSlug]);
 
  useEffect(() => {
    rafRef.current = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoScroll]);
 
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX;
    pauseAutoScrollUntil.current = Date.now() + 1200;
  };
 
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    scrollRef.current.scrollLeft -= e.pageX - startX.current;
    startX.current = e.pageX;
  };
 
  const handleMouseUp = () => {
    isDragging.current = false;
  };
 
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX;
    pauseAutoScrollUntil.current = Date.now() + 1200;
  };
 
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    scrollRef.current.scrollLeft -= e.touches[0].pageX - startX.current;
    startX.current = e.touches[0].pageX;
  };
 
  const handleTouchEnd = () => {
    isDragging.current = false;
  };
 
  const handleArtistClick = (artistName: string) => {
    if (ARTIST_DETAILS[artistName]) {
      setSelectedArtist(artistName);
    }
  };
 
  const closeModal = () => {
    setSelectedArtist(null);
  };
 
  const currentArtist = selectedArtist ? allArtists.find((a) => a.name === selectedArtist) : null;
  const currentDetails = selectedArtist ? ARTIST_DETAILS[selectedArtist] : null;
 
  return (
    <section ref={sectionRef} className="py-20">
      <div className="max-w-[1400px] mx-auto px-6 mb-8">
        <p className="rv mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">
          {ARTIST_REFERENCES.label}
        </p>
        <h2 className="rv font-clash text-3xl font-bold text-foreground md:text-4xl tracking-tight" style={{ wordSpacing: "0.15em" }}>
          {ARTIST_REFERENCES.titleLine1}
        </h2>
        <h2 className="rv font-clash text-3xl font-bold text-primary md:text-4xl tracking-tight" style={{ wordSpacing: "0.15em" }}>
          {ARTIST_REFERENCES.titleLine2}
        </h2>
 
        <div className="rv mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
          {cats.map((cat) => {
            const isActive = activeSlug === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => scrollToCategory(cat.slug)}
                className="relative overflow-hidden rounded-full font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-400 sm:text-[11px]"
                style={{
                  padding: "12px 28px",
                  border: isActive
                    ? "1px solid hsl(73 100% 50%)"
                    : "1px solid hsla(0,0%,100%,0.1)",
                  background: isActive
                    ? "hsla(73,100%,50%,0.08)"
                    : "hsla(0,0%,100%,0.03)",
                  color: isActive
                    ? "hsl(73 100% 50%)"
                    : "hsla(0,0%,100%,0.5)",
                  boxShadow: isActive
                    ? "0 0 20px hsl(73 100% 50% / 0.15), inset 0 0 12px hsl(73 100% 50% / 0.05)"
                    : "none",
                  backdropFilter: "blur(8px)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.borderColor = "hsla(73,100%,50%,0.4)";
                    (e.currentTarget as HTMLElement).style.color = "hsla(0,0%,100%,0.85)";
                    (e.currentTarget as HTMLElement).style.background = "hsla(0,0%,100%,0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.borderColor = "hsla(0,0%,100%,0.1)";
                    (e.currentTarget as HTMLElement).style.color = "hsla(0,0%,100%,0.5)";
                    (e.currentTarget as HTMLElement).style.background = "hsla(0,0%,100%,0.03)";
                  }
                }}
              >
                {cat.name}
                {isActive && (
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full"
                    style={{
                      background: "hsl(73 100% 50%)",
                      boxShadow: "0 0 8px hsl(73 100% 50% / 0.6)",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
 
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="scrollbar-hide flex cursor-grab gap-3 overflow-x-auto px-4 pb-4 active:cursor-grabbing sm:gap-4 sm:px-6"
        style={{ scrollbarWidth: "none" }}
      >
        {[...allArtists, ...allArtists].map((artist, i) => {
          const normalizedIndex = i % allArtists.length;
          const hasDetails = !!ARTIST_DETAILS[artist.name];
          const uniqueKey = `${artist.name}-${i}`;
 
          return (
            <div
              key={uniqueKey}
              data-slug={artist.slug}
              data-index={normalizedIndex}
              className={`group w-[165px] shrink-0 sm:w-[200px] md:w-[240px] relative ${
                hasDetails ? "cursor-pointer" : ""
              }`}
              onClick={() => hasDetails && handleArtistClick(artist.name)}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-[0_0_20px_hsl(var(--neon)/0.12)]">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.06] group-hover:grayscale-0"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <p className="font-clash text-xs font-semibold text-foreground sm:text-sm">
                    {artist.name}
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-primary sm:text-[10px]">
                    {artist.category}
                  </p>
                </div>
 
                {/* Info Icon - en haut à droite si artiste a des détails */}
                {hasDetails && (
                  <div
                    className="absolute top-3 right-3"
                    onMouseEnter={() => setHoveredInfoIcon(uniqueKey)}
                    onMouseLeave={() => setHoveredInfoIcon(null)}
                  >
                    <div className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-primary/30 hover:bg-black/60 transition-all">
                      <Info size={14} className="text-primary" />
                    </div>
                    {hoveredInfoIcon === uniqueKey && (
                      <div className="absolute -bottom-8 right-0 whitespace-nowrap px-2 py-1 rounded bg-black/80 text-primary text-[10px] font-mono uppercase tracking-wider pointer-events-none">
                        Voir détails
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
 
      {/* MODALE Centrée */}
      {selectedArtist && currentArtist && currentDetails && createPortal(
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
              selectedArtist ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={closeModal}
            style={{ backdropFilter: selectedArtist ? "blur(8px)" : "none" }}
          />
 
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto">
            <div
              className={`relative w-full max-w-2xl rounded-2xl border border-border bg-surface transition-all duration-300 ${
                selectedArtist
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute right-6 top-6 p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-primary/5 rounded-lg z-10"
                aria-label="Fermer"
              >
                <X size={24} />
              </button>
 
              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Photo */}
                  <div>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border">
                      <img
                        src={currentArtist.image}
                        alt={currentArtist.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
 
                  {/* Info */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="font-clash text-2xl font-bold text-foreground mb-2">
                        {currentArtist.name}
                      </h3>
                      <p className="font-mono text-sm uppercase tracking-wider text-primary mb-6">
                        {currentDetails.strategie}
                      </p>
                      <p className="text-foreground/80 leading-relaxed mb-6">
                        {currentDetails.description}
                      </p>
 
                      {currentDetails.chiffre && (
                        <div className="mb-6 p-4 rounded-lg border border-primary/20 bg-primary/5">
                          <p className="font-clash text-lg font-bold text-primary">
                            {currentDetails.chiffre}
                          </p>
                        </div>
                      )}
                    </div>
 
                    {/* Plateformes */}
                    <div>
                      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
                        Plateformes
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {currentDetails.plateformes.map((plateforme) => (
                          <span
                            key={plateforme}
                            className="px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono uppercase tracking-wider"
                          >
                            {plateforme}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </section>
  );
};
 
export default ArtistReferences;