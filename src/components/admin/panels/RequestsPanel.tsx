import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Search, Filter, X, Kanban, FileText, Mail, Phone, Copy,
  Archive, ArchiveRestore, Send, Download, ChevronRight,
  AlertCircle, Building2, ListChecks, LayoutGrid, Flame, Music2, Briefcase,
  Target, Clock,
} from "lucide-react";
import { toast } from "sonner";

/* ============== Types & helpers ============== */
type RequestType = "quote" | "contact";

interface UnifiedRequest {
  id: string;
  kind: RequestType;
  created_at: string;
  last_activity_at: string;
  status: string;
  archived_at: string | null;
  source: string;
  lead_score: number;
  // contact fields
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  sector?: string;
  budget_estimate?: string;
  message?: string;
  type?: string;
  service?: string;
  // quote fields
  profile?: string;
  project_desc?: string;
  budget?: string;
  deadline?: string;
  expectations?: string[];
  // new business fields
  style?: string;
  company_size?: string;
  objective?: string;
  timeline?: string;
  raw: any;
}

const STATUS_OPTIONS = [
  { value: "nouveau", label: "Nouveau", color: "bg-blue-500/10 text-blue-700 ring-blue-500/30", dot: "bg-blue-500", glow: "shadow-[0_0_0_4px_rgba(59,130,246,0.08)]", grad: "from-blue-500/8 to-transparent", accent: "border-l-blue-500" },
  { value: "a_rappeler", label: "À rappeler", color: "bg-amber-500/10 text-amber-700 ring-amber-500/30", dot: "bg-amber-500", glow: "shadow-[0_0_0_4px_rgba(245,158,11,0.08)]", grad: "from-amber-500/8 to-transparent", accent: "border-l-amber-500" },
  { value: "en_discussion", label: "En discussion", color: "bg-indigo-500/10 text-indigo-700 ring-indigo-500/30", dot: "bg-indigo-500", glow: "shadow-[0_0_0_4px_rgba(99,102,241,0.08)]", grad: "from-indigo-500/8 to-transparent", accent: "border-l-indigo-500" },
  { value: "client_signe", label: "Client signé", color: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30", dot: "bg-emerald-500", glow: "shadow-[0_0_0_4px_rgba(16,185,129,0.08)]", grad: "from-emerald-500/8 to-transparent", accent: "border-l-emerald-500" },
  { value: "sans_reponse", label: "Sans réponse", color: "bg-rose-500/10 text-rose-700 ring-rose-500/30", dot: "bg-rose-500", glow: "shadow-[0_0_0_4px_rgba(244,63,94,0.08)]", grad: "from-rose-500/8 to-transparent", accent: "border-l-rose-500" },
];
const KANBAN_COLUMNS = STATUS_OPTIONS;

// Mapping anciens statuts vers nouveaux pour compat
const LEGACY_MAP: Record<string, string> = {
  en_cours: "en_discussion",
  attente_client: "a_rappeler",
  traite: "client_signe",
  termine: "client_signe",
};
const normalizeStatus = (s: string) => LEGACY_MAP[s] || s;

const statusMeta = (s: string) => STATUS_OPTIONS.find((x) => x.value === normalizeStatus(s)) || STATUS_OPTIONS[0];

const fmtRelative = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "À l'instant";
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `Il y a ${d}j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "2-digit" });
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const isArtisteSource = (s: string) => s === "artiste" || s.startsWith("pack-") || s === "home";
const SourceIcon = ({ source }: { source: string }) =>
  isArtisteSource(source)
    ? <Music2 size={11} className="text-fuchsia-500" />
    : <Briefcase size={11} className="text-amber-600" />;

const isOverdue = (r: UnifiedRequest) =>
  (normalizeStatus(r.status) === "nouveau" || normalizeStatus(r.status) === "a_rappeler") &&
  (Date.now() - new Date(r.last_activity_at || r.created_at).getTime()) > 24 * 3600 * 1000;

/* ============== Hook données ============== */
const PAGE_SIZE = 25;

function useRequestsData(filters: {
  search: string;
  types: RequestType[];
  statuses: string[];
  period: string;
  includeArchived: boolean;
  budgetBucket: string;
}) {
  return useQuery({
    queryKey: ["admin_requests_unified", filters],
    queryFn: async (): Promise<UnifiedRequest[]> => {
      const since = filters.period === "all" ? null
        : new Date(Date.now() - parseInt(filters.period) * 86400000).toISOString();

      const wantQuote = filters.types.length === 0 || filters.types.includes("quote");
      const wantContact = filters.types.length === 0 || filters.types.includes("contact");

      const buildContact = async () => {
        let q = supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(500);
        if (since) q = q.gte("created_at", since);
        if (!filters.includeArchived) q = q.is("archived_at", null);
        const { data, error } = await q;
        if (error) throw error;
        return (data || []).map((c: any): UnifiedRequest => ({
          id: c.id, kind: "contact", created_at: c.created_at,
          last_activity_at: c.last_activity_at || c.created_at,
          status: c.status || "nouveau", archived_at: c.archived_at,
          source: c.source || "", lead_score: c.lead_score ?? 0,
          name: c.name, email: c.email, phone: c.phone,
          company: c.company, sector: c.sector, budget_estimate: c.budget_estimate,
          message: c.message, type: c.type, service: c.service,
          style: c.style, company_size: c.company_size, objective: c.objective, timeline: c.timeline,
          raw: c,
        }));
      };

      const buildQuote = async () => {
        let q = supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(500);
        if (since) q = q.gte("created_at", since);
        if (!filters.includeArchived) q = q.is("archived_at", null);
        const { data, error } = await q;
        if (error) throw error;
        return (data || []).map((c: any): UnifiedRequest => ({
          id: c.id, kind: "quote", created_at: c.created_at,
          last_activity_at: c.last_activity_at || c.created_at,
          status: c.status || "nouveau", archived_at: c.archived_at,
          source: c.source || "", lead_score: c.lead_score ?? 0,
          name: c.name, email: c.email, phone: c.phone,
          company: c.company, profile: c.profile, project_desc: c.project_desc,
          budget: c.budget, deadline: c.deadline, expectations: c.expectations || [],
          style: c.style, company_size: c.company_size, objective: c.objective, timeline: c.timeline,
          raw: c,
        }));
      };

      const [contacts, quotes] = await Promise.all([
        wantContact ? buildContact() : Promise.resolve([]),
        wantQuote ? buildQuote() : Promise.resolve([]),
      ]);
      let all = [...contacts, ...quotes].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Status filter (front, on normalized values)
      if (filters.statuses.length) {
        all = all.filter((r) => filters.statuses.includes(normalizeStatus(r.status)));
      }

      // Budget filter (front, simple text contains)
      if (filters.budgetBucket && filters.budgetBucket !== "all") {
        const bucket = filters.budgetBucket;
        all = all.filter((r) => {
          const t = (r.budget || r.budget_estimate || "").toLowerCase();
          if (bucket === "low") return t.includes("<1k") || t.includes("1k") && !t.includes("10k");
          if (bucket === "mid") return t.includes("3k") || t.includes("5k");
          if (bucket === "high") return t.includes("10k") || t.includes("+") || t.includes("plus");
          return true;
        });
      }

      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        all = all.filter((r) =>
          [r.name, r.email, r.phone, r.company, r.message, r.project_desc, r.profile, r.budget, r.budget_estimate, r.sector, r.service, r.type, r.source, r.style, r.company_size, r.objective, r.timeline]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))
        );
      }

      return all;
    },
    refetchInterval: 10_000,
    refetchOnWindowFocus: true,
  });
}

function useRequestNotes(req: UnifiedRequest | null) {
  return useQuery({
    queryKey: ["request_notes", req?.kind, req?.id],
    queryFn: async () => {
      if (!req) return [];
      const { data, error } = await supabase.from("request_notes")
        .select("*")
        .eq("request_type", req.kind).eq("request_id", req.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!req,
  });
}

/* ============== UI atoms ============== */
function StatusPill({ value, onChange, compact = false }: { value: string; onChange?: (s: string) => void; compact?: boolean }) {
  const meta = statusMeta(value);
  if (!onChange) {
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono ring-1 ${meta.color}`}>{meta.label}</span>;
  }
  return (
    <select
      value={normalizeStatus(value)}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className={`px-2 py-0.5 rounded-full text-[10px] font-mono cursor-pointer focus:outline-none ring-1 border-0 ${meta.color} ${compact ? "" : "min-w-[120px]"}`}
      style={{ colorScheme: "light" }}
    >
      {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
    </select>
  );
}

function TypeBadge({ kind }: { kind: RequestType }) {
  return kind === "quote"
    ? <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-50 text-indigo-700"><FileText size={10} />Devis</span>
    : <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-sky-50 text-sky-700"><Mail size={10} />Contact</span>;
}

function HotBadge({ score }: { score: number }) {
  if (score < 70) return null;
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-700 ring-1 ring-rose-300">
      <Flame size={9} /> HOT {score}
    </span>
  );
}

function OverdueBadge({ req }: { req: UnifiedRequest }) {
  if (!isOverdue(req)) return null;
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-600 text-white animate-pulse">
      <Clock size={9} /> RELANCE
    </span>
  );
}

/* ============== Detail Drawer ============== */
function RequestDrawer({ req, onClose, onUpdate }: {
  req: UnifiedRequest | null;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: notes = [] } = useRequestNotes(req);
  const [noteBody, setNoteBody] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  if (!req) return null;
  const table = req.kind === "quote" ? "quote_requests" : "contact_submissions";

  const updateField = async (patch: any) => {
    const { error } = await supabase.from(table).update(patch).eq("id", req.id);
    if (error) toast.error("Erreur");
    else { onUpdate(); queryClient.invalidateQueries({ queryKey: ["admin_requests_unified"] }); }
  };

  const addNote = async () => {
    if (!noteBody.trim()) return;
    setSavingNote(true);
    const { error } = await supabase.from("request_notes").insert({
      request_type: req.kind, request_id: req.id,
      author_id: user?.id || null, author_email: user?.email || "",
      body: noteBody.trim(),
    });
    setSavingNote(false);
    if (error) { toast.error("Erreur lors de l'ajout"); return; }
    setNoteBody("");
    queryClient.invalidateQueries({ queryKey: ["request_notes", req.kind, req.id] });
    await supabase.from(table).update({ last_activity_at: new Date().toISOString() }).eq("id", req.id);
    queryClient.invalidateQueries({ queryKey: ["admin_requests_unified"] });
  };

  const archive = async () => {
    await updateField({ archived_at: req.archived_at ? null : new Date().toISOString() });
    toast.success(req.archived_at ? "Désarchivée" : "Archivée");
  };

  const replyMailto = () => {
    if (!req.email) return toast.error("Pas d'email pour ce contact");
    const subject = `Re: votre demande Must Agence`;
    const body = `Bonjour ${req.name || ""},\n\nMerci pour votre demande reçue le ${fmtDate(req.created_at)}.\n\n--\nL'équipe Must Agence`;
    window.open(`mailto:${req.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const copyInfo = () => {
    const lines = [
      `Type: ${req.kind === "quote" ? "Devis" : "Contact"}`,
      `Score: ${req.lead_score}/100`,
      `Nom: ${req.name || "—"}`, `Email: ${req.email || "—"}`,
      `Téléphone: ${req.phone || "—"}`, `Entreprise: ${req.company || "—"}`,
      req.profile && `Profil: ${req.profile}`,
      req.style && `Style: ${req.style}`,
      req.company_size && `Taille: ${req.company_size}`,
      req.objective && `Objectif: ${req.objective}`,
      req.timeline && `Délai: ${req.timeline}`,
      req.project_desc && `Projet: ${req.project_desc}`,
      (req.budget || req.budget_estimate) && `Budget: ${req.budget || req.budget_estimate}`,
      req.deadline && `Échéance: ${req.deadline}`,
      req.message && `Message: ${req.message}`,
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(lines);
    toast.success("Copié dans le presse-papier");
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="ml-auto relative w-full sm:max-w-[520px] bg-white border-l border-slate-200 shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 px-5 py-4 border-b border-slate-200 bg-white/95 backdrop-blur flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <TypeBadge kind={req.kind} />
              <StatusPill value={req.status} onChange={(s) => updateField({ status: s })} />
              <HotBadge score={req.lead_score} />
              <OverdueBadge req={req} />
              {req.source && <span className="text-[10px] font-mono text-slate-400 uppercase">{req.source}</span>}
              {req.archived_at && <span className="text-[10px] font-mono text-amber-600 uppercase">Archivée</span>}
            </div>
            <h3 className="font-clash text-lg font-bold text-slate-900 truncate">{req.name || req.profile || "—"}</h3>
            <p className="text-xs text-slate-500">{fmtDate(req.created_at)} · Score lead {req.lead_score}/100</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100"><X size={18} /></button>
        </div>

        <div className="px-5 py-3 border-b border-slate-100 grid grid-cols-2 gap-2">
          <button onClick={replyMailto} disabled={!req.email}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-mono uppercase tracking-wider hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed">
            <Send size={13} /> Répondre
          </button>
          <a href={req.phone ? `tel:${req.phone}` : undefined}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider border ${req.phone ? "border-slate-200 text-slate-700 hover:bg-slate-50" : "border-slate-100 text-slate-300 cursor-not-allowed"}`}>
            <Phone size={13} /> Appeler
          </a>
          <button onClick={copyInfo} className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-mono uppercase tracking-wider hover:bg-slate-50">
            <Copy size={13} /> Copier infos
          </button>
          <button onClick={archive} className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-mono uppercase tracking-wider hover:bg-slate-50">
            {req.archived_at ? <><ArchiveRestore size={13} /> Désarchiver</> : <><Archive size={13} /> Archiver</>}
          </button>
        </div>

        <section className="px-5 py-4 border-b border-slate-100">
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-2">Coordonnées</h4>
          <dl className="grid grid-cols-3 gap-x-3 gap-y-2 text-sm">
            <dt className="text-slate-500 col-span-1">Email</dt>
            <dd className="col-span-2 truncate">{req.email ? <a href={`mailto:${req.email}`} className="text-indigo-600 hover:underline">{req.email}</a> : <span className="text-slate-400">—</span>}</dd>
            <dt className="text-slate-500 col-span-1">Téléphone</dt>
            <dd className="col-span-2">{req.phone ? <a href={`tel:${req.phone}`} className="text-indigo-600 hover:underline">{req.phone}</a> : <span className="text-slate-400">—</span>}</dd>
            <dt className="text-slate-500 col-span-1">Entreprise</dt>
            <dd className="col-span-2">{req.company || <span className="text-slate-400">—</span>}</dd>
          </dl>
        </section>

        <section className="px-5 py-4 border-b border-slate-100">
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-2">Qualification</h4>
          <dl className="space-y-2 text-sm">
            {req.profile && <div><dt className="text-slate-500 text-xs">Profil</dt><dd className="text-slate-900">{req.profile}</dd></div>}
            {req.style && <div><dt className="text-slate-500 text-xs">Style musical</dt><dd className="text-slate-900">{req.style}</dd></div>}
            {req.company_size && <div><dt className="text-slate-500 text-xs">Taille entreprise</dt><dd className="text-slate-900">{req.company_size}</dd></div>}
            {req.objective && <div><dt className="text-slate-500 text-xs">Objectif</dt><dd className="text-slate-900">{req.objective}</dd></div>}
            {req.timeline && <div><dt className="text-slate-500 text-xs">Délai</dt><dd className="text-slate-900">{req.timeline}</dd></div>}
            {(req.budget || req.budget_estimate) && <div><dt className="text-slate-500 text-xs">Budget</dt><dd className="text-slate-900 font-medium">{req.budget || req.budget_estimate}</dd></div>}
            {req.deadline && <div><dt className="text-slate-500 text-xs">Date précise</dt><dd className="text-slate-900">{req.deadline}</dd></div>}
            {req.sector && <div><dt className="text-slate-500 text-xs">Secteur</dt><dd className="text-slate-900">{req.sector}</dd></div>}
            {req.type && <div><dt className="text-slate-500 text-xs">Type de demande</dt><dd className="text-slate-900">{req.type}</dd></div>}
          </dl>
        </section>

        <section className="px-5 py-4 border-b border-slate-100">
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-2">{req.kind === "quote" ? "Projet" : "Message"}</h4>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{req.project_desc || req.message || <span className="text-slate-400">—</span>}</p>
          {req.expectations?.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {req.expectations.map((e) => (
                <span key={e} className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-mono">{e}</span>
              ))}
            </div>
          ) : null}
        </section>

        <section className="px-5 py-4">
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-3">Notes internes ({notes.length})</h4>
          <div className="flex gap-2 mb-3">
            <textarea value={noteBody} onChange={(e) => setNoteBody(e.target.value)}
              placeholder="Ajouter une note privée…" rows={2}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-slate-400 resize-none" />
            <button onClick={addNote} disabled={savingNote || !noteBody.trim()}
              className="self-end px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-mono uppercase disabled:opacity-40">
              {savingNote ? "..." : "Ajouter"}
            </button>
          </div>
          <div className="space-y-2">
            {notes.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Aucune note pour le moment.</p>}
            {notes.map((n: any) => (
              <div key={n.id} className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-slate-700">{n.author_email || "—"}</span>
                  <span className="text-[10px] text-slate-400">{fmtRelative(n.created_at)}</span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{n.body}</p>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

/* ============== Carte lead (Kanban) ============== */
function LeadCard({ req, onClick, onArchive }: { req: UnifiedRequest; onClick: () => void; onArchive: () => void }) {
  const budget = req.budget || req.budget_estimate;
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", JSON.stringify({ id: req.id, kind: req.kind }))}
      onClick={onClick}
      className="cursor-pointer p-3 rounded-lg bg-white border border-slate-200 hover:border-slate-400 hover:shadow-sm transition-all space-y-2"
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        <SourceIcon source={req.source} />
        <TypeBadge kind={req.kind} />
        <HotBadge score={req.lead_score} />
        <OverdueBadge req={req} />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onArchive(); }}
          title="Archiver"
          className="ml-auto p-1 rounded text-slate-300 hover:text-amber-700 hover:bg-amber-50"
        >
          <Archive size={11} />
        </button>
      </div>
      <p className="text-sm font-semibold text-slate-900 truncate">{req.name || req.profile || "Sans nom"}</p>
      <p className="text-[11px] text-slate-500 truncate">{req.email || "—"}</p>
      <div className="flex flex-wrap gap-1 text-[10px] font-mono">
        {budget && <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">💰 {budget}</span>}
        {req.timeline && <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">⏱ {req.timeline}</span>}
        {req.objective && <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 truncate max-w-[160px]">🎯 {req.objective}</span>}
      </div>
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
        <span>Score {req.lead_score}</span>
        <span>{fmtRelative(req.created_at)}</span>
      </div>
    </div>
  );
}

/* ============== Liste compacte ============== */
function RequestListRow({ req, onClick, onStatus, onArchive }: { req: UnifiedRequest; onClick: () => void; onStatus: (s: string) => void; onArchive: () => void }) {
  const budget = req.budget || req.budget_estimate;
  return (
    <button onClick={onClick} className="w-full text-left grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
      <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 flex items-center justify-center font-medium text-xs uppercase">
        {(req.name || req.profile || "?").charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          <SourceIcon source={req.source} />
          <TypeBadge kind={req.kind} />
          <span className="text-sm font-medium text-slate-900 truncate">{req.name || req.profile || "Sans nom"}</span>
          <HotBadge score={req.lead_score} />
          <OverdueBadge req={req} />
          {req.archived_at && <Archive size={11} className="text-amber-500" />}
        </div>
        <p className="text-xs text-slate-500 truncate">
          {[budget, req.timeline, req.objective].filter(Boolean).join(" · ") || (req.message || req.project_desc)}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">{req.email || "—"} · {fmtRelative(req.created_at)}</p>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        <StatusPill value={req.status} onChange={onStatus} compact />
        <button type="button" onClick={(e) => { e.stopPropagation(); onArchive(); }}
          title={req.archived_at ? "Désarchiver" : "Archiver"}
          className="p-2 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50">
          {req.archived_at ? <ArchiveRestore size={14} /> : <Archive size={14} />}
        </button>
        <ChevronRight size={14} className="text-slate-300" />
      </div>
    </button>
  );
}

/* ============== Main ============== */
type ViewMode = "kanban" | "list";

export default function RequestsPanel() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<ViewMode>("kanban");
  const [search, setSearch] = useState("");
  const [types, setTypes] = useState<RequestType[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [budgetBucket, setBudgetBucket] = useState("all");
  const [period, setPeriod] = useState("90");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [selected, setSelected] = useState<UnifiedRequest | null>(null);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data: requests = [], isLoading } = useRequestsData({
    search, types, statuses, period, includeArchived, budgetBucket,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ req, status }: { req: UnifiedRequest; status: string }) => {
      const table = req.kind === "quote" ? "quote_requests" : "contact_submissions";
      const { error } = await supabase.from(table).update({ status }).eq("id", req.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_requests_unified"] }),
  });

  const archiveRequest = useMutation({
    mutationFn: async (req: UnifiedRequest) => {
      const table = req.kind === "quote" ? "quote_requests" : "contact_submissions";
      const { error } = await supabase
        .from(table)
        .update({ archived_at: req.archived_at ? null : new Date().toISOString() })
        .eq("id", req.id);
      if (error) throw error;
      return req;
    },
    onSuccess: (req) => {
      toast.success(req.archived_at ? "Demande désarchivée" : "Demande archivée");
      queryClient.invalidateQueries({ queryKey: ["admin_requests_unified"] });
      queryClient.invalidateQueries({ queryKey: ["admin_notifications_counts"] });
    },
  });

  const counts = useMemo(() => {
    const byStatus: Record<string, number> = {};
    requests.forEach((r) => {
      const s = normalizeStatus(r.status);
      byStatus[s] = (byStatus[s] || 0) + 1;
    });
    return byStatus;
  }, [requests]);

  const stats = useMemo(() => {
    const open = requests.filter((r) => !r.archived_at);
    return {
      hot: open.filter((r) => r.lead_score >= 70).length,
      overdue: open.filter(isOverdue).length,
      total: requests.length,
    };
  }, [requests]);

  const paginated = useMemo(() => requests.slice(0, page * PAGE_SIZE), [requests, page]);
  const hasMore = paginated.length < requests.length;

  const exportCSV = () => {
    if (!requests.length) return;
    const headers = ["type", "date", "score", "statut", "source", "nom", "email", "telephone", "entreprise", "profil", "style", "taille", "objectif", "delai", "budget", "message"];
    const sep = ";";
    const escape = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = requests.map((r) => [
      r.kind === "quote" ? "Devis" : "Contact",
      new Date(r.created_at).toLocaleString("fr-FR"),
      r.lead_score,
      statusMeta(r.status).label, r.source, r.name, r.email, r.phone, r.company,
      r.profile, r.style, r.company_size, r.objective, r.timeline,
      r.budget || r.budget_estimate, (r.message || r.project_desc || "").replace(/\n/g, " "),
    ].map(escape).join(sep));
    const csv = "\uFEFF" + [headers.join(sep), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `demandes-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const toggle = <T,>(arr: T[], v: T): T[] => arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const renderKanban = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      {KANBAN_COLUMNS.map((col) => {
        const items = requests.filter((r) => normalizeStatus(r.status) === col.value && !r.archived_at);
        return (
          <div key={col.value}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const data = JSON.parse(e.dataTransfer.getData("text/plain"));
              const req = requests.find((r) => r.id === data.id && r.kind === data.kind);
              if (req && normalizeStatus(req.status) !== col.value) updateStatus.mutate({ req, status: col.value });
            }}
            className="rounded-xl bg-slate-50 border border-slate-200 p-3 min-h-[200px]"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className="text-xs font-semibold text-slate-700">{col.label}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 tabular-nums">{items.length}</span>
            </div>
            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-0.5">
              {items.length === 0 && <p className="text-[11px] text-slate-400 text-center py-3">Vide</p>}
              {items.map((r) => (
                <LeadCard key={`${r.kind}-${r.id}`} req={r}
                  onClick={() => setSelected(r)}
                  onArchive={() => archiveRequest.mutate(r)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[260px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher nom, email, message…"
              className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-400 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100">
            {([
              { v: "kanban", l: "Kanban", I: Kanban },
              { v: "list", l: "Liste", I: ListChecks },
            ] as const).map(({ v, l, I }) => (
              <button key={v} onClick={() => setView(v as ViewMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${view === v ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-900"}`}>
                <I size={13} /> {l}
              </button>
            ))}
          </div>

          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border transition-all ${showFilters || types.length || statuses.length || budgetBucket !== "all" ? "border-slate-900 text-slate-900 bg-slate-50" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            <Filter size={13} /> Filtres {(types.length + statuses.length + (budgetBucket !== "all" ? 1 : 0)) > 0 && <span className="px-1.5 rounded-full bg-slate-900 text-white text-[10px]">{types.length + statuses.length + (budgetBucket !== "all" ? 1 : 0)}</span>}
          </button>

          <button onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border border-slate-200 text-slate-600 hover:bg-slate-50">
            <Download size={13} /> CSV
          </button>
        </div>

        {showFilters && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">Type</p>
                <div className="flex gap-1.5">
                  {(["quote", "contact"] as RequestType[]).map((t) => (
                    <button key={t} onClick={() => { setTypes(toggle(types, t)); setPage(1); }}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${types.includes(t) ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      {t === "quote" ? "Devis" : "Contact"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">Statut</p>
                <div className="flex gap-1.5 flex-wrap">
                  {STATUS_OPTIONS.map((s) => (
                    <button key={s.value} onClick={() => { setStatuses(toggle(statuses, s.value)); setPage(1); }}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${statuses.includes(s.value) ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">Budget</p>
                <div className="flex gap-1.5">
                  {[{ v: "all", l: "Tous" }, { v: "low", l: "<3k" }, { v: "mid", l: "3k–10k" }, { v: "high", l: "10k+" }].map((b) => (
                    <button key={b.v} onClick={() => { setBudgetBucket(b.v); setPage(1); }}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${budgetBucket === b.v ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      {b.l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">Période</p>
                <div className="flex gap-1.5">
                  {[{ v: "7", l: "7j" }, { v: "30", l: "30j" }, { v: "90", l: "90j" }, { v: "all", l: "Tout" }].map((p) => (
                    <button key={p.v} onClick={() => { setPeriod(p.v); setPage(1); }}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${period === p.v ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      {p.l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">Archives</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={includeArchived} onChange={(e) => { setIncludeArchived(e.target.checked); setPage(1); }} className="rounded" />
                  <span className="text-xs text-slate-700">Inclure les archives</span>
                </label>
              </div>
            </div>
            {(types.length > 0 || statuses.length > 0 || budgetBucket !== "all") && (
              <button onClick={() => { setTypes([]); setStatuses([]); setBudgetBucket("all"); setPage(1); }}
                className="text-xs text-slate-500 hover:text-slate-900 underline">Réinitialiser les filtres</button>
            )}
          </div>
        )}
      </div>

      {/* Compact stats */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-200 font-mono">
          <Flame size={12} /> {stats.hot} hot {stats.hot > 1 ? "leads" : "lead"}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 ring-1 ring-red-200 font-mono">
          <Clock size={12} /> {stats.overdue} à relancer (&gt;24h)
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-mono">
          <Target size={12} /> {stats.total} demande{stats.total > 1 ? "s" : ""} visible{stats.total > 1 ? "s" : ""}
        </span>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm text-slate-400">Chargement…</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <AlertCircle size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm text-slate-500">Aucune demande ne correspond.</p>
        </div>
      ) : view === "list" ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="p-2 space-y-1">
            {paginated.map((r) => (
              <RequestListRow key={`${r.kind}-${r.id}`} req={r}
                onClick={() => setSelected(r)}
                onStatus={(s) => updateStatus.mutate({ req: r, status: s })}
                onArchive={() => archiveRequest.mutate(r)} />
            ))}
          </div>
          {hasMore && (
            <div className="border-t border-slate-100 p-3 text-center">
              <button onClick={() => setPage(page + 1)}
                className="text-xs font-mono text-slate-600 hover:text-slate-900">
                Charger plus ({requests.length - paginated.length} restant)
              </button>
            </div>
          )}
        </div>
      ) : (
        renderKanban()
      )}

      {selected && <RequestDrawer req={selected} onClose={() => setSelected(null)} onUpdate={() => {}} />}
    </div>
  );
}
