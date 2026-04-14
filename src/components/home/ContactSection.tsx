import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MessageSquare, Phone, MapPin, Send, ChevronDown, ArrowRight, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ContactSectionProps {
  heading: string;
  text: string;
  subtext: string;
  email: string;
  phone?: string;
  location?: string;
  whatsappUrl: string;
  formOptions: string[];
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const ContactSection = ({ heading, text, subtext, email, phone, location, whatsappUrl, formOptions }: ContactSectionProps) => {
  const ref = useScrollReveal();
  const loc = useLocation();
  const isEntreprise = loc.pathname === "/entreprise";

  const accent = isEntreprise ? "43 55% 55%" : "var(--neon)";
  const accentDark = isEntreprise ? "43 52% 39%" : "var(--neon)";

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ type: formOptions[0], name: "", email: "", phone: "", budget: "", message: "" });
  const [sending, setSending] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);
  const [selectOpen, setSelectOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);

  const budgetOptions = ["1 000 € – 3 000 €", "3 000 € – 5 000 €", "5 000 € – 10 000 €", "10 000 € – 20 000 €", "20 000 € +"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSending(true);
    const { error } = await supabase.from("contact_submissions").insert({
      type: form.type, name: form.name.trim(),
      email: form.email.trim(),
      message: `Téléphone: ${form.phone}\nBudget: ${form.budget}\n\n${form.message.trim()}`,
    });
    setSending(false);
    if (error) {
      toast.error("Erreur lors de l'envoi. Réessayez.");
    } else {
      toast.success("Message envoyé ! On revient vers vous en 24h.");
      setForm({ type: formOptions[0], name: "", email: "", phone: "", budget: "", message: "" });
      setModalOpen(false);
    }
  };

  const inputBase = "w-full rounded-2xl px-5 py-4 text-sm font-outfit outline-none transition-all duration-500 placeholder:text-foreground/20";
  const getInputStyle = (field: string) => ({
    background: focusField === field ? "hsl(var(--foreground) / 0.07)" : "hsl(var(--foreground) / 0.04)",
    border: focusField === field ? `1.5px solid hsl(${accent} / 0.45)` : "1.5px solid hsl(var(--foreground) / 0.08)",
    color: "hsl(var(--foreground))",
    boxShadow: focusField === field ? `0 0 30px hsl(${accent} / 0.06), inset 0 1px 0 hsl(${accent} / 0.05)` : "inset 0 1px 0 hsl(var(--foreground) / 0.03)",
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
        className={`${inputBase} text-left flex items-center justify-between cursor-pointer`}
        style={getInputStyle(field)}
        onFocus={() => setFocusField(field)}
        onBlur={() => { setFocusField(null); setTimeout(() => setOpen(false), 200); }}
      >
        <span style={{ color: value ? "hsl(var(--foreground))" : "hsl(var(--foreground) / 0.2)" }}>
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
          <div className="absolute top-0 left-1/3 w-[700px] h-[700px] rounded-full" style={{ background: `radial-gradient(ellipse, hsl(${accent} / 0.03) 0%, transparent 65%)` }} />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full" style={{ background: `radial-gradient(ellipse, hsl(${accent} / 0.02) 0%, transparent 65%)` }} />
        </div>

        <div className="max-w-[900px] mx-auto relative text-center">
          <motion.div
            className="rv flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            viewport={{ once: true }}
          >
            <div className="w-10 h-[2px] rounded-full" style={{ background: `linear-gradient(to right, transparent, hsl(${accent}))` }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] font-medium" style={{ color: `hsl(${accent})` }}>
              Contact
            </span>
            <div className="w-10 h-[2px] rounded-full" style={{ background: `linear-gradient(to left, transparent, hsl(${accent}))` }} />
          </motion.div>

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
            className="rv text-sm leading-[1.9] max-w-lg mx-auto mb-12"
            style={{ color: "hsl(var(--foreground) / 0.45)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
          >
            {subtext}
          </motion.p>

          {/* CTA Button — opens modal */}
          <motion.button
            onClick={() => setModalOpen(true)}
            className="group inline-flex items-center gap-3 px-12 py-5 rounded-full font-mono text-sm uppercase tracking-wider font-bold cursor-pointer relative overflow-hidden mb-14"
            style={{
              background: isEntreprise
                ? `linear-gradient(135deg, hsl(${accentDark}), hsl(${accent}))`
                : "hsl(var(--primary))",
              color: isEntreprise ? "#fff" : "hsl(var(--primary-foreground))",
              boxShadow: `0 0 40px hsl(${accent} / 0.2), 0 8px 30px hsla(0,0%,0%,0.2)`,
            }}
            whileHover={{ y: -3, boxShadow: `0 0 60px hsl(${accent} / 0.35), 0 12px 40px hsla(0,0%,0%,0.3)`, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            viewport={{ once: true }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 40%, hsla(0,0%,100%,0.15) 50%, transparent 60%)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            <span className="relative z-10 flex items-center gap-3">
              Contactez-nous
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </span>
          </motion.button>

          {/* Contact info row */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            viewport={{ once: true }}
          >
            {contactItems.map((item, idx) => (
              <div key={idx}>
                {item.href ? (
                  <motion.a
                    href={item.href}
                    className="group flex items-center gap-3 transition-all duration-300"
                    whileHover={{ y: -2 }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: `hsl(${accent} / 0.07)`,
                        border: `1px solid hsl(${accent} / 0.12)`,
                        color: `hsl(${accent})`,
                      }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm text-foreground/55 group-hover:text-foreground transition-colors duration-300">{item.label}</span>
                  </motion.a>
                ) : (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `hsl(${accent} / 0.07)`, border: `1px solid hsl(${accent} / 0.12)`, color: `hsl(${accent})` }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm text-foreground/55">{item.label}</span>
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          {/* WhatsApp */}
          <motion.a
            href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full font-mono text-sm uppercase tracking-wider font-bold"
            style={{ background: "#25D366", color: "#fff", boxShadow: "0 0 30px rgba(37,211,102,0.2)" }}
            whileHover={{ y: -3, boxShadow: "0 8px 40px rgba(37,211,102,0.35)", scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
            viewport={{ once: true }}
          >
            <MessageSquare size={16} /> WhatsApp
          </motion.a>
        </div>
      </section>

      {/* ═══ CONTACT MODAL ═══ */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "hsla(0,0%,0%,0.65)", backdropFilter: "blur(8px)" }}
              onClick={() => setModalOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl z-10"
              style={{
                background: isEntreprise ? "hsl(40 20% 97%)" : "hsl(var(--card))",
                border: `1px solid hsl(${accent} / 0.15)`,
                boxShadow: `0 40px 100px hsla(0,0%,0%,0.5), 0 0 60px hsl(${accent} / 0.1)`,
              }}
              initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {/* Top accent line */}
              <div
                className="h-[2px] w-full rounded-t-3xl"
                style={{ background: `linear-gradient(90deg, transparent 10%, hsl(${accent} / 0.6) 50%, transparent 90%)` }}
              />

              {/* Close button */}
              <motion.button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer z-20"
                style={{
                  background: "hsl(var(--foreground) / 0.05)",
                  border: "1px solid hsl(var(--foreground) / 0.08)",
                  color: "hsl(var(--foreground) / 0.4)",
                }}
                whileHover={{ background: "hsl(var(--foreground) / 0.1)", color: "hsl(var(--foreground) / 0.8)", scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={18} />
              </motion.button>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} style={{ color: `hsl(${accent} / 0.6)` }} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "hsl(var(--foreground) / 0.35)" }}>
                    Formulaire de contact
                  </span>
                </div>

                {/* Type select */}
                <CustomSelect
                  value={form.type} options={formOptions} open={selectOpen} setOpen={setSelectOpen}
                  onChange={v => setForm({ ...form, type: v })} placeholder="Type de projet" field="type"
                />

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.input
                    type="text" placeholder="Votre nom" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setFocusField("name")} onBlur={() => setFocusField(null)}
                    required className={inputBase} style={getInputStyle("name")}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.input
                    type="email" placeholder="Votre email" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocusField("email")} onBlur={() => setFocusField(null)}
                    required className={inputBase} style={getInputStyle("email")}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>

                {/* Phone */}
                <motion.input
                  type="tel" placeholder="Votre téléphone" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  onFocus={() => setFocusField("phone")} onBlur={() => setFocusField(null)}
                  className={inputBase} style={getInputStyle("phone")}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Budget */}
                <CustomSelect
                  value={form.budget} options={budgetOptions} open={budgetOpen} setOpen={setBudgetOpen}
                  onChange={v => setForm({ ...form, budget: v })} placeholder="Sélectionnez un budget" field="budget"
                />

                {/* Message */}
                <motion.textarea
                  placeholder="Décrivez votre projet, vos ambitions..." rows={4} value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocusField("message")} onBlur={() => setFocusField(null)}
                  required className={`${inputBase} resize-none`} style={getInputStyle("message")}
                  whileFocus={{ scale: 1.005 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Submit */}
                <motion.button
                  type="submit" disabled={sending}
                  className="w-full mt-2 py-5 font-mono text-sm uppercase tracking-[0.15em] font-bold disabled:opacity-50 group cursor-pointer relative overflow-hidden"
                  style={{
                    background: isEntreprise ? `linear-gradient(135deg, hsl(${accentDark}), hsl(${accent}))` : "hsl(var(--primary))",
                    color: isEntreprise ? "#fff" : "hsl(var(--primary-foreground))",
                    borderRadius: "16px",
                    boxShadow: `0 0 30px hsl(${accent} / 0.2)`,
                    border: "none",
                  }}
                  whileHover={{ y: -2, boxShadow: `0 0 50px hsl(${accent} / 0.35), 0 10px 30px hsla(0,0%,0%,0.3)` }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 40%, hsla(0,0%,100%,0.12) 50%, transparent 60%)" }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
                  />
                  <span className="flex items-center justify-center gap-3 relative z-10">
                    {sending ? (
                      <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
                        Envoi en cours...
                      </motion.span>
                    ) : (
                      <>
                        Envoyer ma demande
                        <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ContactSection;
