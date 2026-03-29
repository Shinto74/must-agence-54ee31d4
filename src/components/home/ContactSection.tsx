import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContactSectionProps {
  heading: string;
  text: string;
  subtext: string;
  email: string;
  whatsappUrl: string;
  formOptions: string[];
}

const ContactSection = ({ heading, text, subtext, email, whatsappUrl, formOptions }: ContactSectionProps) => {
  const ref = useScrollReveal();
  const [form, setForm] = useState({ type: formOptions[0], name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

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

  return (
    <section id="contact" ref={ref} className="py-20 px-6">
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-12">
        <div>
          <p className="rv font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">Contact</p>
          <h2 className="rv font-clash text-3xl md:text-4xl font-bold text-foreground mb-4">{heading}</h2>
          <p className="rv text-xl text-foreground font-clash font-semibold mb-2">{text}</p>
          <p className="rv text-sm text-muted-foreground mb-8 leading-relaxed">{subtext}</p>
          <div className="rv space-y-3 text-sm text-muted-foreground">
            <p>Email: <a href={`mailto:${email}`} className="text-primary hover:underline">{email}</a></p>
          </div>
          <a
            href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="rv inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-pill bg-[#25D366] text-white font-mono text-sm uppercase tracking-wider hover:brightness-110 transition-all duration-300"
          >
            <MessageSquare size={16} /> WhatsApp
          </a>
        </div>
        <form onSubmit={handleSubmit} className="rv space-y-4">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/40">
            {formOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <input type="text" placeholder="Votre nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary/40" />
          <input type="email" placeholder="Votre email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary/40" />
          <textarea placeholder="Votre message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary/40 resize-none" />
          <button type="submit" disabled={sending}
            className="w-full rounded-pill bg-primary text-primary-foreground py-3.5 font-mono text-sm uppercase tracking-wider hover:brightness-110 transition-all duration-300 disabled:opacity-50">
            {sending ? "Envoi..." : "Envoyer ma demande"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
