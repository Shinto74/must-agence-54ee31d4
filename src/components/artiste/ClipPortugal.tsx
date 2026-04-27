import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ArrowRight, X, Send, CheckCircle, Loader2, Phone } from "lucide-react";
import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/integrations/supabase/client";
import { useClipPortugalAdvantages, useSiteSettings } from "@/hooks/useSiteContent";

const ClipPortugal = () => {
  const sectionRef = useScrollReveal();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nom: "", prenom: "", age: "", budget: "", idees: "", email: "", telephone: "" });
  const videoRef = useRef<HTMLVideoElement>(null);
  const { data: dbAdvantages } = useClipPortugalAdvantages();
  const { get } = useSiteSettings();
  const cpKicker = get("clip_portugal_kicker", "Exclusivité Must Agence");
  const cpTitle1 = get("clip_portugal_title_line1", "Tournez votre clip");
  const cpTitle2 = get("clip_portugal_title_line2", "au Portugal");
  const cpDescription = get("clip_portugal_description", "");
  const cpCta = get("clip_portugal_cta", "Commencer l'aventure");
  const cpPoster = get("clip_portugal_poster", "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80");
  const cpVideoUrl = get("clip_portugal_video_url", "");

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play().catch(() => {});
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubmit = async () => {
    if (!form.nom || !form.prenom || !form.email || !form.telephone) return;
    setLoading(true);
    try {
      await supabase.from("contact_submissions").insert({
        name: `${form.prenom} ${form.nom}`,
        email: form.email,
        type: "clip-portugal",
        message: `Téléphone: ${form.telephone}\nÂge: ${form.age}\nBudget: ${form.budget}\nIdées: ${form.idees}`,
      });
    } catch (e) { /* silent */ }
    setLoading(false);
    setSubmitted(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setSubmitted(false);
    setForm({ nom: "", prenom: "", age: "", budget: "", idees: "", email: "", telephone: "" });
  };

  const defaultIcon = (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="hsl(73 100% 50%)" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" />
    </svg>
  );
  // Affiche l'icône depuis le DB si présente (emoji court ou symbole), sinon le SVG fallback.
  const renderIcon = (raw?: string) => {
    const v = (raw || "").trim();
    if (!v) return defaultIcon;
    // emoji / texte court → on l'affiche tel quel, gros et lisible
    if (v.length <= 4) {
      // Force la teinte verte néon sur les emojis (utilise le mix-blend pour colorer)
      return (
        <span
          className="text-2xl leading-none"
          style={{
            color: "hsl(73 100% 50%)",
            filter: "drop-shadow(0 0 8px hsl(73 100% 50% / 0.5))",
            // Convertit les emojis colorés en teinte verte néon
            WebkitTextFillColor: "transparent",
            background: "hsl(73 100% 50%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          {v}
        </span>
      );
    }
    // sinon, on suppose une URL d'image
    return <img src={v} alt="" className="w-6 h-6 object-contain" />;
  };
  const features = (dbAdvantages && dbAdvantages.length > 0)
    ? dbAdvantages.map((a: any) => ({ title: a.title, desc: a.description, icon: renderIcon(a.icon) }))
    : [
        { title: "Décors exclusifs", desc: "Lisbonne, Algarve, Porto — des lieux uniques pour un visuel inédit", icon: defaultIcon },
        { title: "Production complète", desc: "Réalisation, montage, color grading et post-production inclus", icon: defaultIcon },
        { title: "Logistique totale", desc: "Vols, hébergement, transport — on organise tout pour vous", icon: defaultIcon },
        { title: "Réseau local", desc: "Figurants, lieux privés, autorisations — notre réseau à votre service", icon: defaultIcon },
      ];

  const inputClass = "w-full px-4 py-3.5 rounded-xl text-sm font-outfit text-foreground placeholder:text-foreground/30 outline-none transition-all duration-300 focus:shadow-[0_0_20px_hsl(var(--neon)/0.15)] focus:border-primary/50";
  const inputStyle = {
    background: "hsl(var(--background) / 0.6)",
    border: "1px solid hsl(var(--foreground) / 0.15)",
    color: "hsl(var(--foreground))",
  };
  const labelClass = "block font-mono text-[11px] uppercase tracking-[0.15em] mb-2.5 font-medium";

  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full" style={{ background: "radial-gradient(ellipse, hsl(var(--neon) / 0.04) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <motion.div
          className="rv mb-6 flex items-center gap-3"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <motion.div
            className="w-8 h-[2px] rounded-full"
            style={{ background: "hsl(var(--neon))" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: "hsl(var(--neon))" }}>
            {cpKicker}
          </span>
        </motion.div>

        <motion.h2
          className="rv font-clash text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1] mb-3"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          {cpTitle1}
        </motion.h2>
        <motion.h2
          className="rv font-clash text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-8"
          style={{ color: "hsl(var(--neon))" }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          {cpTitle2}
        </motion.h2>
        <motion.p
          className="rv max-w-xl text-sm md:text-base leading-[1.8] mb-14 whitespace-pre-line"
          style={{ color: "hsl(var(--mi))" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {cpDescription}
        </motion.p>

        {/* Video + Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* Video */}
          <motion.div
            className="lg:col-span-3 rv"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <motion.div
              className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group"
              onClick={handlePlay}
              style={{
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 30px 80px hsla(0,0%,0%,0.5), 0 0 60px hsl(var(--neon) / 0.04)",
              }}
              whileHover={{
                borderColor: "hsl(73 100% 50% / 0.35)",
                boxShadow: "0 30px 80px hsla(0,0%,0%,0.5), 0 0 80px hsl(73 100% 50% / 0.1), inset 0 0 40px hsl(73 100% 50% / 0.03)",
              }}
              transition={{ duration: 0.5 }}
            >
              {/* Neon border lines */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[2px] z-10"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--neon)), transparent)" }}
                initial={{ scaleX: 0, opacity: 0 }}
                whileHover={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] z-10"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--neon) / 0.5), transparent)" }}
                initial={{ scaleX: 0, opacity: 0 }}
                whileHover={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              />

              {/* Corner glow accents */}
              <div className="absolute top-0 left-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" style={{ background: "radial-gradient(circle at top left, hsl(var(--neon) / 0.12), transparent 70%)" }} />
              <div className="absolute bottom-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" style={{ background: "radial-gradient(circle at bottom right, hsl(var(--neon) / 0.08), transparent 70%)" }} />

              <video
                ref={videoRef}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                poster={cpPoster}
                loop playsInline muted
                preload="metadata"
              >
                {cpVideoUrl && <source src={cpVideoUrl} type="video/mp4" />}
              </video>

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.4) 40%, transparent 100%)",
                  opacity: isPlaying ? 0.2 : 1,
                }}
              />

              {/* Play/Pause button */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-10"
                initial={false}
                animate={{ opacity: isPlaying ? 0 : 1 }}
              >
                <motion.div
                  className="relative w-22 h-22 rounded-full flex items-center justify-center"
                  style={{
                    background: "hsl(var(--neon) / 0.08)",
                    border: "2px solid hsl(var(--neon) / 0.35)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 0 40px hsl(var(--neon) / 0.15), 0 0 80px hsl(var(--neon) / 0.05)",
                    width: 88,
                    height: 88,
                  }}
                  whileHover={{
                    scale: 1.15,
                    boxShadow: "0 0 60px hsl(73 100% 50% / 0.3), 0 0 120px hsl(73 100% 50% / 0.1)",
                    borderColor: "hsl(73 100% 50% / 0.6)",
                  }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {/* Pulsing ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: "1px solid hsl(var(--neon) / 0.2)" }}
                    animate={{ scale: [1, 1.4, 1.4], opacity: [0.5, 0, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  />
                  {isPlaying ? (
                    <Pause size={30} className="text-primary" />
                  ) : (
                    <Play size={30} className="text-primary ml-1" fill="hsl(73 100% 50%)" />
                  )}
                </motion.div>
              </motion.div>

              {/* Bottom label */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between z-10">
                <div>
                  <p className="font-clash text-base font-bold text-foreground group-hover:text-primary transition-colors duration-500">Must Agence × Portugal</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-primary/70 group-hover:text-primary transition-colors duration-500">Clip & Production</p>
                </div>
                <motion.div
                  className="px-3 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "hsl(var(--neon) / 0.1)",
                    border: "1px solid hsl(var(--neon) / 0.25)",
                    color: "hsl(var(--neon))",
                  }}
                >
                  ▶ Regarder
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Info cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {features.map((item, idx) => (
              <motion.div
                key={item.title}
                className="rv group/card relative p-5 rounded-xl flex gap-4 items-start overflow-hidden cursor-default"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{
                  borderColor: "hsl(73 100% 50% / 0.3)",
                  boxShadow: "0 0 35px hsl(73 100% 50% / 0.08), inset 0 0 30px hsl(73 100% 50% / 0.03)",
                  y: -3,
                }}
                transition={{ delay: idx * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                {/* Neon top line — always visible, subtle */}
                <div
                  className="absolute top-0 left-0 right-0 h-[1px] opacity-30 group-hover/card:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(90deg, transparent 5%, hsl(var(--neon) / 0.6) 50%, transparent 95%)" }}
                />
                {/* Neon left accent line */}
                <div
                  className="absolute top-2 bottom-2 left-0 w-[2px] rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-500"
                  style={{ background: "linear-gradient(180deg, transparent, hsl(var(--neon) / 0.5), transparent)" }}
                />
                {/* Shimmer sweep on hover */}
                <div
                  className="absolute inset-0 -translate-x-full group-hover/card:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(var(--neon) / 0.04), transparent)" }}
                />
                {/* Glow orb behind icon on hover */}
                <div
                  className="absolute top-3 left-3 w-14 h-14 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"
                  style={{ background: "hsl(var(--neon) / 0.15)" }}
                />
                <motion.div
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500"
                  style={{
                    background: "hsl(var(--neon) / 0.06)",
                    border: "1px solid hsl(var(--neon) / 0.15)",
                    boxShadow: "0 0 8px hsl(var(--neon) / 0.05)",
                  }}
                  whileHover={{
                    scale: 1.12,
                    rotate: 6,
                    boxShadow: "0 0 25px hsl(73 100% 50% / 0.25)",
                    borderColor: "hsl(73 100% 50% / 0.5)",
                    background: "hsl(73 100% 50% / 0.12)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {item.icon}
                </motion.div>
                <div>
                  <h4 className="font-clash text-sm font-bold text-foreground mb-1 group-hover/card:text-primary transition-colors duration-300">{item.title}</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* CTA */}
            <motion.button
              onClick={() => setShowForm(true)}
              className="rv mt-2 group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-clash text-sm font-bold uppercase tracking-wider cursor-pointer"
              style={{
                background: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 30px hsl(var(--neon) / 0.25)",
              }}
              whileHover={{ y: -3, boxShadow: "0 0 50px hsl(73 100% 50% / 0.45)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.3 }}
            >
              {cpCta}
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0"
                style={{ background: "hsl(var(--background) / 0.85)", backdropFilter: "blur(12px)" }}
                onClick={resetForm}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* Modal */}
              <motion.div
                className="relative w-full max-w-lg rounded-2xl overflow-hidden"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0 40px 100px hsla(0,0%,0%,0.6), 0 0 80px hsl(var(--neon) / 0.08)",
                }}
                initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Neon top accent */}
                <motion.div
                  className="h-[2px] w-full"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(var(--neon)), transparent)" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />

                {/* Close button */}
                <button
                  onClick={resetForm}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
                  style={{ background: "hsl(var(--sf))", border: "1px solid hsl(var(--border))" }}
                >
                  <X size={16} className="text-muted-foreground" />
                </button>

                <div className="p-8">
                  <AnimatePresence mode="wait">
                    {!submitted ? (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        {/* Header */}
                        <div className="mb-8">
                          <motion.div
                            className="flex items-center gap-2 mb-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15, duration: 0.5 }}
                          >
                            <motion.div
                              className="w-6 h-[2px] rounded-full"
                              style={{ background: "hsl(var(--neon))" }}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: 0.3, duration: 0.6 }}
                            />
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Clip au Portugal</span>
                          </motion.div>
                          <motion.h3
                            className="font-clash text-2xl font-bold text-foreground mb-2"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                          >
                            Commencez l'aventure
                          </motion.h3>
                          <motion.p
                            className="text-muted-foreground text-sm"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.5 }}
                          >
                            Remplissez ce formulaire et notre équipe vous recontactera sous 48h.
                          </motion.p>
                        </div>

                        {/* Form fields */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                              <label className={labelClass} style={{ color: "hsl(var(--foreground) / 0.7)" }}>Prénom *</label>
                              <input
                                className={inputClass}
                                style={inputStyle}
                                placeholder="Votre prénom"
                                value={form.prenom}
                                onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
                              />
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                              <label className={labelClass} style={{ color: "hsl(var(--foreground) / 0.7)" }}>Nom *</label>
                              <input
                                className={inputClass}
                                style={inputStyle}
                                placeholder="Votre nom"
                                value={form.nom}
                                onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                              />
                            </motion.div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                              <label className={labelClass} style={{ color: "hsl(var(--foreground) / 0.7)" }}>Email *</label>
                              <input
                                type="email"
                                className={inputClass}
                                style={inputStyle}
                                placeholder="email@exemple.com"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                              />
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                              <label className={labelClass} style={{ color: "hsl(var(--foreground) / 0.7)" }}>Téléphone *</label>
                              <input
                                type="tel"
                                className={inputClass}
                                style={inputStyle}
                                placeholder="+33 6 12 34 56 78"
                                value={form.telephone}
                                onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
                              />
                            </motion.div>
                          </div>

                          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
                            <label className={labelClass} style={{ color: "hsl(var(--foreground) / 0.7)" }}>Âge</label>
                            <input
                              className={inputClass}
                              style={inputStyle}
                              placeholder="Votre âge"
                              value={form.age}
                              onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                            />
                          </motion.div>

                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <label className={labelClass} style={{ color: "hsl(var(--foreground) / 0.7)" }}>Budget estimé</label>
                            <select
                              className={inputClass}
                              style={{ ...inputStyle, appearance: "none" as const, colorScheme: "dark" }}
                              value={form.budget}
                              onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                            >
                              <option value="">Sélectionnez un budget</option>
                              <option value="3000-5000">3 000 € – 5 000 €</option>
                              <option value="5000-10000">5 000 € – 10 000 €</option>
                              <option value="10000-20000">10 000 € – 20 000 €</option>
                              <option value="20000+">20 000 € +</option>
                            </select>
                          </motion.div>

                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                            <label className={labelClass} style={{ color: "hsl(var(--foreground) / 0.7)" }}>Vos idées / vision du clip</label>
                            <textarea
                              className={`${inputClass} resize-none`}
                              style={inputStyle}
                              rows={3}
                              placeholder="Décrivez votre projet, ambiance souhaitée, références..."
                              value={form.idees}
                              onChange={e => setForm(f => ({ ...f, idees: e.target.value }))}
                            />
                          </motion.div>
                        </div>

                        {/* Submit */}
                        <motion.button
                          onClick={handleSubmit}
                          disabled={!form.nom || !form.prenom || !form.email || !form.telephone || loading}
                          className="w-full mt-6 group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-clash text-sm font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            background: "hsl(var(--primary))",
                            color: "hsl(var(--primary-foreground))",
                            boxShadow: "0 0 30px hsl(var(--neon) / 0.2)",
                          }}
                          whileHover={form.nom && form.prenom && form.email && form.telephone ? { y: -2, boxShadow: "0 0 50px hsl(73 100% 50% / 0.4)" } : {}}
                          whileTap={form.nom && form.prenom && form.email && form.telephone ? { scale: 0.97 } : {}}
                        >
                          {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <>
                              Envoyer ma demande
                              <Send size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="success"
                        className="text-center py-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <motion.div
                          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                          style={{ background: "hsl(var(--neon) / 0.1)", border: "2px solid hsl(var(--neon) / 0.3)" }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        >
                          <CheckCircle size={36} className="text-primary" />
                        </motion.div>
                        <h3 className="font-clash text-2xl font-bold text-foreground mb-3">Demande envoyée !</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto mb-2">
                          Merci pour votre intérêt. Notre équipe va évaluer votre demande et reviendra vers vous sous <strong className="text-foreground">48 heures</strong>.
                        </p>
                        <p className="text-muted-foreground/60 text-xs mb-8">Préparez-vous à vivre une expérience unique.</p>
                        <motion.button
                          onClick={resetForm}
                          className="px-6 py-3 rounded-full font-clash text-sm font-semibold transition-all duration-300"
                          style={{ background: "hsl(var(--sf))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                          whileHover={{ borderColor: "hsl(73 100% 50% / 0.3)" }}
                        >
                          Fermer
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

export default ClipPortugal;