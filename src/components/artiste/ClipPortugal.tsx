import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ArrowRight, X, Send, CheckCircle, Loader2, Phone } from "lucide-react";
import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/integrations/supabase/client";

const ClipPortugal = () => {
  const sectionRef = useScrollReveal();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nom: "", prenom: "", age: "", budget: "", idees: "", email: "", telephone: "" });
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubmit = async () => {
    if (!form.nom || !form.prenom || !form.email) return;
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

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm font-outfit text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 focus:shadow-[0_0_20px_hsl(var(--neon)/0.12)]";
  const inputStyle = {
    background: "hsl(var(--sf))",
    border: "1px solid hsl(var(--border))",
  };

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
            Exclusivité Must Agence
          </span>
        </motion.div>

        <motion.h2
          className="rv font-clash text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1] mb-3"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          Tournez votre clip
        </motion.h2>
        <motion.h2
          className="rv font-clash text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-8"
          style={{ color: "hsl(var(--neon))" }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          au Portugal
        </motion.h2>
        <motion.p
          className="rv text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Des décors de rêve entre Lisbonne, l'Algarve et Porto. Une production clé en main : réalisation, logistique, hébergement. Concentrez-vous sur votre art, on gère le reste.
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
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                poster="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80"
                loop playsInline muted
              />
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.4) 40%, transparent 100%)",
                  opacity: isPlaying ? 0.2 : 1,
                }}
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={false}
                animate={{ opacity: isPlaying ? 0 : 1 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: "hsl(var(--neon) / 0.1)",
                    border: "2px solid hsl(var(--neon) / 0.4)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 0 40px hsl(var(--neon) / 0.15)",
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {isPlaying ? <Pause size={28} className="text-primary" /> : <Play size={28} className="text-primary ml-1" fill="hsl(73 100% 50%)" />}
                </motion.div>
              </motion.div>
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                <div>
                  <p className="font-clash text-base font-bold text-foreground">Must Agence × Portugal</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-primary">Clip & Production</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {features.map((item, idx) => (
              <motion.div
                key={item.title}
                className="rv p-5 rounded-xl flex gap-4 items-start card-hover"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "hsl(var(--neon) / 0.08)", border: "1px solid hsl(var(--neon) / 0.15)" }}
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.icon}
                </motion.div>
                <div>
                  <h4 className="font-clash text-sm font-bold text-foreground mb-1">{item.title}</h4>
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
              Commencer l'aventure
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
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-[2px] rounded-full" style={{ background: "hsl(var(--neon))" }} />
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Clip au Portugal</span>
                          </div>
                          <h3 className="font-clash text-2xl font-bold text-foreground mb-2">Commencez l'aventure</h3>
                          <p className="text-muted-foreground text-sm">Remplissez ce formulaire et notre équipe vous recontactera sous 48h.</p>
                        </div>

                        {/* Form fields */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Prénom *</label>
                              <input
                                className={inputClass}
                                style={inputStyle}
                                placeholder="Votre prénom"
                                value={form.prenom}
                                onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
                              />
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Nom *</label>
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
                              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Email *</label>
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
                              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Téléphone *</label>
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
                            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Âge</label>
                            <input
                              className={inputClass}
                              style={inputStyle}
                              placeholder="Votre âge"
                              value={form.age}
                              onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                            />
                          </motion.div>

                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Budget estimé</label>
                            <select
                              className={inputClass}
                              style={{ ...inputStyle, appearance: "none" as const }}
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
                            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Vos idées / vision du clip</label>
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
                          disabled={!form.nom || !form.prenom || !form.email || loading}
                          className="w-full mt-6 group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-clash text-sm font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            background: "hsl(var(--primary))",
                            color: "hsl(var(--primary-foreground))",
                            boxShadow: "0 0 30px hsl(var(--neon) / 0.2)",
                          }}
                          whileHover={form.nom && form.prenom && form.email ? { y: -2, boxShadow: "0 0 50px hsl(73 100% 50% / 0.4)" } : {}}
                          whileTap={form.nom && form.prenom && form.email ? { scale: 0.97 } : {}}
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