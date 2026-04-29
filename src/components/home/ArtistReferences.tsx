import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { useArtistDetails } from "@/hooks/useArtistePage";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X, Info } from "lucide-react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { optimizeImage, optimizeImageSrcSet } from "@/lib/imageOptimizer";

interface ArtistReferencesProps {
  categories?: { name: string; slug: string; artists: { name: string; image: string; id?: string }[] }[];
}

const ArtistReferences = ({ categories }: ArtistReferencesProps) => {
  const { get } = useSiteSettings();
  const { data: details = [] } = useArtistDetails();
  const { data: rawArtists = [] } = useQuery({
    queryKey: ["artists_raw"],
    queryFn: async () => {
      const { data, error } = await supabase.from("artists").select("id,name");
      if (error) throw error;
      return data || [];
    },
  });

  // Map: name -> details from BDD (lookup via artist_id from rawArtists)
  const detailsByName = useMemo(() => {
    const m: Record<string, any> = {};
    (details as any[]).forEach((d) => {
      const a = (rawArtists as any[]).find((x) => x.id === d.artist_id);
      if (a) m[a.name] = d;
    });
    return m;
  }, [details, rawArtists]);

  const cats = categories || [];

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

  const handleMouseDown = (e: React.MouseEvent) => { isDragging.current = true; didDrag.current = false; startX.current = e.pageX; originX.current = e.pageX; pauseAutoScrollUntil.current = Date.now() + 1200; };
  const handleMouseMove = (e: React.MouseEvent) => { if (!isDragging.current || !scrollRef.current) return; if (Math.abs(e.pageX - originX.current) > 8) didDrag.current = true; scrollRef.current.scrollLeft -= e.pageX - startX.current; startX.current = e.pageX; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleTouchStart = (e: React.TouchEvent) => { isDragging.current = true; didDrag.current = false; startX.current = e.touches[0].pageX; originX.current = e.touches[0].pageX; pauseAutoScrollUntil.current = Date.now() + 1200; };
  const handleTouchMove = (e: React.TouchEvent) => { if (!isDragging.current || !scrollRef.current) return; if (Math.abs(e.touches[0].pageX - originX.current) > 8) didDrag.current = true; scrollRef.current.scrollLeft -= e.touches[0].pageX - startX.current; startX.current = e.touches[0].pageX; };
  const handleTouchEnd = () => { isDragging.current = false; };

  const handleArtistClick = (artistName: string) => {
    if (didDrag.current) return;
    setSelectedArtist(detailsByName[artistName] ? artistName : null);
  };

  const closeModal = () => setSelectedArtist(null);

  const currentArtist = selectedArtist ? allArtists.find((a) => a.name === selectedArtist) : null;
  const currentDetails = selectedArtist ? detailsByName[selectedArtist] : null;

  return (
    <section ref={sectionRef} className="py-20">
      <div className="max-w-[1400px] mx-auto px-6 mb-8">
        <p className="rv mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">
          {get("artist_ref_label", "Références Artistes")}
        </p>
        <h2 className="rv font-clash text-3xl font-bold text-foreground md:text-4xl tracking-tight" style={{ wordSpacing: "0.15em" }}>
          {get("artist_ref_title_line1", "Ils nous ont fait confiance")}
        </h2>
        <h2 className="rv font-clash text-3xl font-bold text-primary md:text-4xl tracking-tight" style={{ wordSpacing: "0.15em" }}>
          {get("artist_ref_title_line2", "pour leurs sorties")}
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
          const hasDetails = !!detailsByName[artist.name];
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
                  src={optimizeImage(artist.image, { width: 320, quality: 65 })}
                  srcSet={optimizeImageSrcSet(artist.image, 320, { quality: 65 })}
                  sizes="(max-width: 640px) 165px, (max-width: 768px) 200px, 240px"
                  alt={artist.name}
                  className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.06] group-hover:grayscale-0"
                  loading={i < 6 ? "eager" : "lazy"}
                  decoding="async"
                  {...(i < 4 ? { fetchPriority: "high" as any } : {})}
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
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedArtist && currentArtist && currentDetails ? (
            <motion.div
              key={selectedArtist}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-50"
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0"
                onClick={closeModal}
                initial={{ backdropFilter: "blur(0px)" }}
                animate={{ backdropFilter: "blur(24px)" }}
                exit={{ backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.5 }}
                style={{ background: "hsla(0,0%,0%,0.8)" }}
              />

              <div className="relative flex min-h-full items-center justify-center overflow-y-auto p-4 sm:p-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 60, rotateX: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full max-w-[720px] rounded-3xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: "linear-gradient(160deg, hsl(0 0% 11%) 0%, hsl(0 0% 5%) 100%)",
                    border: "1px solid hsla(0,0%,100%,0.08)",
                    boxShadow: `
                      0 60px 120px hsla(0,0%,0%,0.8),
                      0 0 100px hsl(73 100% 50% / 0.06),
                      inset 0 1px 0 hsla(0,0%,100%,0.08)
                    `,
                    perspective: "1000px",
                  }}
                >
                  {/* Animated top neon line */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[2px] z-10"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      background: "linear-gradient(to right, transparent 5%, hsl(73 100% 50% / 0.7) 50%, transparent 95%)",
                      transformOrigin: "center",
                    }}
                  />

                  {/* Corner glow effects */}
                  <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, hsl(73 100% 50% / 0.04) 0%, transparent 70%)" }} />
                  <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, hsl(73 100% 50% / 0.06) 0%, transparent 70%)" }} />

                  {/* Close button */}
                  <motion.button
                    onClick={closeModal}
                    initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="absolute right-5 top-5 z-10 p-2.5 rounded-full transition-all duration-300"
                    style={{
                      background: "hsla(0,0%,100%,0.05)",
                      border: "1px solid hsla(0,0%,100%,0.12)",
                      backdropFilter: "blur(8px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "hsl(73 100% 50% / 0.5)";
                      e.currentTarget.style.boxShadow = "0 0 20px hsl(73 100% 50% / 0.2)";
                      e.currentTarget.style.background = "hsla(73,100%,50%,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "hsla(0,0%,100%,0.12)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.background = "hsla(0,0%,100%,0.05)";
                    }}
                    aria-label="Fermer"
                  >
                    <X size={18} className="text-foreground/70" />
                  </motion.button>

                  {/* Content */}
                  <div className="p-6 md:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Photo with reveal animation */}
                      <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: -40, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div
                          className="relative aspect-[3/4] overflow-hidden rounded-2xl"
                          style={{
                            border: "1px solid hsla(0,0%,100%,0.08)",
                            boxShadow: "0 30px 60px hsla(0,0%,0%,0.6), 0 0 50px hsl(73 100% 50% / 0.05)",
                          }}
                        >
                          <motion.img
                            src={currentArtist.image}
                            alt={currentArtist.name}
                            className="h-full w-full object-cover"
                            initial={{ scale: 1.15 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          />
                          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsla(0,0%,0%,0.4) 0%, transparent 50%)" }} />
                          
                          {/* Category badge on image */}
                          <motion.div
                            className="absolute bottom-4 left-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                          >
                            <span
                              className="px-3 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-[0.2em]"
                              style={{
                                background: "hsl(73 100% 50% / 0.12)",
                                border: "1px solid hsl(73 100% 50% / 0.3)",
                                color: "hsl(73 100% 50%)",
                                backdropFilter: "blur(12px)",
                              }}
                            >
                              {currentArtist.category}
                            </span>
                          </motion.div>
                        </div>

                        {/* Decorative glow */}
                        <motion.div
                          className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1, delay: 0.4 }}
                          style={{ background: "radial-gradient(circle, hsl(73 100% 50% / 0.08) 0%, transparent 70%)" }}
                        />
                      </motion.div>

                      {/* Info */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <motion.h3
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="font-clash text-3xl md:text-4xl font-black text-foreground mb-2 tracking-tight"
                          >
                            {currentArtist.name}
                          </motion.h3>

                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "3rem" }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="h-[2px] mb-4"
                            style={{ background: "hsl(73 100% 50%)" }}
                          />

                          <motion.p
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="font-mono text-[11px] uppercase tracking-[0.2em] mb-5"
                            style={{ color: "hsl(73 100% 50%)" }}
                          >
                            {currentDetails.strategie}
                          </motion.p>

                          {/* Description with animated bullet */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.35 }}
                            className="flex gap-3 mb-6"
                          >
                            <motion.div
                              className="mt-2 w-2 h-2 rounded-full shrink-0"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.5, type: "spring", stiffness: 300 }}
                              style={{
                                background: "hsl(73 100% 50%)",
                                boxShadow: "0 0 10px hsl(73 100% 50% / 0.5)",
                              }}
                            />
                            <p className="text-foreground/70 leading-relaxed text-[13px]">
                              {currentDetails.description}
                            </p>
                          </motion.div>

                          {currentDetails.chiffre && (
                            <motion.div
                              initial={{ opacity: 0, y: 20, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                              className="mb-6 p-5 rounded-xl relative overflow-hidden"
                              style={{
                                background: "hsl(73 100% 50% / 0.04)",
                                border: "1px solid hsl(73 100% 50% / 0.15)",
                              }}
                            >
                              <motion.div
                                className="absolute inset-0"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                                style={{ background: "linear-gradient(90deg, transparent, hsl(73 100% 50% / 0.06), transparent)" }}
                              />
                              <p className="font-clash text-xl font-bold text-primary relative z-10">
                                {currentDetails.chiffre}
                              </p>
                            </motion.div>
                          )}
                        </div>

                        {/* Plateformes */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.45 }}
                        >
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-3">
                            Plateformes
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {currentDetails.plateformes.map((plateforme, idx) => (
                              <motion.span
                                key={plateforme}
                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                  duration: 0.4,
                                  delay: 0.5 + idx * 0.08,
                                  type: "spring",
                                  stiffness: 200,
                                  damping: 15,
                                }}
                                className="px-4 py-2 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] transition-all duration-300 cursor-default"
                                style={{
                                  border: "1px solid hsl(73 100% 50% / 0.2)",
                                  color: "hsl(73 100% 50% / 0.85)",
                                  background: "hsl(73 100% 50% / 0.04)",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "hsl(73 100% 50% / 0.12)";
                                  e.currentTarget.style.borderColor = "hsl(73 100% 50% / 0.5)";
                                  e.currentTarget.style.boxShadow = "0 0 18px hsl(73 100% 50% / 0.15)";
                                  e.currentTarget.style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "hsl(73 100% 50% / 0.04)";
                                  e.currentTarget.style.borderColor = "hsl(73 100% 50% / 0.2)";
                                  e.currentTarget.style.boxShadow = "none";
                                  e.currentTarget.style.transform = "translateY(0)";
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

                  {/* Animated bottom neon line */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      background: "linear-gradient(to right, transparent 10%, hsl(73 100% 50% / 0.3) 50%, transparent 90%)",
                      transformOrigin: "center",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

export default ArtistReferences;
