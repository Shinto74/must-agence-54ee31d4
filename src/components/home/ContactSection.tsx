import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MessageSquare, Phone, MapPin, Send, ChevronDown, ArrowRight, Sparkles } from "lucide-react";
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

const ContactSection = ({ heading, text, subtext, email, phone, location, whatsappUrl, formOptions }: ContactSectionProps) => {
  const ref = useScrollReveal();
  const [form, setForm] = useState({ type: formOptions[0], name: "", email: "", phone: "", budget: "", message: "" });
  const [sending, setSending] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);
  const [selectOpen, setSelectOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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
    }
  };

  const inputBase = "w-full rounded-2xl px-5 py-4 text-sm font-outfit outline-none transition-all duration-500 placeholder:text-foreground/20";
  const getInputStyle = (field: string) => ({
    background: focusField === field ? "hsl(var(--foreground) / 0.07)" : "hsl(var(--foreground) / 0.04)",
    border: focusField === field ? "1.5px solid hsl(var(--neon) / 0.45)" : "1.5px solid hsl(var(--foreground) / 0.08)",
    color: "hsl(var(--foreground))",
    boxShadow: focusField === field ? "0 0 30px hsl(var(--neon) / 0.06), inset 0 1px 0 hsl(var(--neon) / 0.05)" : "inset 0 1px 0 hsl(var(--foreground) / 0.03)",
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
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
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
              boxShadow: "0 25px 70px hsla(0,0%,0%,0.6), 0 0 40px hsl(var(--neon) / 0.04)",
              backdropFilter: "blur(24px)",
            }}
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {options.map((opt, idx) => (
              <motion.button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full text-left px-5 py-3.5 text-sm font-outfit transition-all duration-200 flex items-center gap-3"
                style={{
                  color: value === opt ? "hsl(var(--neon))" : "hsl(var(--foreground) / 0.65)",
                  background: value === opt ? "hsl(var(--neon) / 0.07)" : "transparent",
                  borderBottom: idx < options.length - 1 ? "1px solid hsl(var(--foreground) / 0.05)" : "none",
                }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ background: value === opt ? "hsl(var(--neon) / 0.1)" : "hsl(var(--foreground) / 0.05)", x: 4 }}
              >
                {value === opt && (
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "hsl(var(--neon))" }}
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
    <section id="contact" ref={ref} className="py-28 md:py-40 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[700px] h-[700px] rounded-full" style={{ background: "radial-gradient(ellipse, hsl(var(--neon) / 0.03) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(ellipse, hsl(var(--neon) / 0.02) 0%, transparent 65%)" }} />
      </div>

      <div className="max-w-[1400px] mx-auto relative">
        {/* Top row: heading + form side by side */}
        <div className="grid md:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <div className="flex flex-col h-full">
            {/* Header area */}
            <div className="mb-auto">
              <motion.div
                className="rv flex items-center gap-3 mb-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="w-10 h-[2px] rounded-full"
                  style={{ background: "hsl(var(--neon))" }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                />
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] font-medium" style={{ color: "hsl(var(--neon))" }}>
                  Contact
                </span>
              </motion.div>

              <motion.h2
                className="rv font-clash text-4xl md:text-5xl lg:text-[3.5rem] font-black text-foreground tracking-tight leading-[1.05] mb-5"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                {heading}
              </motion.h2>

              <motion.p
                className="rv text-lg md:text-xl font-clash font-semibold mb-3"
                style={{ color: "hsl(var(--foreground) / 0.85)" }}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                {text}
              </motion.p>

              <motion.p
                className="rv text-sm leading-[1.9] max-w-md mb-12"
                style={{ color: "hsl(var(--foreground) / 0.45)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                viewport={{ once: true }}
              >
                {subtext}
              </motion.p>
            </div>

            {/* Contact info cards */}
            <div className="space-y-2 mb-8">
              {contactItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                >
                  {item.href ? (
                    <motion.a
                      href={item.href}
                      className="group flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-400"
                      style={{ background: "transparent" }}
                      whileHover={{ x: 6, background: "hsl(var(--foreground) / 0.04)" }}
                    >
                      <motion.div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: "hsl(var(--neon) / 0.07)",
                          border: "1px solid hsl(var(--neon) / 0.12)",
                          color: "hsl(var(--neon))",
                        }}
                        whileHover={{ scale: 1.1, borderColor: "hsl(var(--neon) / 0.35)", boxShadow: "0 0 20px hsl(var(--neon) / 0.15)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        {item.icon}
                      </motion.div>
                      <span className="text-sm text-foreground/55 group-hover:text-foreground transition-colors duration-300">{item.label}</span>
                    </motion.a>
                  ) : (
                    <div className="flex items-center gap-4 p-3.5">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "hsl(var(--neon) / 0.07)", border: "1px solid hsl(var(--neon) / 0.12)", color: "hsl(var(--neon))" }}>
                        {item.icon}
                      </div>
                      <span className="text-sm text-foreground/55">{item.label}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* WhatsApp */}
            <motion.a
              href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="rv inline-flex items-center gap-2.5 px-7 py-4 rounded-full font-mono text-sm uppercase tracking-wider font-bold w-fit"
              style={{ background: "#25D366", color: "#fff", boxShadow: "0 0 30px rgba(37,211,102,0.2)" }}
              whileHover={{ y: -3, boxShadow: "0 8px 40px rgba(37,211,102,0.35)", scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <MessageSquare size={16} /> WhatsApp
            </motion.a>
          </div>

          {/* Right — Form */}
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            className="rv relative rounded-3xl p-1"
            initial={{ opacity: 0, y: 50, rotateX: 4 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            {/* Glassmorphic form card */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: "hsl(var(--foreground) / 0.03)",
                border: "1px solid hsl(var(--foreground) / 0.07)",
                boxShadow: "0 30px 80px hsla(0,0%,0%,0.3), inset 0 1px 0 hsl(var(--foreground) / 0.06)",
              }}
            >
              {/* Neon top accent */}
              <motion.div
                className="h-[2px] w-full"
                style={{ background: "linear-gradient(90deg, transparent 10%, hsl(var(--neon) / 0.6) 50%, transparent 90%)" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
              />

              <div className="p-6 md:p-8 space-y-4">
                {/* Form header */}
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} style={{ color: "hsl(var(--neon) / 0.6)" }} />
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
                    background: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                    borderRadius: "16px",
                    boxShadow: "0 0 30px hsl(var(--neon) / 0.2)",
                    border: "none",
                  }}
                  whileHover={{ y: -2, boxShadow: "0 0 50px hsl(var(--neon) / 0.35), 0 10px 30px hsla(0,0%,0%,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
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
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
