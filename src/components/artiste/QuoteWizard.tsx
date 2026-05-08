import { useMemo, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Mic, Building2, Briefcase, DollarSign, TrendingUp, Gem, Rocket, Volume2, BarChart3, Palette, Handshake, User, Mail, Phone, Flame, Zap, Calendar, Search, Crown, Headphones, Users, Music2, Music3, Music4, Sparkles } from "lucide-react";
import { z } from "zod";

interface QuoteOption {
  label: string;
  icon: string;
}

interface QuoteFieldDef {
  key: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}

interface QuoteStep {
  key?: string;
  title: string;
  question: string;
  type: "radio" | "textarea" | "date" | "checkbox" | "fields";
  options?: QuoteOption[];
  fields?: QuoteFieldDef[];
  placeholder?: string;
  showIf?: (answers: Record<string, any>) => boolean;
}

interface QuoteWizardProps {
  steps: QuoteStep[];
  onSubmitComplete?: () => void;
  hideHeader?: boolean;
  source?: string;
}

const coordsSchema = z.object({
  name: z.string().trim().min(2, "Nom requis"),
  email: z.string().trim().email("Email invalide"),
  phone: z.string().trim().min(6, "Téléphone requis"),
  company: z.string().trim().max(120).optional().or(z.literal("")),
});

const getIconForOption = (label: string) => {
  const iconMap: Record<string, any> = {
    "Artiste Indépendant": Mic, "Label": Building2, "Entreprise": Briefcase,
    "<1k€": DollarSign, "1k€ – 3k€": TrendingUp, "3k€ – 5k€": Gem, "5k€ – 10k€": Rocket, "10k€+": Crown,
    "Gagner en visibilité": Volume2, "Développer mon image": Palette, "Obtenir plus d'écoutes": Headphones,
    "Lancer un projet": Rocket, "Stratégie long terme": TrendingUp, "Générer des ventes": BarChart3, "Développer une communauté": Handshake,
    "Dès que possible": Flame, "Ce mois-ci": Zap, "Dans 1 à 3 mois": Calendar, "Je me renseigne": Search,
    "Solo / Indépendant": User, "Startup": Rocket, "PME": Building2, "Marque établie": Crown,
    "Rap": Mic, "Pop": Music2, "Afro": Music3, "Électro": Music4, "Variété": Headphones, "Autre": Sparkles,
  };
  return iconMap[label] || Briefcase;
};

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
  const days: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  const selectedDate = new Date(value || new Date());
  const isSelectedMonth = selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
  const selectedDay = isSelectedMonth ? selectedDate.getDate() : null;
  const handleDayClick = (day: number) => {
    const newDate = new Date(year, month, day);
    setCurrentDate(newDate);
    onChange(newDate.toISOString().split("T")[0]);
  };
  const today = new Date();
  const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  return (
    <div className="w-full rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 hover:bg-primary/10 rounded-lg"><ChevronLeft size={20} className="text-primary" /></button>
        <div className="text-center">
          <p className="font-mono text-xs text-muted-foreground uppercase mb-1">Sélectionner une date</p>
          <h3 className="font-clash text-xl font-bold text-primary">{monthNames[month]} {year}</h3>
        </div>
        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 hover:bg-primary/10 rounded-lg"><ChevronRight size={20} className="text-primary" /></button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayNames.map((d) => <div key={d} className="h-8 flex items-center justify-center text-xs font-mono text-muted-foreground">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => (
          <button key={idx} onClick={() => day && handleDayClick(day)} disabled={!day}
            className={`h-10 rounded-lg font-medium text-sm transition-all ${
              !day ? "invisible"
              : selectedDay === day ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/30"
              : isToday(day) ? "border border-primary/40 text-primary hover:bg-primary/10"
              : "border border-border/50 text-foreground hover:border-primary/50 hover:bg-primary/5"
            }`}
          >{day}</button>
        ))}
      </div>
    </div>
  );
};

const QuoteWizard = ({ steps, onSubmitComplete, hideHeader = false, source = "" }: QuoteWizardProps) => {
  const ref = useScrollReveal();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [coords, setCoords] = useState({ name: "", email: "", phone: "", company: "" });
  const [coordsErrors, setCoordsErrors] = useState<Record<string, string>>({});
  const [shake, setShake] = useState(false);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Steps active selon réponses (showIf)
  const activeSteps = useMemo(
    () => steps.map((s, i) => ({ ...s, originalIndex: i })).filter((s) => !s.showIf || s.showIf(answers)),
    [steps, answers]
  );

  if (!steps.length) return null;
  const totalSteps = activeSteps.length + 1; // + coords
  const isCoordsStep = stepIndex >= activeSteps.length;
  const step = isCoordsStep ? null : activeSteps[stepIndex];
  const stepKey = step?.key || `step_${step?.originalIndex}`;

  const validate = () => {
    if (isCoordsStep) {
      const r = coordsSchema.safeParse(coords);
      if (!r.success) {
        const errs: Record<string, string> = {};
        r.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
        setCoordsErrors(errs);
        return false;
      }
      setCoordsErrors({});
      return true;
    }
    if (step?.type === "fields" && step.fields) {
      const missing = step.fields.find((f) => f.required && !(answers[f.key] || "").toString().trim());
      if (missing) return false;
      return true;
    }
    const v = answers[stepKey];
    if (!v || (Array.isArray(v) && v.length === 0) || v === "") return false;
    return true;
  };

  const submit = async () => {
    setSending(true);
    const expectations = answers.objective || [];
    const objective = Array.isArray(expectations) ? expectations.join(", ") : String(expectations || "");

    // Identité (variable selon profil)
    const identityName =
      answers.artist_name || answers.label_name || answers.company_name || coords.company || "";
    const socialBits = [
      answers.social_instagram && `Instagram: ${answers.social_instagram}`,
      answers.social_spotify && `Spotify: ${answers.social_spotify}`,
      answers.social_youtube && `YouTube: ${answers.social_youtube}`,
      answers.social_website && `Site/IG: ${answers.social_website}`,
      answers.company_sector && `Secteur: ${answers.company_sector}`,
    ].filter(Boolean).join(" · ");
    const projectFull = [answers.project_desc, socialBits].filter(Boolean).join("\n\n");

    await supabase.from("quote_requests").insert({
      profile: answers.profile || "",
      project_desc: projectFull,
      budget: answers.budget || "",
      deadline: answers.deadline || null,
      expectations: Array.isArray(expectations) ? expectations : [],
      style: answers.style || "",
      company_size: answers.label_size || answers.company_size || "",
      objective,
      timeline: answers.timeline || "",
      name: coords.name.trim(),
      email: coords.email.trim(),
      phone: coords.phone.trim(),
      company: identityName,
      source: source || "artiste",
    });
    setSending(false);
    setDone(true);
  };

  const next = () => {
    if (!validate()) { setShake(true); setTimeout(() => setShake(false), 400); return; }
    if (stepIndex < totalSteps - 1) setStepIndex(stepIndex + 1);
    else submit();
  };
  const prev = () => { if (stepIndex > 0) setStepIndex(stepIndex - 1); };
  const setAnswer = (val: any) => setAnswers({ ...answers, [stepKey]: val });
  const setFieldAnswer = (k: string, v: any) => setAnswers((a) => ({ ...a, [k]: v }));

  if (done) {
    return (
      <section ref={ref} id="devis" className="py-20 px-6">
        <div className="rv max-w-[600px] mx-auto text-center animate-fadeSlide">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="font-clash text-2xl font-bold text-foreground mb-2">Demande envoyée !</h3>
          <p className="text-muted-foreground mb-6">On revient vers vous en 48h maximum.</p>
          {onSubmitComplete && (
            <button onClick={onSubmitComplete}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-pill border border-border text-foreground font-mono text-sm uppercase tracking-wider hover:border-primary/40 hover:text-primary transition-all">
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
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= stepIndex ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>
        <div className={`animate-fadeSlide ${shake ? "animate-shake" : ""}`} key={stepIndex}>
          {isCoordsStep ? (
            <>
              <p className="font-mono text-xs text-primary uppercase tracking-wider mb-1">Étape finale</p>
              <h3 className="font-clash text-xl font-semibold text-foreground mb-2">Vos coordonnées</h3>
              <p className="text-sm text-muted-foreground mb-6">Pour vous recontacter sous 48h.</p>
              <div className="space-y-3">
                <div>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Nom complet *" value={coords.name}
                      onChange={(e) => setCoords({ ...coords, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary/40" />
                  </div>
                  {coordsErrors.name && <p className="text-xs text-red-500 mt-1 ml-1">{coordsErrors.name}</p>}
                </div>
                <div>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="email" placeholder="Email *" value={coords.email}
                      onChange={(e) => setCoords({ ...coords, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary/40" />
                  </div>
                  {coordsErrors.email && <p className="text-xs text-red-500 mt-1 ml-1">{coordsErrors.email}</p>}
                </div>
                <div>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="tel" placeholder="Téléphone *" value={coords.phone}
                      onChange={(e) => setCoords({ ...coords, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary/40" />
                  </div>
                  {coordsErrors.phone && <p className="text-xs text-red-500 mt-1 ml-1">{coordsErrors.phone}</p>}
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
                    const Icon = getIconForOption(opt.label);
                    const sel = answers[stepKey] === opt.label;
                    return (
                      <button key={opt.label} onClick={() => setAnswer(opt.label)}
                        className={`p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center ${
                          sel ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 text-foreground"
                          : "border-border bg-surface text-muted-foreground hover:border-primary/40"
                        }`}>
                        <Icon size={24} className={`mb-2 ${sel ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-medium">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {step!.type === "textarea" && (
                <textarea value={answers[stepKey] || ""} onChange={(e) => setAnswer(e.target.value)} placeholder={step!.placeholder} rows={4}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary/40 resize-none" />
              )}

              {step!.type === "date" && (
                <DatePickerCalendar value={answers[stepKey] || ""} onChange={(d) => setAnswer(d)} />
              )}

              {step!.type === "fields" && step!.fields && (
                <div className="space-y-3">
                  {step!.fields.map((f) => (
                    <div key={f.key}>
                      <input
                        type="text"
                        placeholder={f.placeholder || (f.label + (f.required ? " *" : ""))}
                        value={answers[f.key] || ""}
                        onChange={(e) => setFieldAnswer(f.key, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary/40"
                      />
                    </div>
                  ))}
                </div>
              )}

              {step!.type === "checkbox" && step!.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {step!.options.map((opt) => {
                    const Icon = getIconForOption(opt.label);
                    const sel = (answers[stepKey] || []) as string[];
                    const isSel = sel.includes(opt.label);
                    return (
                      <button key={opt.label} onClick={() => setAnswer(isSel ? sel.filter((s) => s !== opt.label) : [...sel, opt.label])}
                        className={`p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center ${
                          isSel ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 text-foreground"
                          : "border-border bg-surface text-muted-foreground hover:border-primary/40"
                        }`}>
                        <Icon size={24} className={`mb-2 ${isSel ? "text-primary" : "text-muted-foreground"}`} />
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
          {stepIndex > 0 && (
            <button onClick={prev} className="px-6 py-3 rounded-pill border border-border text-foreground font-mono text-sm uppercase tracking-wider hover:border-border-light transition-all">
              Retour
            </button>
          )}
          <button onClick={next} disabled={sending}
            className="flex-1 py-3 rounded-pill bg-primary text-primary-foreground font-mono text-sm uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-50">
            {sending ? "Envoi..." : stepIndex === totalSteps - 1 ? "Envoyer ma demande" : "Continuer"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuoteWizard;
