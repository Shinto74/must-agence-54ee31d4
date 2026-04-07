import { useEffect, useRef, useState, useCallback } from "react";
import { ARTIST_REFERENCES, ARTIST_DETAILS } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { X, Info } from "lucide-react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  const didDrag = useRef(false);
  const startX = useRef(0);
  const originX = useRef(0);
  const pauseAutoScrollUntil = useRef(0);

  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
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
    el.scrollTo({ left: Math.max(firstCard.offsetLeft - 24, 0), behavior: "smooth" });
  }, [allArtists]);

  const autoScroll = useCallback(() => {
    const el = scrollRef.current;
    const isPaused = Date.now() < pauseAutoScrollUntil.current;
    if (!el || isDragging.current || isPaused) {
      rafRef.current = requestAnimationFrame(autoScroll);
      return;
    }
    el.scrollLeft += 0.7;
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) el.scrollLeft = 0;
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

  const handleMouseDown = (e: React.MouseEvent) => { isDragging.current = true; didDrag.current = false; startX.current = e.pageX; pauseAutoScrollUntil.current = Date.now() + 1200; };
  const handleMouseMove = (e: React.MouseEvent) => { if (!isDragging.current || !scrollRef.current) return; const dx = e.pageX - startX.current; if (Math.abs(dx) > 5) didDrag.current = true; scrollRef.current.scrollLeft -= dx; startX.current = e.pageX; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleTouchStart = (e: React.TouchEvent) => { isDragging.current = true; didDrag.current = false; startX.current = e.touches[0].pageX; pauseAutoScrollUntil.current = Date.now() + 1200; };
  const handleTouchMove = (e: React.TouchEvent) => { if (!isDragging.current || !scrollRef.current) return; const dx = e.touches[0].pageX - startX.current; if (Math.abs(dx) > 5) didDrag.current = true; scrollRef.current.scrollLeft -= dx; startX.current = e.touches[0].pageX; };
  const handleTouchEnd = () => { isDragging.current = false; };

  const handleArtistClick = (artistName: string) => {
    console.log("Artist click:", artistName, "didDrag:", didDrag.current, "hasDetails:", !!ARTIST_DETAILS[artistName]);
    if (didDrag.current) return;
    setSelectedArtist(ARTIST_DETAILS[artistName] ? artistName : null);
  };

  const closeModal = () => setSelectedArtist(null);

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
                  border: isActive ? "1px solid hsl(73 100% 50%)" : "1px solid hsla(0,0%,100%,0.1)",
                  background: isActive ? "hsla(73,100%,50%,0.08)" : "hsla(0,0%,100%,0.03)",
                  color: isActive ? "hsl(73 100% 50%)" : "hsla(0,0%,100%,0.5)",
                  boxShadow: isActive ? "0 0 20px hsl(73 100% 50% / 0.15), inset 0 0 12px hsl(73 100% 50% / 0.05)" : "none",
                  backdropFilter: "blur(8px)",
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "hsla(73,100%,50%,0.4)"; e.currentTarget.style.color = "hsla(0,0%,100%,0.85)"; e.currentTarget.style.background = "hsla(0,0%,100%,0.06)"; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "hsla(0,0%,100%,0.1)"; e.currentTarget.style.color = "hsla(0,0%,100%,0.5)"; e.currentTarget.style.background = "hsla(0,0%,100%,0.03)"; } }}
              >
                {cat.name}
                {isActive && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full" style={{ background: "hsl(73 100% 50%)", boxShadow: "0 0 8px hsl(73 100% 50% / 0.6)" }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ ORIGINAL CAROUSEL — unchanged ═══ */}
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
              className={`group w-[165px] shrink-0 sm:w-[200px] md:w-[240px] relative ${hasDetails ? "cursor-pointer" : ""}`}
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

      {/* ═══ PREMIUM MODAL ═══ */}
      <AnimatePresence>
        {selectedArtist && currentArtist && currentDetails && createPortal(
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-40"
              onClick={closeModal}
              style={{
                background: "hsla(0,0%,0%,0.75)",
                backdropFilter: "blur(20px)",
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            >
              <div
                className="relative w-full max-w-2xl rounded-3xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "linear-gradient(160deg, hsl(0 0% 9%) 0%, hsl(0 0% 4%) 100%)",
                  border: "1px solid hsla(0,0%,100%,0.07)",
                  boxShadow: `
                    0 50px 100px hsla(0,0%,0%,0.7),
                    0 0 80px hsl(73 100% 50% / 0.05),
                    inset 0 1px 0 hsla(0,0%,100%,0.06)
                  `,
                }}
              >
                {/* Top neon line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(to right, transparent 10%, hsl(73 100% 50% / 0.5) 50%, transparent 90%)" }}
                />

                {/* Close button */}
                <button
                  onClick={closeModal}
                  className="absolute right-5 top-5 z-10 p-2.5 rounded-full transition-all duration-300"
                  style={{
                    background: "hsla(0,0%,100%,0.04)",
                    border: "1px solid hsla(0,0%,100%,0.1)",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "hsl(73 100% 50% / 0.5)";
                    e.currentTarget.style.boxShadow = "0 0 18px hsl(73 100% 50% / 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "hsla(0,0%,100%,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  aria-label="Fermer"
                >
                  <X size={18} className="text-foreground/60" />
                </button>

                {/* Content */}
                <div className="p-6 md:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Photo */}
                    <div className="relative">
                      <div
                        className="relative aspect-[3/4] overflow-hidden rounded-2xl"
                        style={{
                          border: "1px solid hsla(0,0%,100%,0.06)",
                          boxShadow: "0 25px 50px hsla(0,0%,0%,0.5), 0 0 40px hsl(73 100% 50% / 0.04)",
                        }}
                      >
                        <img
                          src={currentArtist.image}
                          alt={currentArtist.name}
                          className="h-full w-full object-cover"
                        />
                        <div
                          className="absolute inset-0"
                          style={{ background: "linear-gradient(to top, hsla(0,0%,0%,0.35) 0%, transparent 40%)" }}
                        />
                      </div>
                      {/* Decorative corner glow */}
                      <div
                        className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full pointer-events-none"
                        style={{ background: "radial-gradient(circle, hsl(73 100% 50% / 0.07) 0%, transparent 70%)" }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <motion.h3
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.15 }}
                          className="font-clash text-2xl md:text-3xl font-black text-foreground mb-1 tracking-tight"
                        >
                          {currentArtist.name}
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="font-mono text-xs uppercase tracking-[0.2em] mb-6"
                          style={{ color: "hsl(73 100% 50%)" }}
                        >
                          {currentDetails.strategie}
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.25 }}
                          className="text-foreground/65 leading-relaxed text-sm mb-6"
                        >
                          {currentDetails.description}
                        </motion.p>

                        {currentDetails.chiffre && (
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="mb-6 p-4 rounded-xl"
                            style={{
                              background: "hsl(73 100% 50% / 0.05)",
                              border: "1px solid hsl(73 100% 50% / 0.12)",
                              boxShadow: "inset 0 0 25px hsl(73 100% 50% / 0.03)",
                            }}
                          >
                            <p className="font-clash text-lg font-bold text-primary">
                              {currentDetails.chiffre}
                            </p>
                          </motion.div>
                        )}
                      </div>

                      {/* Plateformes */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.35 }}
                      >
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/35 mb-3">
                          Plateformes
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {currentDetails.plateformes.map((plateforme, idx) => (
                            <motion.span
                              key={plateforme}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.4 + idx * 0.06 }}
                              className="px-4 py-2 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] transition-all duration-300 cursor-default"
                              style={{
                                border: "1px solid hsl(73 100% 50% / 0.2)",
                                color: "hsl(73 100% 50% / 0.85)",
                                background: "hsl(73 100% 50% / 0.04)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "hsl(73 100% 50% / 0.1)";
                                e.currentTarget.style.borderColor = "hsl(73 100% 50% / 0.4)";
                                e.currentTarget.style.boxShadow = "0 0 15px hsl(73 100% 50% / 0.12)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "hsl(73 100% 50% / 0.04)";
                                e.currentTarget.style.borderColor = "hsl(73 100% 50% / 0.2)";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              {plateforme}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Bottom neon line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(to right, transparent 20%, hsl(73 100% 50% / 0.15) 50%, transparent 80%)" }}
                />
              </div>
            </motion.div>
          </>,
          document.body
        )}
      </AnimatePresence>
    </section>
  );
};

export default ArtistReferences;
