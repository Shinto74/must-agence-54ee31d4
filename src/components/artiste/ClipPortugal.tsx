import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import { Play, MapPin, ArrowRight } from "lucide-react";
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

  return (
    <section ref={sectionRef} className="py-20 md:py-28 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full" style={{ background: "radial-gradient(ellipse, hsl(73 100% 50% / 0.03) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="rv mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.2em]" style={{ border: "1px solid hsl(73 100% 50% / 0.25)", color: "hsl(73 100% 50%)", background: "hsl(73 100% 50% / 0.06)" }}>
            <MapPin size={12} />
            Exclusivité
          </span>
        </div>
        <h2 className="rv font-clash text-3xl md:text-5xl font-black text-foreground tracking-tight mb-2">
          Tournez votre clip
        </h2>
        <h2 className="rv font-clash text-3xl md:text-5xl font-black tracking-tight mb-6" style={{ color: "hsl(73 100% 50%)" }}>
          au Portugal 🇵🇹
        </h2>
        <p className="rv text-foreground/60 text-sm md:text-base max-w-xl leading-relaxed mb-12">
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
                border: "1px solid hsla(0,0%,100%,0.08)",
                boxShadow: "0 30px 80px hsla(0,0%,0%,0.5), 0 0 60px hsl(73 100% 50% / 0.04)",
              }}
            >
              {/* Placeholder / Video */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80"
                loop
                playsInline
                muted
              >
                {/* Replace with actual video URL */}
              </video>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500" style={{ opacity: isPlaying ? 0.3 : 1 }} />

              {/* Play button */}
              {!isPlaying && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: "hsl(73 100% 50% / 0.15)",
                      border: "2px solid hsl(73 100% 50% / 0.5)",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 0 40px hsl(73 100% 50% / 0.2)",
                    }}
                  >
                    <Play size={32} className="text-primary ml-1" fill="hsl(73 100% 50%)" />
                  </div>
                </motion.div>
              )}

              {/* Bottom label */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="font-clash text-lg font-bold text-foreground">Must Agence × Portugal</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-primary">Clip & Production</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {[
              { title: "Décors exclusifs", desc: "Lisbonne, Algarve, Porto — des lieux uniques pour un visuel inédit", icon: "🎬" },
              { title: "Production complète", desc: "Réalisation, montage, color grading et post-production inclus", icon: "🎥" },
              { title: "Logistique totale", desc: "Vols, hébergement, transport — on organise tout pour vous", icon: "✈️" },
              { title: "Réseau local", desc: "Figurants, lieux privés, autorisations — notre réseau portugais à votre service", icon: "🤝" },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                className="rv p-5 rounded-xl flex gap-4 items-start transition-all duration-300"
                style={{
                  background: "hsla(0,0%,100%,0.02)",
                  border: "1px solid hsla(0,0%,100%,0.06)",
                }}
                whileHover={{
                  borderColor: "hsla(73,100%,50%,0.2)",
                  boxShadow: "0 0 25px hsl(73 100% 50% / 0.05)",
                }}
              >
                <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <h4 className="font-clash text-sm font-bold text-foreground mb-1">{item.title}</h4>
                  <p className="text-foreground/50 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* CTA */}
            <a
              href="#contact"
              className="rv mt-2 group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-clash text-sm font-bold uppercase tracking-wider transition-all duration-300"
              style={{
                background: "hsl(73 100% 50%)",
                color: "hsl(0 0% 4%)",
                boxShadow: "0 0 30px hsl(73 100% 50% / 0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 50px hsl(73 100% 50% / 0.4)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 30px hsl(73 100% 50% / 0.25)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Commencer l'aventure
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClipPortugal;
