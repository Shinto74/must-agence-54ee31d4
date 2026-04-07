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
 
      {/* MODALE Glassmorphism */}
      {selectedArtist && currentArtist && currentDetails && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 transition-opacity duration-400"
            onClick={closeModal}
            style={{
              background: "hsla(0,0%,0%,0.6)",
              backdropFilter: "blur(16px) saturate(1.2)",
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto" onClick={closeModal}>
            <div
              className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "hsla(0,0%,6%,0.75)",
                backdropFilter: "blur(40px) saturate(1.3)",
                border: "1px solid hsla(73,100%,50%,0.12)",
                boxShadow: "0 0 60px hsla(73,100%,50%,0.06), 0 25px 50px hsla(0,0%,0%,0.4), inset 0 1px 0 hsla(0,0%,100%,0.05)",
              }}
            >
              {/* Neon accent top border */}
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: "linear-gradient(to right, transparent, hsl(73 100% 50% / 0.4), transparent)" }}
              />

              {/* Close */}
              <button
                onClick={closeModal}
                className="absolute right-5 top-5 p-2 rounded-full z-10 transition-all duration-300"
                style={{
                  background: "hsla(0,0%,100%,0.06)",
                  border: "1px solid hsla(0,0%,100%,0.08)",
                  color: "hsla(0,0%,100%,0.5)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "hsla(73,100%,50%,0.1)";
                  (e.currentTarget as HTMLElement).style.borderColor = "hsla(73,100%,50%,0.3)";
                  (e.currentTarget as HTMLElement).style.color = "hsl(73 100% 50%)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "hsla(0,0%,100%,0.06)";
                  (e.currentTarget as HTMLElement).style.borderColor = "hsla(0,0%,100%,0.08)";
                  (e.currentTarget as HTMLElement).style.color = "hsla(0,0%,100%,0.5)";
                }}
                aria-label="Fermer"
              >
                <X size={18} />
              </button>

              <div className="p-7 md:p-9">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Photo with neon frame */}
                  <div className="relative">
                    <div
                      className="relative aspect-[3/4] overflow-hidden rounded-xl"
                      style={{
                        border: "1px solid hsla(73,100%,50%,0.15)",
                        boxShadow: "0 0 30px hsla(73,100%,50%,0.08), inset 0 0 20px hsla(0,0%,0%,0.3)",
                      }}
                    >
                      <img
                        src={currentArtist.image}
                        alt={currentArtist.name}
                        className="h-full w-full object-cover"
                      />
                      {/* Photo overlay gradient */}
                      <div className="absolute inset-0" style={{
                        background: "linear-gradient(to top, hsla(0,0%,0%,0.4) 0%, transparent 40%)",
                      }} />
                    </div>
                    {/* Glow behind photo */}
                    <div className="absolute -inset-3 -z-10 rounded-2xl" style={{
                      background: "radial-gradient(circle, hsl(73 100% 50% / 0.06) 0%, transparent 70%)",
                    }} />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="font-clash text-2xl font-bold text-foreground mb-1">
                        {currentArtist.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-5 h-px" style={{ background: "hsl(73 100% 50% / 0.5)" }} />
                        <p className="font-mono text-[10px] uppercase tracking-[.2em]" style={{ color: "hsl(73 100% 50%)" }}>
                          {currentDetails.strategie}
                        </p>
                      </div>

                      {/* Separator */}
                      <div className="w-full h-px mb-5" style={{ background: "linear-gradient(to right, hsla(73,100%,50%,0.15), transparent)" }} />

                      <p className="leading-relaxed mb-6" style={{ color: "hsla(0,0%,100%,0.65)", fontSize: "14px" }}>
                        {currentDetails.description}
                      </p>

                      {currentDetails.chiffre && (
                        <div
                          className="mb-6 p-4 rounded-lg"
                          style={{
                            background: "hsla(73,100%,50%,0.04)",
                            border: "1px solid hsla(73,100%,50%,0.12)",
                          }}
                        >
                          <p className="font-clash text-lg font-bold" style={{ color: "hsl(73 100% 50%)" }}>
                            {currentDetails.chiffre}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Plateformes */}
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[.25em] mb-3" style={{ color: "hsla(0,0%,100%,0.3)" }}>
                        Plateformes
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {currentDetails.plateformes.map((plateforme) => (
                          <span
                            key={plateforme}
                            className="px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[.15em]"
                            style={{
                              background: "hsla(73,100%,50%,0.06)",
                              border: "1px solid hsla(73,100%,50%,0.15)",
                              color: "hsl(73 100% 50% / 0.8)",
                            }}
                          >
                            {plateforme}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom neon line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[1px]"
                style={{ background: "linear-gradient(to right, transparent, hsl(73 100% 50% / 0.2), transparent)" }}
              />
            </div>
          </div>
        </>,
        document.body
      )}
    </section>
  );
};
 
export default ArtistReferences;