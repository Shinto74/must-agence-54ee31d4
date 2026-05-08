import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Search, Filter, X, Kanban, FileText, Mail, Phone, Copy,
  Archive, ArchiveRestore, Send, Download, Clock, ChevronRight,
  MessageSquare, AlertCircle, Building2, CheckCircle2, ListChecks,
  LayoutGrid, Table2, Flame, Zap, TrendingUp, Inbox, Activity, Sparkles,
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
  raw: any;
}

const STATUS_OPTIONS = [
  { value: "nouveau", label: "Nouveau", color: "bg-blue-500/15 text-blue-700 ring-blue-500/20" },
  { value: "en_cours", label: "En cours", color: "bg-amber-500/15 text-amber-700 ring-amber-500/20" },
  { value: "attente_client", label: "Attente client", color: "bg-purple-500/15 text-purple-700 ring-purple-500/20" },
  { value: "traite", label: "Traité", color: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/20" },
  { value: "termine", label: "Terminé", color: "bg-slate-200 text-slate-600 ring-slate-300" },
];
const KANBAN_COLUMNS = STATUS_OPTIONS.slice(0, 4);
const statusMeta = (s: string) => STATUS_OPTIONS.find((x) => x.value === s) || STATUS_OPTIONS[0];

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

/* ============== Hooks données ============== */
const PAGE_SIZE = 25;

function useRequestsData(filters: {
  search: string;
  types: RequestType[];
  statuses: string[];
  period: string;
  includeArchived: boolean;
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
        if (filters.statuses.length) q = q.in("status", filters.statuses);
        if (!filters.includeArchived) q = q.is("archived_at", null);
        const { data, error } = await q;
        if (error) throw error;
        return (data || []).map((c: any): UnifiedRequest => ({
          id: c.id, kind: "contact", created_at: c.created_at,
          last_activity_at: c.last_activity_at || c.created_at,
          status: c.status || "nouveau", archived_at: c.archived_at,
          source: c.source || "", name: c.name, email: c.email, phone: c.phone,
          company: c.company, sector: c.sector, budget_estimate: c.budget_estimate,
          message: c.message, type: c.type, service: c.service, raw: c,
        }));
      };

      const buildQuote = async () => {
        let q = supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(500);
        if (since) q = q.gte("created_at", since);
        if (filters.statuses.length) q = q.in("status", filters.statuses);
        if (!filters.includeArchived) q = q.is("archived_at", null);
        const { data, error } = await q;
        if (error) throw error;
        return (data || []).map((c: any): UnifiedRequest => ({
          id: c.id, kind: "quote", created_at: c.created_at,
          last_activity_at: c.last_activity_at || c.created_at,
          status: c.status || "nouveau", archived_at: c.archived_at,
          source: c.source || "", name: c.name, email: c.email, phone: c.phone,
          company: c.company, profile: c.profile, project_desc: c.project_desc,
          budget: c.budget, deadline: c.deadline, expectations: c.expectations || [],
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

      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        all = all.filter((r) =>
          [r.name, r.email, r.phone, r.company, r.message, r.project_desc, r.profile, r.budget, r.budget_estimate, r.sector, r.service, r.type, r.source]
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
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className={`px-2 py-0.5 rounded-full text-[10px] font-mono cursor-pointer focus:outline-none ring-1 border-0 ${meta.color} ${compact ? "" : "min-w-[110px]"}`}
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
    if (error) toast.error("Erreur"); else { onUpdate(); queryClient.invalidateQueries({ queryKey: ["admin_requests_unified"] }); }
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
    // refresh last_activity_at on the parent record
    await supabase.from(table).update({ last_activity_at: new Date().toISOString() }).eq("id", req.id);
    queryClient.invalidateQueries({ queryKey: ["admin_requests_unified"] });
  };

  const archive = async () => {
    await updateField({ archived_at: req.archived_at ? null : new Date().toISOString() });
    toast.success(req.archived_at ? "Désarchivée" : "Archivée");
  };

  const replyMailto = () => {
    if (!req.email) return toast.error("Pas d'email pour ce contact");
    const subject = `Re: votre demande Must Agence${req.kind === "quote" && req.profile ? ` (${req.profile})` : req.type ? ` (${req.type})` : ""}`;
    const body = `Bonjour ${req.name || ""},\n\nMerci pour votre demande reçue le ${fmtDate(req.created_at)}.\n\n--\nL'équipe Must Agence`;
    window.open(`mailto:${req.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const copyInfo = () => {
    const lines = [
      `Type: ${req.kind === "quote" ? "Devis" : "Contact"}`,
      `Nom: ${req.name || "—"}`, `Email: ${req.email || "—"}`,
      `Téléphone: ${req.phone || "—"}`, `Entreprise: ${req.company || "—"}`,
      req.profile && `Profil: ${req.profile}`,
      req.project_desc && `Projet: ${req.project_desc}`,
      req.budget && `Budget: ${req.budget}`,
      req.budget_estimate && `Budget: ${req.budget_estimate}`,
      req.deadline && `Échéance: ${req.deadline}`,
      req.expectations?.length && `Attentes: ${req.expectations.join(", ")}`,
      req.sector && `Secteur: ${req.sector}`,
      req.message && `Message: ${req.message}`,
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(lines);
    toast.success("Copié dans le presse-papier");
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="ml-auto relative w-full sm:max-w-[520px] bg-white border-l border-slate-200 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 px-5 py-4 border-b border-slate-200 bg-white/95 backdrop-blur flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <TypeBadge kind={req.kind} />
              <StatusPill value={req.status} onChange={(s) => updateField({ status: s })} />
              {req.source && <span className="text-[10px] font-mono text-slate-400 uppercase">{req.source}</span>}
              {req.archived_at && <span className="text-[10px] font-mono text-amber-600 uppercase">Archivée</span>}
            </div>
            <h3 className="font-clash text-lg font-bold text-slate-900 truncate">{req.name || req.profile || "—"}</h3>
            <p className="text-xs text-slate-500">{fmtDate(req.created_at)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100"><X size={18} /></button>
        </div>

        {/* Quick actions */}
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

        {/* Coordonnées */}
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

        {/* Demande */}
        <section className="px-5 py-4 border-b border-slate-100">
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-2">
            {req.kind === "quote" ? "Demande de devis" : "Message"}
          </h4>
          {req.kind === "quote" ? (
            <dl className="space-y-2 text-sm">
              {req.profile && <div><dt className="text-slate-500 text-xs">Profil</dt><dd className="text-slate-900">{req.profile}</dd></div>}
              {req.budget && <div><dt className="text-slate-500 text-xs">Budget</dt><dd className="text-slate-900 font-medium">{req.budget}</dd></div>}
              {req.deadline && <div><dt className="text-slate-500 text-xs">Échéance</dt><dd className="text-slate-900">{req.deadline}</dd></div>}
              {req.project_desc && <div><dt className="text-slate-500 text-xs">Projet</dt><dd className="text-slate-700 whitespace-pre-wrap">{req.project_desc}</dd></div>}
              {req.expectations?.length ? (
                <div>
                  <dt className="text-slate-500 text-xs mb-1">Attentes</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {req.expectations.map((e) => (
                      <span key={e} className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-mono">{e}</span>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <dl className="space-y-2 text-sm">
              {req.type && <div><dt className="text-slate-500 text-xs">Type de demande</dt><dd className="text-slate-900">{req.type}</dd></div>}
              {req.sector && <div><dt className="text-slate-500 text-xs">Secteur</dt><dd className="text-slate-900">{req.sector}</dd></div>}
              {req.budget_estimate && <div><dt className="text-slate-500 text-xs">Budget estimé</dt><dd className="text-slate-900 font-medium">{req.budget_estimate}</dd></div>}
              {req.message && <div><dt className="text-slate-500 text-xs">Message</dt><dd className="text-slate-700 whitespace-pre-wrap">{req.message}</dd></div>}
            </dl>
          )}
        </section>

        {/* Notes internes */}
        <section className="px-5 py-4">
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-3">Notes internes ({notes.length})</h4>
          <div className="flex gap-2 mb-3">
            <textarea
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder="Ajouter une note privée…"
              rows={2}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-slate-400 resize-none"
            />
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

/* ============== Liste compacte ============== */
function RequestListRow({ req, onClick, onStatus, onArchive }: { req: UnifiedRequest; onClick: () => void; onStatus: (s: string) => void; onArchive: () => void }) {
  const summary = req.kind === "quote"
    ? [req.profile, req.budget, req.expectations?.join(" · ")].filter(Boolean).join(" — ")
    : [req.type, req.sector, req.budget_estimate].filter(Boolean).join(" — ") || req.message;
  return (
    <button onClick={onClick} className="w-full text-left grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
      <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 flex items-center justify-center font-medium text-xs uppercase">
        {(req.name || req.profile || "?").charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <TypeBadge kind={req.kind} />
          <span className="text-sm font-medium text-slate-900 truncate">{req.name || req.profile || "Sans nom"}</span>
          {req.archived_at && <Archive size={11} className="text-amber-500" />}
        </div>
        <p className="text-xs text-slate-500 truncate">{summary}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{req.email || "—"} · {fmtRelative(req.created_at)}</p>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        <StatusPill value={req.status} onChange={onStatus} compact />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onArchive(); }}
          title={req.archived_at ? "Désarchiver" : "Archiver"}
          className="p-2 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors"
        >
          {req.archived_at ? <ArchiveRestore size={14} /> : <Archive size={14} />}
        </button>
        <ChevronRight size={14} className="text-slate-300" />
      </div>
    </button>
  );
}

/* ============== Kanban card ============== */
function KanbanCard({ req, onClick, onArchive }: { req: UnifiedRequest; onClick: () => void; onArchive: () => void }) {
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", JSON.stringify({ id: req.id, kind: req.kind }))}
      onClick={onClick}
      className="cursor-pointer p-3 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <TypeBadge kind={req.kind} />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onArchive(); }}
          title="Archiver"
          className="p-1.5 rounded-md text-slate-300 hover:text-amber-700 hover:bg-amber-50 transition-colors"
        >
          <Archive size={12} />
        </button>
        <span className="text-[10px] text-slate-400 ml-auto">{fmtRelative(req.created_at)}</span>
      </div>
      <p className="text-sm font-medium text-slate-900 truncate">{req.name || req.profile || "Sans nom"}</p>
      <p className="text-xs text-slate-500 truncate mt-0.5">
        {req.kind === "quote" ? (req.budget || req.project_desc) : (req.type || req.message)}
      </p>
      {req.company && <p className="text-[10px] text-slate-400 mt-1 truncate flex items-center gap-1"><Building2 size={9} />{req.company}</p>}
    </div>
  );
}

/* ============== KPI Strip ============== */
function KpiTile({ label, value, sub, icon: Icon, accent, onClick, active }: {
  label: string; value: number | string; sub?: string; icon: any;
  accent: "blue" | "rose" | "emerald" | "slate"; onClick?: () => void; active?: boolean;
}) {
  const accents = {
    blue: "from-blue-500/10 to-blue-500/0 text-blue-700 ring-blue-200",
    rose: "from-rose-500/10 to-rose-500/0 text-rose-700 ring-rose-200",
    emerald: "from-emerald-500/10 to-emerald-500/0 text-emerald-700 ring-emerald-200",
    slate: "from-slate-500/10 to-slate-500/0 text-slate-700 ring-slate-200",
  }[accent];
  return (
    <button
      type="button" onClick={onClick}
      className={`group relative overflow-hidden text-left rounded-2xl border bg-white p-4 transition-all w-full ${
        active ? "border-slate-900 shadow-md" : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accents.split(" ").slice(0, 2).join(" ")} opacity-60 pointer-events-none`} />
      <div className="relative flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-white ring-1 ${accents.split(" ").slice(2).join(" ")}`}><Icon size={15} /></div>
        {sub && <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{sub}</span>}
      </div>
      <p className="relative text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="relative font-clash text-3xl font-bold text-slate-900 tabular-nums leading-none">{value}</p>
    </button>
  );
}

/* ============== Priority widget ============== */
function priorityScore(r: UnifiedRequest): number {
  // Higher = more urgent. Combines age + budget + status.
  const ageHours = (Date.now() - new Date(r.created_at).getTime()) / 3600000;
  const ageScore = Math.min(48, ageHours) * 2; // up to 96 pts
  const budgetTxt = r.budget || r.budget_estimate || "";
  const num = parseInt(String(budgetTxt).replace(/[^\d]/g, "")) || 0;
  const budgetScore = Math.min(100, num / 100); // 10k → 100 pts
  const statusBoost = r.status === "nouveau" ? 50 : r.status === "en_cours" ? 20 : 0;
  return ageScore + budgetScore + statusBoost;
}

function PriorityList({ requests, onSelect }: { requests: UnifiedRequest[]; onSelect: (r: UnifiedRequest) => void }) {
  const top = useMemo(() => {
    return [...requests]
      .filter((r) => !r.archived_at && r.status !== "termine" && r.status !== "traite")
      .sort((a, b) => priorityScore(b) - priorityScore(a))
      .slice(0, 6);
  }, [requests]);

  if (top.length === 0) {
    return <p className="text-xs text-slate-400 text-center py-8">Tout est sous contrôle ✨</p>;
  }
  return (
    <ul className="space-y-1.5">
      {top.map((r, i) => {
        const ageH = (Date.now() - new Date(r.created_at).getTime()) / 3600000;
        const isHot = ageH > 24 && r.status === "nouveau";
        return (
          <li key={`${r.kind}-${r.id}`}>
            <button
              onClick={() => onSelect(r)}
              className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <span className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                i === 0 ? "bg-rose-100 text-rose-700" : i < 3 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
              }`}>
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-slate-900 truncate">{r.name || r.profile || "—"}</p>
                  {isHot && <Flame size={11} className="text-rose-500 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {r.kind === "quote" ? (r.budget || "Devis") : (r.type || "Contact")} · {fmtRelative(r.created_at)}
                </p>
              </div>
              <ChevronRight size={13} className="text-slate-300 group-hover:text-slate-500" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ============== Activity feed ============== */
function ActivityFeed({ requests, onSelect }: { requests: UnifiedRequest[]; onSelect: (r: UnifiedRequest) => void }) {
  const items = useMemo(() => {
    return [...requests]
      .sort((a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime())
      .slice(0, 12);
  }, [requests]);
  if (items.length === 0) return <p className="text-xs text-slate-400 text-center py-6">Aucune activité.</p>;
  return (
    <ul className="space-y-1">
      {items.map((r) => (
        <li key={`${r.kind}-${r.id}`}>
          <button onClick={() => onSelect(r)}
            className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-50 transition-colors">
            <TypeBadge kind={r.kind} />
            <span className="text-xs text-slate-700 truncate flex-1">{r.name || r.profile || "—"}</span>
            <StatusPill value={r.status} />
            <span className="text-[10px] font-mono text-slate-400 shrink-0 tabular-nums">{fmtRelative(r.last_activity_at)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/* ============== Table view ============== */
function TableView({ rows, onSelect, onStatus, onArchive }: {
  rows: UnifiedRequest[]; onSelect: (r: UnifiedRequest) => void;
  onStatus: (r: UnifiedRequest, s: string) => void; onArchive: (r: UnifiedRequest) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-3 py-2.5 text-left">Type</th>
              <th className="px-3 py-2.5 text-left">Nom</th>
              <th className="px-3 py-2.5 text-left">Email</th>
              <th className="px-3 py-2.5 text-left">Source</th>
              <th className="px-3 py-2.5 text-left">Budget</th>
              <th className="px-3 py-2.5 text-left">Statut</th>
              <th className="px-3 py-2.5 text-left">Activité</th>
              <th className="px-3 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.kind}-${r.id}`} className="border-t border-slate-100 hover:bg-slate-50/60 cursor-pointer" onClick={() => onSelect(r)}>
                <td className="px-3 py-2.5"><TypeBadge kind={r.kind} /></td>
                <td className="px-3 py-2.5 font-medium text-slate-900 truncate max-w-[180px]">{r.name || r.profile || "—"}</td>
                <td className="px-3 py-2.5 text-slate-600 truncate max-w-[200px]">{r.email || "—"}</td>
                <td className="px-3 py-2.5 text-[11px] font-mono text-slate-500 uppercase">{r.source || "—"}</td>
                <td className="px-3 py-2.5 text-slate-700 tabular-nums">{r.budget || r.budget_estimate || "—"}</td>
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <StatusPill value={r.status} onChange={(s) => onStatus(r, s)} compact />
                </td>
                <td className="px-3 py-2.5 text-[11px] text-slate-500 tabular-nums">{fmtRelative(r.last_activity_at)}</td>
                <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onArchive(r)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-amber-700 hover:bg-amber-50">
                    {r.archived_at ? <ArchiveRestore size={13} /> : <Archive size={13} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============== Main ============== */
type ViewMode = "bento" | "kanban" | "list" | "table";

export default function RequestsPanel() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<ViewMode>("bento");
  const [search, setSearch] = useState("");
  const [types, setTypes] = useState<RequestType[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [period, setPeriod] = useState("90");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [selected, setSelected] = useState<UnifiedRequest | null>(null);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data: requests = [], isLoading } = useRequestsData({
    search, types, statuses, period, includeArchived,
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

  const kpis = useMemo(() => {
    const now = Date.now();
    const open = requests.filter((r) => !r.archived_at);
    const nouveau = open.filter((r) => r.status === "nouveau").length;
    const enRetard = open.filter((r) => r.status === "nouveau" && (now - new Date(r.created_at).getTime()) > 24 * 3600000).length;
    const cetteSemaine = requests.filter((r) => (now - new Date(r.created_at).getTime()) < 7 * 86400000).length;
    return { nouveau, enRetard, cetteSemaine, total: requests.length };
  }, [requests]);

  const counts = useMemo(() => {
    const byStatus: Record<string, number> = {};
    requests.forEach((r) => { byStatus[r.status] = (byStatus[r.status] || 0) + 1; });
    return byStatus;
  }, [requests]);

  const paginated = useMemo(() => requests.slice(0, page * PAGE_SIZE), [requests, page]);
  const hasMore = paginated.length < requests.length;

  const exportCSV = () => {
    if (!requests.length) return;
    const headers = ["type", "date", "statut", "source", "nom", "email", "telephone", "entreprise", "profil", "budget", "secteur", "type_demande", "echeance", "attentes", "message"];
    const sep = ";";
    const escape = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = requests.map((r) => [
      r.kind === "quote" ? "Devis" : "Contact",
      new Date(r.created_at).toLocaleString("fr-FR"),
      statusMeta(r.status).label, r.source, r.name, r.email, r.phone, r.company,
      r.profile, r.budget || r.budget_estimate, r.sector, r.type, r.deadline,
      r.expectations?.join(" | "), (r.message || r.project_desc || "").replace(/\n/g, " "),
    ].map(escape).join(sep));
    const csv = "\uFEFF" + [headers.join(sep), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `demandes-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const toggle = <T,>(arr: T[], v: T): T[] => arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const renderKanban = (compact = false) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${compact ? "lg:grid-cols-4 gap-2.5" : "lg:grid-cols-4 gap-3"}`}>
      {KANBAN_COLUMNS.map((col) => {
        const items = requests.filter((r) => r.status === col.value && !r.archived_at);
        return (
          <div key={col.value}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const data = JSON.parse(e.dataTransfer.getData("text/plain"));
              const req = requests.find((r) => r.id === data.id && r.kind === data.kind);
              if (req && req.status !== col.value) updateStatus.mutate({ req, status: col.value });
            }}
            className={`rounded-xl bg-slate-50 border border-slate-200 ${compact ? "p-2.5" : "p-3"} min-h-[180px]`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ring-1 ${col.color}`}>{col.label}</span>
              <span className="text-[10px] font-mono text-slate-400 tabular-nums">{items.length}</span>
            </div>
            <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-0.5">
              {items.slice(0, compact ? 4 : 100).map((r) => (
                <KanbanCard key={`${r.kind}-${r.id}`} req={r}
                  onClick={() => setSelected(r)}
                  onArchive={() => archiveRequest.mutate(r)} />
              ))}
              {items.length === 0 && <p className="text-[11px] text-slate-400 text-center py-3">Vide</p>}
              {compact && items.length > 4 && (
                <button onClick={() => setView("kanban")}
                  className="w-full text-[10px] font-mono text-slate-500 hover:text-slate-900 py-1">
                  +{items.length - 4} de plus
                </button>
              )}
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
              placeholder="Rechercher nom, email, téléphone, message…"
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
              { v: "bento", l: "Bento", I: LayoutGrid },
              { v: "kanban", l: "Kanban", I: Kanban },
              { v: "list", l: "Liste", I: ListChecks },
              { v: "table", l: "Tableau", I: Table2 },
            ] as const).map(({ v, l, I }) => (
              <button key={v} onClick={() => setView(v as ViewMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${view === v ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-900"}`}>
                <I size={13} /> {l}
              </button>
            ))}
          </div>

          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border transition-all ${showFilters || types.length || statuses.length ? "border-slate-900 text-slate-900 bg-slate-50" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            <Filter size={13} /> Filtres {(types.length + statuses.length) > 0 && <span className="px-1.5 rounded-full bg-slate-900 text-white text-[10px]">{types.length + statuses.length}</span>}
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
            {(types.length > 0 || statuses.length > 0) && (
              <button onClick={() => { setTypes([]); setStatuses([]); setPage(1); }}
                className="text-xs text-slate-500 hover:text-slate-900 underline">Réinitialiser les filtres</button>
            )}
          </div>
        )}
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiTile label="Nouveau" value={kpis.nouveau} sub="à traiter" icon={Inbox} accent="blue"
          onClick={() => { setStatuses(["nouveau"]); setPage(1); }} active={statuses.length === 1 && statuses[0] === "nouveau"} />
        <KpiTile label="En retard" value={kpis.enRetard} sub=">24h" icon={Flame} accent="rose" />
        <KpiTile label="Cette semaine" value={kpis.cetteSemaine} sub="reçues" icon={TrendingUp} accent="emerald" />
        <KpiTile label="Total visible" value={kpis.total} sub="filtré" icon={Sparkles} accent="slate" />
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
      ) : view === "bento" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Big Kanban tile */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-slate-900 text-white"><Kanban size={13} /></div>
                <h3 className="font-clash text-sm font-bold text-slate-900">Pipeline</h3>
              </div>
              <button onClick={() => setView("kanban")} className="text-[10px] font-mono text-slate-500 hover:text-slate-900 uppercase tracking-wider">
                Voir tout →
              </button>
            </div>
            {renderKanban(true)}
          </div>

          {/* Priority widget */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-md bg-rose-100 text-rose-700"><Zap size={13} /></div>
              <h3 className="font-clash text-sm font-bold text-slate-900">Priorités du jour</h3>
            </div>
            <PriorityList requests={requests} onSelect={setSelected} />
          </div>

          {/* Activity feed full width */}
          <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700"><Activity size={13} /></div>
                <h3 className="font-clash text-sm font-bold text-slate-900">Activité récente</h3>
              </div>
              <div className="flex gap-3 text-[10px] font-mono text-slate-500">
                {STATUS_OPTIONS.slice(0, 4).map((s) => counts[s.value] ? (
                  <span key={s.value} className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${s.color.split(" ")[0]}`} />
                    {s.label} · <span className="tabular-nums">{counts[s.value]}</span>
                  </span>
                ) : null)}
              </div>
            </div>
            <ActivityFeed requests={requests} onSelect={setSelected} />
          </div>
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
      ) : view === "table" ? (
        <>
          <TableView rows={paginated} onSelect={setSelected}
            onStatus={(r, s) => updateStatus.mutate({ req: r, status: s })}
            onArchive={(r) => archiveRequest.mutate(r)} />
          {hasMore && (
            <div className="text-center">
              <button onClick={() => setPage(page + 1)}
                className="text-xs font-mono text-slate-600 hover:text-slate-900">
                Charger plus ({requests.length - paginated.length} restant)
              </button>
            </div>
          )}
        </>
      ) : (
        renderKanban(false)
      )}

      {selected && <RequestDrawer req={selected} onClose={() => setSelected(null)} onUpdate={() => {}} />}
    </div>
  );
}
