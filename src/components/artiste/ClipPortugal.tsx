import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import { Play, Pause, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";

const ClipPortugal = () => {
  const sectionRef = useScrollReveal();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const features = [
    {
      title: "Décors exclusifs",
      desc: "Lisbonne, Algarve, Porto — des lieux uniques pour un visuel inédit",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="hsl(73 100% 50%)" strokeWidth="1.5">
          <path d="M15 10l4.55-2.73A1 1 0 0121 8.13v7.74a1 1 0 01-1.45.86L15 14" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="3" y="6" width="12" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Production complète",
      desc: "Réalisation, montage, color grading et post-production inclus",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="hsl(73 100% 50%)" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: "Logistique totale",
      desc: "Vols, hébergement, transport — on organise tout pour vous",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="hsl(73 100% 50%)" strokeWidth="1.5">
          <path d="M3 12h4l3-9 4 18 3-9h4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Réseau local",
      desc: "Figurants, lieux privés, autorisations — notre réseau à votre service",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="hsl(73 100% 50%)" strokeWidth="1.5">
          <circle cx="12" cy="5" r="3" />
          <circle cx="5" cy="19" r="3" />
          <circle cx="19" cy="19" r="3" />
          <path d="M12 8v4m-4.5 3.5L10 13m4 0l2.5 2.5" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full" style={{ background: "radial-gradient(ellipse, hsl(var(--neon) / 0.04) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="rv mb-6 flex items-center gap-3">
          <div className="w-8 h-[2px] rounded-full" style={{ background: "hsl(var(--neon))" }} />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: "hsl(var(--neon))" }}>
            Exclusivité Must Agence
          </span>
        </div>

        <h2 className="rv font-clash text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1] mb-3">
          Tournez votre clip
        </h2>
        <h2 className="rv font-clash text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-8" style={{ color: "hsl(var(--neon))" }}>
          au Portugal
        </h2>
        <p className="rv text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed mb-14">
          Des décors de rêve entre Lisbonne, l'Algarve et Porto. Une production clé en main : réalisation, logistique, hébergement. Concentrez-vous sur votre art, on gère le reste.
        </p>

        {/* Video + Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* Video */}
          <div className="lg:col-span-3 rv">
            <div
              className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group"
              onClick={handlePlay}
              style={{
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 30px 80px hsla(0,0%,0%,0.5), 0 0 60px hsl(var(--neon) / 0.04)",
              }}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80"
                loop
                playsInline
                muted
              />

              {/* Overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.4) 40%, transparent 100%)",
                  opacity: isPlaying ? 0.2 : 1,
                }}
              />

              {/* Play/Pause button */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={false}
                animate={{ opacity: isPlaying ? 0 : 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: "hsl(var(--neon) / 0.1)",
                    border: "2px solid hsl(var(--neon) / 0.4)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 0 40px hsl(var(--neon) / 0.15)",
                  }}
                >
                  {isPlaying ? (
                    <Pause size={28} className="text-primary" />
                  ) : (
                    <Play size={28} className="text-primary ml-1" fill="hsl(var(--neon))" />
                  )}
                </div>
              </motion.div>

              {/* Bottom label */}
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                <div>
                  <p className="font-clash text-base font-bold text-foreground">Must Agence × Portugal</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-primary">Clip & Production</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {features.map((item, idx) => (
              <motion.div
                key={item.title}
                className="rv p-5 rounded-xl flex gap-4 items-start card-hover"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "hsl(var(--neon) / 0.08)",
                    border: "1px solid hsl(var(--neon) / 0.15)",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-clash text-sm font-bold text-foreground mb-1">{item.title}</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* CTA */}
            <motion.a
              href="#contact"
              className="rv mt-2 group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-clash text-sm font-bold uppercase tracking-wider"
              style={{
                background: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 30px hsl(var(--neon) / 0.25)",
              }}
              whileHover={{ y: -2, boxShadow: "0 0 50px hsl(73 100% 50% / 0.4)" }}
              transition={{ duration: 0.3 }}
            >
              Commencer l'aventure
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClipPortugal;
