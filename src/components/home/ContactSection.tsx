import { useState, useRef, useEffect, forwardRef } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MessageSquare, Phone, MapPin, Send, ChevronDown, ArrowRight, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useContactSectors, useContactFormTypes } from "@/hooks/useSiteContent";

interface ContactSectionProps {
  heading: string;
  text: string;
  subtext: string;
  email: string;
  phone?: string;
  location?: string;
  whatsappUrl: string;
  /** Optional fallback. When omitted, types are loaded from DB based on the current page. */
  formOptions?: string[];
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const ContactSection = forwardRef<HTMLDivElement, ContactSectionProps>(({ heading, text, subtext, email, phone, location, whatsappUrl, formOptions }, _ref) => {
  const ref = useScrollReveal();
  const loc = useLocation();
  const isEntreprise = loc.pathname === "/entreprise";

  const accent = isEntreprise ? "43 55% 55%" : "var(--neon)";
  const accentDark = isEntreprise ? "43 52% 39%" : "var(--neon)";

  // Types de demande chargés depuis la BDD selon la page (table contact_form_types)
  const { data: typeRows = [] } = useContactFormTypes(isEntreprise ? "entreprise" : "artiste");
  const dbFormOptions = (typeRows as any[]).map((t) => t.label);
  const effectiveFormOptions = dbFormOptions.length > 0 ? dbFormOptions : (formOptions || []);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ type: "", nom: "", prenom: "", entreprise: "", secteur: "", email: "", phone: "", budget: 5000, message: "" });
  const [sending, setSending] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);
  const [secteurOpen, setSecteurOpen] = useState(false);

  // Initialise le type quand les options DB arrivent
  useEffect(() => {
    if (!form.type && effectiveFormOptions.length > 0) {
      setForm((f) => ({ ...f, type: effectiveFormOptions[0] }));
    }
  }, [effectiveFormOptions, form.type]);

  // Listen for global event from CTA buttons
  useEffect(() => {
    const handler = () => setModalOpen(true);
    window.addEventListener("open-contact-modal", handler);
    return () => window.removeEventListener("open-contact-modal", handler);
  }, []);

  const budgetMin = 1000;
  const budgetMax = 25000;
  const budgetStep = 500;

  // Secteurs chargés depuis la BDD (table contact_sectors), éditable depuis l'admin
  const { data: sectorRows = [] } = useContactSectors();
  const secteurOptions = (sectorRows as any[]).map((s) => s.name);

  const formatBudget = (v: number) => v >= budgetMax ? `${(v / 1000).toFixed(0)}k€ +` : `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k€`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.email.trim() || !form.message.trim()) return;
    setSending(true);
    const { error } = await supabase.from("contact_submissions").insert({
      type: form.type,
      name: `${form.prenom.trim()} ${form.nom.trim()}`.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      service: form.secteur || form.entreprise || "",
      message: `Entreprise : ${form.entreprise || "—"}\nSecteur : ${form.secteur || "—"}\nBudget estimé : ${formatBudget(form.budget)}\n\nMessage :\n${form.message.trim()}`,
    });
    setSending(false);
    if (error) {
      toast.error("Erreur lors de l'envoi. Réessayez.");
    } else {
      toast.success("Message envoyé ! On revient vers vous en 24h.");
      setForm({ type: effectiveFormOptions[0] || "", nom: "", prenom: "", entreprise: "", secteur: "", email: "", phone: "", budget: 5000, message: "" });
      setModalOpen(false);
    }
  };

  const inputBase = `w-full rounded-xl px-4 py-3 text-[13px] font-outfit outline-none transition-all duration-400 ${isEntreprise ? "placeholder:text-black/40" : "placeholder:text-white/25"}`;
  const getInputStyle = (field: string) => ({
    background: isEntreprise
      ? focusField === field ? "hsl(40 20% 96%)" : "hsl(40 15% 97%)"
      : focusField === field ? "hsl(0 0% 100% / 0.07)" : "hsl(0 0% 100% / 0.04)",
    border: focusField === field
      ? `1.5px solid hsl(${accent} / 0.5)`
      : `1px solid ${isEntreprise ? "hsl(0 0% 0% / 0.1)" : "hsl(0 0% 100% / 0.08)"}`,
    color: isEntreprise ? "hsl(0 0% 8%)" : "hsl(0 0% 95%)",
    boxShadow: focusField === field
      ? `0 0 0 3px hsl(${accent} / 0.08)`
      : "none",
  });

  const CustomSelect = ({
    value, options, open, setOpen, onChange, placeholder, field
  }: {
    value: string; options: string[]; open: boolean; setOpen: (v: boolean) => void;
    onChange: (v: string) => void; placeholder: string; field: string;
  }) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`${inputBase} text-left flex items-center justify-between cursor-pointer !py-3`}
        style={getInputStyle(field)}
        onFocus={() => setFocusField(field)}
        onBlur={() => { setFocusField(null); setTimeout(() => setOpen(false), 200); }}
      >
        <span style={{ color: value ? (isEntreprise ? "hsl(0 0% 5%)" : "hsl(var(--foreground))") : (isEntreprise ? "hsl(0 0% 0% / 0.5)" : "hsl(var(--foreground) / 0.2)") }}>
          {value || placeholder}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease: EASE }}>
          <ChevronDown size={18} style={{ color: "hsl(var(--foreground) / 0.35)" }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50"
            style={{
              background: "hsl(var(--card))",
              border: "1.5px solid hsl(var(--foreground) / 0.1)",
              boxShadow: `0 25px 70px hsla(0,0%,0%,0.6), 0 0 40px hsl(${accent} / 0.04)`,
              backdropFilter: "blur(24px)",
            }}
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {options.map((opt, idx) => (
              <motion.button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full text-left px-5 py-3.5 text-sm font-outfit transition-all duration-200 flex items-center gap-3"
                style={{
                  color: value === opt ? `hsl(${accent})` : "hsl(var(--foreground) / 0.65)",
                  background: value === opt ? `hsl(${accent} / 0.07)` : "transparent",
                  borderBottom: idx < options.length - 1 ? "1px solid hsl(var(--foreground) / 0.05)" : "none",
                }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ background: value === opt ? `hsl(${accent} / 0.1)` : "hsl(var(--foreground) / 0.05)", x: 4 }}
              >
                {value === opt && (
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: `hsl(${accent})` }}
                    layoutId={`select-${field}`}
                  />
                )}
                {opt}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const contactItems = [
    { icon: <Send size={16} />, label: email, href: `mailto:${email}`, show: true },
    { icon: <Phone size={16} />, label: phone, href: `tel:${phone}`, show: !!phone },
    { icon: <MapPin size={16} />, label: location, href: undefined, show: !!location },
  ].filter(i => i.show);

   return (
    <>
      <section id="contact" ref={ref} className="py-28 md:py-40 px-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[700px] h-[700px] rounded-full" style={{ background: `radial-gradient(ellipse, hsl(${accent} / 0.04) 0%, transparent 65%)` }} />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full" style={{ background: `radial-gradient(ellipse, hsl(${accent} / 0.03) 0%, transparent 65%)` }} />
          {/* Floating orbs */}
          <motion.div
            className="absolute top-[20%] right-[15%] w-3 h-3 rounded-full"
            style={{ background: `hsl(${accent} / 0.3)` }}
            animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[30%] left-[10%] w-2 h-2 rounded-full"
            style={{ background: `hsl(${accent} / 0.25)` }}
            animate={{ y: [0, -10, 0], x: [0, 5, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute top-[60%] right-[25%] w-1.5 h-1.5 rounded-full"
            style={{ background: `hsl(${accent} / 0.2)` }}
            animate={{ y: [0, -12, 0], opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        <div className="max-w-[900px] mx-auto relative text-center">
          {/* Section label */}
          <motion.div
            className="rv flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            viewport={{ once: true }}
          >
            <motion.div
              className="w-10 h-[2px] rounded-full"
              style={{ background: `linear-gradient(to right, transparent, hsl(${accent}))` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              viewport={{ once: true }}
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] font-medium" style={{ color: `hsl(${accent})` }}>
              Contact
            </span>
            <motion.div
              className="w-10 h-[2px] rounded-full"
              style={{ background: `linear-gradient(to left, transparent, hsl(${accent}))` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              viewport={{ once: true }}
            />
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="rv font-clash text-4xl md:text-5xl lg:text-[3.5rem] font-black text-foreground tracking-tight leading-[1.05] mb-5"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            viewport={{ once: true }}
          >
            {heading}
          </motion.h2>

          <motion.p
            className="rv text-lg md:text-xl font-clash font-semibold mb-3"
            style={{ color: "hsl(var(--foreground) / 0.85)" }}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            viewport={{ once: true }}
          >
            {text}
          </motion.p>

          <motion.p
            className="rv text-sm leading-[1.9] max-w-lg mx-auto mb-14"
            style={{ color: "hsl(var(--foreground) / 0.45)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
          >
            {subtext}
          </motion.p>

          {/* Decorative separator */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-14"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-[1px]" style={{ background: `linear-gradient(to right, transparent, hsl(${accent} / 0.3))` }} />
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: `hsl(${accent} / 0.4)` }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="w-16 h-[1px]" style={{ background: `linear-gradient(to left, transparent, hsl(${accent} / 0.3))` }} />
          </motion.div>

          {/* Contact info row */}
          <motion.div
            className="flex flex-col items-stretch sm:items-center sm:flex-row sm:justify-center gap-4 sm:gap-10 max-w-sm mx-auto sm:max-w-none"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            viewport={{ once: true }}
          >
            {contactItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 + idx * 0.1, ease: EASE }}
                viewport={{ once: true }}
              >
                {item.href ? (
                  <motion.a
                    href={item.href}
                    className="group flex items-center gap-3 transition-all duration-300"
                    whileHover={{ y: -3 }}
                  >
                    <motion.div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: `hsl(${accent} / 0.08)`,
                        border: `1px solid hsl(${accent} / 0.15)`,
                        color: `hsl(${accent})`,
                      }}
                      whileHover={{
                        background: `hsl(${accent} / 0.15)`,
                        boxShadow: `0 0 20px hsl(${accent} / 0.1)`,
                      }}
                    >
                      {item.icon}
                    </motion.div>
                    <span className="text-sm text-foreground/55 group-hover:text-foreground transition-colors duration-300 font-medium">{item.label}</span>
                  </motion.a>
                ) : (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `hsl(${accent} / 0.08)`, border: `1px solid hsl(${accent} / 0.15)`, color: `hsl(${accent})` }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm text-foreground/55 font-medium">{item.label}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ CONTACT MODAL — PREMIUM (Portal to body) ═══ */}
      {createPortal(
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "hsla(0,0%,0%,0.7)", backdropFilter: "blur(12px)" }}
              onClick={() => setModalOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal card */}
            <motion.div
              className="relative w-full max-w-[520px] max-h-[92vh] overflow-y-auto z-10"
              style={{
                borderRadius: "28px",
                background: isEntreprise
                  ? "linear-gradient(180deg, hsl(40 25% 97%) 0%, hsl(40 20% 95%) 100%)"
                  : "linear-gradient(180deg, hsl(0 0% 13%) 0%, hsl(0 0% 10%) 100%)",
                border: `1px solid hsl(${accent} / 0.2)`,
                boxShadow: `0 50px 100px -20px hsla(0,0%,0%,0.6), 0 0 80px hsl(${accent} / 0.08), inset 0 1px 0 ${isEntreprise ? "hsl(0 0% 100% / 0.6)" : "hsl(0 0% 100% / 0.06)"}`,
              }}
              initial={{ opacity: 0, y: 60, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {/* Top gold/neon accent bar */}
              <div
                className="h-[3px] w-full"
                style={{
                  borderRadius: "28px 28px 0 0",
                  background: `linear-gradient(90deg, transparent 5%, hsl(${accent}) 30%, hsl(${accent}) 70%, transparent 95%)`,
                }}
              />

              {/* Close button */}
              <motion.button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer z-20"
                style={{
                  background: isEntreprise ? "hsl(0 0% 0% / 0.05)" : "hsl(0 0% 100% / 0.06)",
                  border: `1px solid ${isEntreprise ? "hsl(0 0% 0% / 0.08)" : "hsl(0 0% 100% / 0.08)"}`,
                  color: isEntreprise ? "hsl(0 0% 0% / 0.35)" : "hsl(0 0% 100% / 0.35)",
                }}
                whileHover={{
                  background: isEntreprise ? "hsl(0 0% 0% / 0.1)" : "hsl(0 0% 100% / 0.12)",
                  color: isEntreprise ? "hsl(0 0% 0% / 0.8)" : "hsl(0 0% 100% / 0.8)",
                  scale: 1.08,
                }}
                whileTap={{ scale: 0.92 }}
              >
                <X size={18} />
              </motion.button>

              <form onSubmit={handleSubmit} className="px-6 py-6 md:px-8 md:py-7 space-y-4">
                {/* Header */}
                <motion.div
                  className="mb-1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4, ease: EASE }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `hsl(${accent} / 0.1)` }}>
                      <Sparkles size={12} style={{ color: `hsl(${accent})` }} />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] font-medium" style={{ color: `hsl(${accent})` }}>
                      Formulaire de contact
                    </span>
                  </div>
                  <h3 className="font-clash font-bold text-lg" style={{ color: isEntreprise ? "hsl(0 0% 15%)" : "hsl(0 0% 95%)" }}>
                    Parlons de votre projet
                  </h3>
                </motion.div>

                {/* Service type chips */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.35, ease: EASE }}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {effectiveFormOptions.map(opt => (
                      <motion.button
                        key={opt}
                        type="button"
                        onClick={() => setForm({ ...form, type: opt })}
                        className="px-3.5 py-2 rounded-full text-[11px] font-mono tracking-wide transition-all duration-300 cursor-pointer"
                        style={{
                          background: form.type === opt ? `hsl(${accent})` : (isEntreprise ? "hsl(40 15% 97%)" : "hsl(0 0% 100% / 0.04)"),
                          color: form.type === opt ? (isEntreprise ? "#fff" : "hsl(0 0% 5%)") : (isEntreprise ? "hsl(0 0% 35%)" : "hsl(0 0% 70%)"),
                          border: `1px solid ${form.type === opt ? `hsl(${accent})` : (isEntreprise ? "hsl(0 0% 0% / 0.1)" : "hsl(0 0% 100% / 0.08)")}`,
                          boxShadow: form.type === opt ? `0 2px 10px hsl(${accent} / 0.2)` : "none",
                        }}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Separator */}
                <div className="h-px w-full" style={{ background: isEntreprise ? "hsl(0 0% 0% / 0.06)" : "hsl(0 0% 100% / 0.06)" }} />

                {/* Identity fields */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.35, ease: EASE }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <motion.input
                      type="text" placeholder="Nom" value={form.nom}
                      onChange={e => setForm({ ...form, nom: e.target.value })}
                      onFocus={() => setFocusField("nom")} onBlur={() => setFocusField(null)}
                      required className={inputBase} style={getInputStyle("nom")}
                    />
                    <motion.input
                      type="text" placeholder="Prénom" value={form.prenom}
                      onChange={e => setForm({ ...form, prenom: e.target.value })}
                      onFocus={() => setFocusField("prenom")} onBlur={() => setFocusField(null)}
                      className={inputBase} style={getInputStyle("prenom")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.input
                      type="text" placeholder="Entreprise" value={form.entreprise}
                      onChange={e => setForm({ ...form, entreprise: e.target.value })}
                      onFocus={() => setFocusField("entreprise")} onBlur={() => setFocusField(null)}
                      className={inputBase} style={getInputStyle("entreprise")}
                    />
                    <CustomSelect
                      value={form.secteur} options={secteurOptions} open={secteurOpen} setOpen={setSecteurOpen}
                      onChange={v => setForm({ ...form, secteur: v })} placeholder="Secteur" field="secteur"
                    />
                  </div>
                </motion.div>

                {/* Contact fields */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.35, ease: EASE }}
                >
                  <motion.input
                    type="email" placeholder="Email" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocusField("email")} onBlur={() => setFocusField(null)}
                    required className={inputBase} style={getInputStyle("email")}
                  />
                  <motion.input
                    type="tel" placeholder="Téléphone" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    onFocus={() => setFocusField("phone")} onBlur={() => setFocusField(null)}
                    className={inputBase} style={getInputStyle("phone")}
                  />
                </motion.div>

                {/* Budget slider */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.34, duration: 0.35, ease: EASE }}
                >
                  <div className="rounded-xl px-4 py-3" style={{
                    background: isEntreprise ? "hsl(40 15% 97%)" : "hsl(0 0% 100% / 0.03)",
                    border: `1px solid ${isEntreprise ? "hsl(0 0% 0% / 0.06)" : "hsl(0 0% 100% / 0.06)"}`,
                  }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono tracking-wide" style={{ color: isEntreprise ? "hsl(0 0% 35%)" : "hsl(0 0% 65%)" }}>Budget estimé</span>
                      <span className="text-[14px] font-clash font-bold" style={{ color: `hsl(${accent})` }}>{formatBudget(form.budget)}</span>
                    </div>
                    <input
                      type="range"
                      min={budgetMin} max={budgetMax} step={budgetStep}
                      value={form.budget}
                      onChange={e => setForm({ ...form, budget: Number(e.target.value) })}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, hsl(${accent}) 0%, hsl(${accent}) ${((form.budget - budgetMin) / (budgetMax - budgetMin)) * 100}%, ${isEntreprise ? "hsl(38 14% 90%)" : "hsl(0 0% 100% / 0.08)"} ${((form.budget - budgetMin) / (budgetMax - budgetMin)) * 100}%, ${isEntreprise ? "hsl(38 14% 90%)" : "hsl(0 0% 100% / 0.08)"} 100%)`,
                        accentColor: `hsl(${accent})`,
                      }}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] font-mono" style={{ color: isEntreprise ? "hsl(0 0% 55%)" : "hsl(0 0% 50%)" }}>1k€</span>
                      <span className="text-[9px] font-mono" style={{ color: isEntreprise ? "hsl(0 0% 55%)" : "hsl(0 0% 50%)" }}>25k€+</span>
                    </div>
                  </div>
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.37, duration: 0.35, ease: EASE }}
                >
                  <motion.textarea
                    placeholder="Décrivez votre projet, vos ambitions..." rows={3} value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    onFocus={() => setFocusField("message")} onBlur={() => setFocusField(null)}
                    required className={`${inputBase} resize-none`} style={getInputStyle("message")}
                  />
                </motion.div>

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.35, ease: EASE }}
                >
                  <motion.button
                    type="submit" disabled={sending}
                    className="w-full py-3.5 font-mono text-[11px] uppercase tracking-[0.15em] font-bold disabled:opacity-50 group cursor-pointer relative overflow-hidden"
                    style={{
                      background: isEntreprise ? `linear-gradient(135deg, hsl(${accentDark}), hsl(${accent}))` : "hsl(var(--primary))",
                      color: isEntreprise ? "#fff" : "hsl(var(--primary-foreground))",
                      borderRadius: "14px",
                      boxShadow: `0 4px 20px hsl(${accent} / 0.2), 0 0 0 1px hsl(${accent} / 0.12)`,
                      border: "none",
                    }}
                    whileHover={{ y: -2, boxShadow: `0 8px 30px hsl(${accent} / 0.3), 0 0 40px hsl(${accent} / 0.08)` }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    {/* Shimmer */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(105deg, transparent 40%, hsla(0,0%,100%,0.15) 50%, transparent 60%)" }}
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
                    />
                    <span className="flex items-center justify-center gap-2.5 relative z-10">
                      {sending ? (
                        <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
                          Envoi en cours...
                        </motion.span>
                      ) : (
                        <>
                          Envoyer ma demande
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </span>
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </>
  );
});

ContactSection.displayName = "ContactSection";

export default ContactSection;
