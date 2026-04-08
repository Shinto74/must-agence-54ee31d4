import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MessageSquare, Phone, MapPin, Send, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
  const [form, setForm] = useState({ type: formOptions[0], name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);
  const [selectOpen, setSelectOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSending(true);
    const { error } = await supabase.from("contact_submissions").insert({
      type: form.type, name: form.name.trim(),
      email: form.email.trim(), message: form.message.trim(),
    });
    setSending(false);
    if (error) {
      toast.error("Erreur lors de l'envoi. Réessayez.");
    } else {
      toast.success("Message envoyé ! On revient vers vous en 24h.");
      setForm({ type: formOptions[0], name: "", email: "", message: "" });
    }
  };

  const inputBase = "w-full rounded-2xl px-5 py-4 text-sm font-outfit outline-none transition-all duration-300";
  const inputColors = (field: string) => ({
    background: focusField === field ? "hsl(var(--foreground) / 0.08)" : "hsl(var(--foreground) / 0.05)",
    border: focusField === field ? "1.5px solid hsl(var(--neon) / 0.5)" : "1.5px solid hsl(var(--foreground) / 0.1)",
    color: "hsl(var(--foreground))",
    boxShadow: focusField === field ? "0 0 25px hsl(var(--neon) / 0.08), inset 0 0 20px hsl(var(--neon) / 0.03)" : "none",
  });

  return (
    <section id="contact" ref={ref} className="py-28 md:py-36 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full" style={{ background: "radial-gradient(ellipse, hsl(var(--neon) / 0.04) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-16 items-start relative">
        {/* Left */}
        <div>
          <motion.p
            className="rv font-mono text-[11px] uppercase tracking-[0.25em] mb-4 flex items-center gap-3"
            style={{ color: "hsl(var(--neon))" }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="w-8 h-[2px] rounded-full inline-block"
              style={{ background: "hsl(var(--neon))" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            />
            Contact
          </motion.p>

          <motion.h2
            className="rv font-clash text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            {heading}
          </motion.h2>

          <motion.p
            className="rv text-lg text-foreground/90 font-clash font-semibold mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {text}
          </motion.p>

          <motion.p
            className="rv text-sm leading-[1.8] mb-12"
            style={{ color: "hsl(var(--foreground) / 0.5)" }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
          >
            {subtext}
          </motion.p>

          {/* Contact info cards */}
          <div className="rv space-y-3 text-sm">
            {[
              { icon: <Send size={16} />, label: email, href: `mailto:${email}`, show: true },
              { icon: <Phone size={16} />, label: phone, href: `tel:${phone}`, show: !!phone },
              { icon: <MapPin size={16} />, label: location, href: undefined, show: !!location },
            ].filter(i => i.show).map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.08 }}
                viewport={{ once: true }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    className="group flex items-center gap-4 p-3 rounded-xl transition-all duration-300"
                    style={{ background: "transparent" }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "hsl(var(--foreground) / 0.04)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: "hsl(var(--neon) / 0.08)",
                        border: "1px solid hsl(var(--neon) / 0.15)",
                        color: "hsl(var(--neon))",
                      }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-foreground/60 group-hover:text-foreground transition-colors duration-300">{item.label}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-4 p-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: "hsl(var(--neon) / 0.08)",
                        border: "1px solid hsl(var(--neon) / 0.15)",
                        color: "hsl(var(--neon))",
                      }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-foreground/60">{item.label}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rv inline-flex items-center gap-2.5 mt-10 px-7 py-4 rounded-full font-mono text-sm uppercase tracking-wider font-semibold transition-all duration-300"
            style={{
              background: "#25D366",
              color: "#fff",
              boxShadow: "0 0 25px rgba(37,211,102,0.2)",
            }}
            whileHover={{ y: -2, boxShadow: "0 0 40px rgba(37,211,102,0.35)" }}
            whileTap={{ scale: 0.97 }}
          >
            <MessageSquare size={16} /> WhatsApp
          </motion.a>
        </div>

        {/* Right — Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="rv space-y-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          {/* Custom select */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSelectOpen(!selectOpen)}
              className={`${inputBase} text-left flex items-center justify-between cursor-pointer`}
              style={inputColors("type")}
              onFocus={() => setFocusField("type")}
              onBlur={() => { setFocusField(null); setTimeout(() => setSelectOpen(false), 150); }}
            >
              <span className="text-foreground">{form.type}</span>
              <ChevronDown
                size={18}
                className="transition-transform duration-300"
                style={{
                  color: "hsl(var(--foreground) / 0.4)",
                  transform: selectOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {selectOpen && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50"
                style={{
                  background: "hsl(var(--card))",
                  border: "1.5px solid hsl(var(--foreground) / 0.1)",
                  boxShadow: "0 20px 60px hsla(0,0%,0%,0.5), 0 0 30px hsl(var(--neon) / 0.05)",
                  backdropFilter: "blur(20px)",
                }}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {formOptions.map((opt, idx) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { setForm({ ...form, type: opt }); setSelectOpen(false); }}
                    className="w-full text-left px-5 py-3.5 text-sm font-outfit transition-all duration-200 flex items-center gap-3"
                    style={{
                      color: form.type === opt ? "hsl(var(--neon))" : "hsl(var(--foreground) / 0.7)",
                      background: form.type === opt ? "hsl(var(--neon) / 0.08)" : "transparent",
                      borderBottom: idx < formOptions.length - 1 ? "1px solid hsl(var(--foreground) / 0.06)" : "none",
                    }}
                    onMouseEnter={e => {
                      if (form.type !== opt) e.currentTarget.style.background = "hsl(var(--foreground) / 0.05)";
                    }}
                    onMouseLeave={e => {
                      if (form.type !== opt) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {form.type === opt && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--neon))" }} />
                    )}
                    {opt}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Votre nom"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onFocus={() => setFocusField("name")}
              onBlur={() => setFocusField(null)}
              required
              className={`${inputBase} placeholder:text-foreground/25`}
              style={inputColors("name")}
            />
            <input
              type="email"
              placeholder="Votre email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={() => setFocusField("email")}
              onBlur={() => setFocusField(null)}
              required
              className={`${inputBase} placeholder:text-foreground/25`}
              style={inputColors("email")}
            />
          </div>

          <textarea
            placeholder="Votre message"
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            onFocus={() => setFocusField("message")}
            onBlur={() => setFocusField(null)}
            required
            className={`${inputBase} placeholder:text-foreground/25 resize-none`}
            style={inputColors("message")}
          />

          <motion.button
            type="submit"
            disabled={sending}
            className="w-full rounded-full py-4.5 font-mono text-sm uppercase tracking-[0.15em] font-bold transition-all duration-300 disabled:opacity-50 group cursor-pointer"
            style={{
              background: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 30px hsl(var(--neon) / 0.25)",
            }}
            whileHover={{ y: -2, boxShadow: "0 0 50px hsl(var(--neon) / 0.4)" }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="flex items-center justify-center gap-3">
              {sending ? "Envoi..." : "Envoyer ma demande"}
              {!sending && <Send size={15} className="group-hover:translate-x-1 transition-transform duration-300" />}
            </span>
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactSection;
