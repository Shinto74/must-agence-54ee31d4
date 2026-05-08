import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/constants";
import { ChevronLeft, ChevronRight, Mic, Building2, Briefcase, DollarSign, TrendingUp, Gem, Rocket, Volume2, BarChart3, Palette, Handshake, User, Mail, Phone } from "lucide-react";
import { z } from "zod";

interface QuoteOption {
  label: string;
  icon: string;
}

interface QuoteStep {
  title: string;
  question: string;
  type: "radio" | "textarea" | "date" | "checkbox";
  options?: QuoteOption[];
  placeholder?: string;
}

interface QuoteWizardProps {
  steps: QuoteStep[];
  onSubmitComplete?: () => void;
  /** Cache le titre interne (utile quand le wizard est rendu dans une modale qui a déjà son titre) */
  hideHeader?: boolean;
  /** Source de la demande pour le suivi admin (ex: "pack-essentiel", "artiste") */
  source?: string;
}

const COORDS_STEP_INDEX = -1; // marqueur pour l'étape coordonnées finale

const coordsSchema = z.object({
  name: z.string().trim().min(2, "Nom requis"),
  email: z.string().trim().email("Email invalide"),
  phone: z.string().trim().min(6, "Téléphone requis"),
  company: z.string().trim().max(120).optional().or(z.literal("")),
});

/* ─── MAPPING ICONES PAR OPTION ─── */
const getIconForOption = (label: string) => {
  const iconMap: Record<string, any> = {
    // Étape 1: Profil
    "Artiste Indépendant": Mic,
    "Label": Building2,
    "Entreprise": Briefcase,
    // Étape 3: Budget
    "Moins de 1k€": DollarSign,
    "1k€ – 3k€": TrendingUp,
    "3k€ – 5k€": Gem,
    "+5k€": Rocket,
    // Étape 5: Attentes
    "Notoriété": Volume2,
    "Ventes": BarChart3,
    "Image de marque": Palette,
    "Accompagnement humain": Handshake,
  };
  return iconMap[label] || Briefcase;
};

/* ─── DATE PICKER CALENDAR ─── */
const DatePickerCalendar = ({ value, onChange }: { value: string; onChange: (date: string) => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date(value || new Date()));
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = (firstDay.getDay() + 6) % 7;
  
  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const selectedDate = new Date(value || new Date());
  const isSelectedMonth = selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
  const selectedDay = isSelectedMonth ? selectedDate.getDate() : null;

  const handleDayClick = (day: number) => {
    const newDate = new Date(year, month, day);
    setCurrentDate(newDate);
    const formatted = newDate.toISOString().split("T")[0];
    onChange(formatted);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  return (
    <div className="w-full rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} className="text-primary" />
        </button>
        <div className="text-center">
          <p className="font-mono text-xs text-muted-foreground uppercase mb-1">Sélectionner une date</p>
          <h3 className="font-clash text-xl font-bold text-primary">
            {monthNames[month]} {year}
          </h3>
        </div>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
        >
          <ChevronRight size={20} className="text-primary" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayNames.map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-mono text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => day && handleDayClick(day)}
            disabled={!day}
            className={`h-10 rounded-lg font-medium text-sm transition-all duration-200 ${
              !day
                ? "invisible"
                : selectedDay === day
                ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/30"
                : isToday(day)
                ? "border border-primary/40 text-primary hover:bg-primary/10"
                : "border border-border/50 text-foreground hover:border-primary/50 hover:bg-primary/5"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground mb-2">Date sélectionnée</p>
        <p className="font-clash text-lg font-bold text-primary">
          {selectedDay ? `${selectedDay} ${monthNames[month]} ${year}` : "Aucune date"}
        </p>
      </div>
    </div>
  );
};

const QuoteWizard = ({ steps, onSubmitComplete, hideHeader = false, source = "" }: QuoteWizardProps) => {
  const ref = useScrollReveal();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [shake, setShake] = useState(false);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [coords, setCoords] = useState({ name: "", email: "", phone: "", company: "" });
  const [coordsErrors, setCoordsErrors] = useState<Record<string, string>>({});

  if (!steps.length) return null;
  const totalSteps = steps.length + 1; // +1 pour l'étape coordonnées
  const isCoordsStep = current === steps.length;
  const step = isCoordsStep ? null : steps[current];

  const validate = () => {
    if (isCoordsStep) {
      const result = coordsSchema.safeParse(coords);
      if (!result.success) {
        const errs: Record<string, string> = {};
        result.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
        setCoordsErrors(errs);
        return false;
      }
      setCoordsErrors({});
      return true;
    }
    const val = answers[current];
    if (!val || (Array.isArray(val) && val.length === 0) || val === "") return false;
    return true;
  };

  const submit = async () => {
    setSending(true);
    const profile = answers[0] || "";
    const project_desc = answers[1] || "";
    const budget = answers[2] || "";
    const deadline = answers[3] || null;
    const expectations = answers[4] || [];

    await supabase.from("quote_requests").insert({
      profile, project_desc, budget, deadline, expectations,
      name: coords.name.trim(),
      email: coords.email.trim(),
      phone: coords.phone.trim(),
      company: coords.company.trim(),
      source: source || "artiste",
    });

    setSending(false);
    setDone(true);
  };

  const next = () => {
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    if (current < totalSteps - 1) {
      setCurrent(current + 1);
    } else {
      submit();
    }
  };

  const prev = () => { if (current > 0) setCurrent(current - 1); };
  const setAnswer = (val: any) => { setAnswers({ ...answers, [current]: val }); };

  const buildWhatsAppUrl = () => {
    const lines = [
      `Profil: ${answers[0] || ""}`,
      `Projet: ${answers[1] || ""}`,
      `Budget: ${answers[2] || ""}`,
      answers[3] ? `Échéance: ${answers[3]}` : "",
      answers[4]?.length ? `Attentes: ${(answers[4] as string[]).join(", ")}` : "",
      coords.name ? `Nom: ${coords.name}` : "",
      coords.email ? `Email: ${coords.email}` : "",
      coords.phone ? `Téléphone: ${coords.phone}` : "",
    ].filter(Boolean).join("\n");
    return `${SITE.contact.whatsappUrl}?text=${encodeURIComponent(`Demande de devis Must Agence\n\n${lines}`)}`;
  };

  if (done) {
    return (
      <section ref={ref} id="devis" className="py-20 px-6">
        <div className="rv max-w-[600px] mx-auto text-center animate-fadeSlide">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="font-clash text-2xl font-bold text-foreground mb-2">Demande envoyée !</h3>
          <p className="text-muted-foreground mb-6">On revient vers vous en 48h maximum.</p>
          {onSubmitComplete && (
            <button
              onClick={onSubmitComplete}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-pill border border-border text-foreground font-mono text-sm uppercase tracking-wider hover:border-primary/40 hover:text-primary transition-all duration-300"
            >
              Fermer
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="devis" className={hideHeader ? "" : "py-20 px-6"}>
      <div className={hideHeader ? "" : "max-w-[600px] mx-auto"}>
        {!hideHeader && (
          <>
            <p className="rv font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">Devis personnalisé</p>
            <h2 className="rv font-clash text-3xl font-bold text-foreground mb-8">
              Construisons votre <span className="text-primary">stratégie</span> ensemble.
            </h2>
          </>
        )}
        <div className="rv flex gap-1 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= current ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>
        <div className={`animate-fadeSlide ${shake ? "animate-shake" : ""}`} key={current}>
          {isCoordsStep ? (
            <>
              <p className="font-mono text-xs text-primary uppercase tracking-wider mb-1">Étape finale</p>
              <h3 className="font-clash text-xl font-semibold text-foreground mb-2">Vos coordonnées</h3>
              <p className="text-sm text-muted-foreground mb-6">Pour vous recontacter sous 24h.</p>
              <div className="space-y-3">
                <div>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text" placeholder="Nom complet *" value={coords.name}
                      onChange={(e) => setCoords({ ...coords, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary/40"
                    />
                  </div>
                  {coordsErrors.name && <p className="text-xs text-red-500 mt-1 ml-1">{coordsErrors.name}</p>}
                </div>
                <div>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email" placeholder="Email *" value={coords.email}
                      onChange={(e) => setCoords({ ...coords, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary/40"
                    />
                  </div>
                  {coordsErrors.email && <p className="text-xs text-red-500 mt-1 ml-1">{coordsErrors.email}</p>}
                </div>
                <div>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="tel" placeholder="Téléphone *" value={coords.phone}
                      onChange={(e) => setCoords({ ...coords, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary/40"
                    />
                  </div>
                  {coordsErrors.phone && <p className="text-xs text-red-500 mt-1 ml-1">{coordsErrors.phone}</p>}
                </div>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text" placeholder="Entreprise / Label (facultatif)" value={coords.company}
                    onChange={(e) => setCoords({ ...coords, company: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary/40"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="font-mono text-xs text-primary uppercase tracking-wider mb-1">{step!.title}</p>
              <h3 className="font-clash text-xl font-semibold text-foreground mb-6">{step!.question}</h3>

              {step!.type === "radio" && step!.options && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {step!.options.map((opt) => {
                    const IconComponent = getIconForOption(opt.label);
                    return (
                      <button key={opt.label} onClick={() => setAnswer(opt.label)}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-300 flex flex-col items-center justify-center ${
                          answers[current] === opt.label 
                            ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 text-foreground" 
                            : "border-border bg-surface text-muted-foreground hover:border-primary/40"
                        }`}>
                        <IconComponent size={24} className={`mb-2 ${answers[current] === opt.label ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-medium">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {step!.type === "textarea" && (
                <textarea value={answers[current] || ""} onChange={(e) => setAnswer(e.target.value)} placeholder={step!.placeholder} rows={4}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary/40 resize-none" />
              )}

              {step!.type === "date" && (
                <DatePickerCalendar value={answers[current] || ""} onChange={(date) => setAnswer(date)} />
              )}

              {step!.type === "checkbox" && step!.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {step!.options.map((opt) => {
                    const IconComponent = getIconForOption(opt.label);
                    const selected = (answers[current] || []) as string[];
                    const isSelected = selected.includes(opt.label);
                    return (
                      <button key={opt.label} onClick={() => setAnswer(isSelected ? selected.filter((s) => s !== opt.label) : [...selected, opt.label])}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-300 flex flex-col items-center justify-center ${
                          isSelected 
                            ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 text-foreground" 
                            : "border-border bg-surface text-muted-foreground hover:border-primary/40"
                        }`}>
                        <IconComponent size={24} className={`mb-2 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-medium">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          {current > 0 && (
            <button onClick={prev} className="px-6 py-3 rounded-pill border border-border text-foreground font-mono text-sm uppercase tracking-wider hover:border-border-light transition-all duration-300">
              Retour
            </button>
          )}
          <button onClick={next} disabled={sending}
            className="flex-1 py-3 rounded-pill bg-primary text-primary-foreground font-mono text-sm uppercase tracking-wider hover:brightness-110 transition-all duration-300 disabled:opacity-50">
            {sending ? "Envoi..." : current === totalSteps - 1 ? "Envoyer ma demande" : "Continuer"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuoteWizard;
