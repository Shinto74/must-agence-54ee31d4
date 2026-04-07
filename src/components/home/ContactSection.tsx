import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MessageSquare, Phone, MapPin, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const inputClass = (field: string) =>
    `w-full rounded-xl border bg-surface px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-400 ${
      focusField === field
        ? "border-primary/60 shadow-[0_0_15px_hsl(var(--neon)/0.1)]"
        : "border-border hover:border-border-light"
    }`;

  return (
    <section id="contact" ref={ref} className="py-24 px-6">
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-16">
        {/* Left */}
        <div>
          <p className="rv font-mono text-xs uppercase tracking-[0.2em] text-primary mb-3">Contact</p>
          <h2 className="rv font-clash text-3xl md:text-4xl font-bold text-foreground mb-4">{heading}</h2>
          <p className="rv text-xl text-foreground font-clash font-semibold mb-2">{text}</p>
          <p className="rv text-sm text-muted-foreground mb-10 leading-relaxed">{subtext}</p>

          <div className="rv space-y-4 text-sm">
            <a href={`mailto:${email}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
              <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center group-hover:border-primary/40 transition-colors">
                <Send size={15} className="text-primary" />
              </div>
              {email}
            </a>
            {phone && (
              <a href={`tel:${phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center group-hover:border-primary/40 transition-colors">
                  <Phone size={15} className="text-primary" />
                </div>
                {phone}
              </a>
            )}
            {location && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center">
                  <MapPin size={15} className="text-primary" />
                </div>
                {location}
              </div>
            )}
          </div>

          <a
            href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="rv inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-pill bg-[#25D366] text-foreground font-mono text-sm uppercase tracking-wider hover:brightness-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all duration-300"
          >
            <MessageSquare size={16} /> WhatsApp
          </a>
        </div>

        {/* Right — Form */}
        <form onSubmit={handleSubmit} className="rv space-y-4">
          <div className="relative">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              onFocus={() => setFocusField("type")}
              onBlur={() => setFocusField(null)}
              className={inputClass("type")}
            >
              {formOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text" placeholder="Votre nom" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onFocus={() => setFocusField("name")}
              onBlur={() => setFocusField(null)}
              required className={inputClass("name")}
            />
            <input
              type="email" placeholder="Votre email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={() => setFocusField("email")}
              onBlur={() => setFocusField(null)}
              required className={inputClass("email")}
            />
          </div>

          <textarea
            placeholder="Votre message" rows={5} value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            onFocus={() => setFocusField("message")}
            onBlur={() => setFocusField(null)}
            required className={`${inputClass("message")} resize-none`}
          />

          <button
            type="submit" disabled={sending}
            className="w-full rounded-pill bg-primary text-primary-foreground py-4 font-mono text-sm uppercase tracking-wider hover:brightness-110 hover:shadow-[0_0_30px_hsl(var(--neon)/0.3)] transition-all duration-300 disabled:opacity-50 group"
          >
            <span className="flex items-center justify-center gap-2">
              {sending ? "Envoi..." : "Envoyer ma demande"}
              {!sending && <Send size={14} className="group-hover:translate-x-1 transition-transform" />}
            </span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
