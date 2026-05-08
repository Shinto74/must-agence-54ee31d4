import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  MessageSquare, FileText, Mail, Users, Clock, CheckCircle2,
  Download, ChevronDown, ChevronUp, ExternalLink, CreditCard, TrendingUp,
} from "lucide-react";

/* ---------- helpers ---------- */
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

const STATUS_OPTIONS = [
  { value: "nouveau", label: "Nouveau", color: "bg-blue-500/15 text-blue-600" },
  { value: "en_cours", label: "En cours", color: "bg-amber-500/15 text-amber-600" },
  { value: "traite", label: "Traité", color: "bg-emerald-500/15 text-emerald-600" },
  { value: "termine", label: "Terminé", color: "bg-slate-200 text-slate-600" },
];
const getStatusStyle = (s: string) => STATUS_OPTIONS.find((o) => o.value === s) || STATUS_OPTIONS[0];

/* ---------- KPI ---------- */
function KpiCard({
  label, value, sub, icon: Icon, accent = "indigo", onClick,
}: {
  label: string; value: string; sub?: string; icon: any;
  accent?: "indigo" | "emerald" | "amber" | "slate"; onClick?: () => void;
}) {
  const accents = {
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    slate: "bg-slate-100 text-slate-600 ring-slate-200",
  }[accent];
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm transition-all w-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ring-1 ${accents}`}><Icon size={18} /></div>
        {sub && <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{sub}</span>}
      </div>
      <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="font-clash text-3xl font-bold text-slate-900 tabular-nums">{value}</p>
    </button>
  );
}

/* ---------- Status pill select ---------- */
function StatusSelect({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  const current = getStatusStyle(value);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-2 py-0.5 rounded-full text-[10px] font-mono border-0 cursor-pointer focus:outline-none ${current.color}`}
    >
      {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
    </select>
  );
}

/* ---------- Quote row ---------- */
function QuoteCard({ quote: q, onStatusChange }: { quote: any; onStatusChange: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900">{q.profile || "—"} — {q.budget || "—"}</p>
          <p className="text-xs text-slate-500 truncate">{q.project_desc}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <StatusSelect value={q.status || "nouveau"} onChange={onStatusChange} />
          <span className="text-[10px] text-slate-400">{new Date(q.created_at).toLocaleDateString("fr-FR")}</span>
          {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2 border-t border-slate-200 pt-3">
          <p className="text-sm text-slate-700">{q.project_desc}</p>
          {q.deadline && <p className="text-xs text-slate-500">📅 Échéance : {q.deadline}</p>}
          {q.expectations?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {q.expectations.map((e: string) => (
                <span key={e} className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-mono">{e}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============== Main ============== */
export default function DashboardPanel() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"devis" | "contacts">("devis");

  const { data: contacts = [] } = useQuery({
    queryKey: ["admin_contact_submissions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ["admin_quote_requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: clientsCount = 0 } = useQuery({
    queryKey: ["admin_dashboard_clients_count"],
    queryFn: async () => {
      const { count } = await supabase.from("clients").select("id", { count: "exact", head: true });
      return count || 0;
    },
  });

  const updateContactStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_contact_submissions"] }),
  });
  const updateQuoteStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_quote_requests"] }),
  });

  /* --- stats --- */
  const stats = useMemo(() => {
    const last30 = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const isOpen = (s: string) => s === "nouveau" || s === "en_cours";
    const pendingQuotes = quotes.filter((q: any) => isOpen(q.status || "nouveau")).length;
    const pendingContacts = contacts.filter((c: any) => isOpen(c.status || "nouveau")).length;
    const last30Quotes = quotes.filter((q: any) => new Date(q.created_at).getTime() >= last30).length;
    const last30Contacts = contacts.filter((c: any) => new Date(c.created_at).getTime() >= last30).length;

    // demandes par jour 14j
    const days: { date: string; total: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
      const next = new Date(d); next.setDate(d.getDate() + 1);
      const total = [...quotes, ...contacts].filter((x: any) => {
        const t = new Date(x.created_at).getTime();
        return t >= d.getTime() && t < next.getTime();
      }).length;
      days.push({ date: d.toISOString(), total });
    }
    const maxDay = Math.max(1, ...days.map((d) => d.total));

    return { pendingQuotes, pendingContacts, last30Quotes, last30Contacts, days, maxDay };
  }, [quotes, contacts]);

  const exportCSV = (type: "contacts" | "devis") => {
    const items = type === "contacts" ? contacts : quotes;
    if (!items.length) return;
    const keys = Object.keys(items[0]);
    const csv = [
      keys.join(","),
      ...items.map((item: any) => keys.map((k) => `"${String(item[k] ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${type}-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const recent = useMemo(() => {
    const acts = [
      ...quotes.slice(0, 8).map((q: any) => ({
        type: "quote", label: `Devis — ${q.profile || "—"}`, sub: q.budget || q.project_desc?.slice(0, 60) || "—",
        date: q.created_at, status: q.status,
      })),
      ...contacts.slice(0, 8).map((c: any) => ({
        type: "contact", label: c.name, sub: c.email, date: c.created_at, status: c.status,
      })),
    ];
    return acts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  }, [quotes, contacts]);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Devis à traiter" value={String(stats.pendingQuotes)} sub="ouverts" icon={FileText} accent="amber" onClick={() => setTab("devis")} />
        <KpiCard label="Contacts à traiter" value={String(stats.pendingContacts)} sub="ouverts" icon={Mail} accent="indigo" onClick={() => setTab("contacts")} />
        <KpiCard label="Demandes 30j" value={String(stats.last30Quotes + stats.last30Contacts)} sub="total" icon={TrendingUp} accent="emerald" />
        <KpiCard label="Clients référencés" value={String(clientsCount)} sub="actifs" icon={Users} accent="slate" />
      </div>

      {/* Activité 14j + Stripe info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-clash text-base font-bold text-slate-900">Demandes — 14 derniers jours</h3>
              <p className="text-xs text-slate-500 mt-0.5">Devis + contacts cumulés par jour</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">demandes</span>
          </div>
          <div className="flex items-end gap-1.5 h-40">
            {stats.days.map((d, i) => {
              const h = (d.total / stats.maxDay) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-slate-600 whitespace-nowrap">
                    {d.total}
                  </div>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-indigo-400 hover:from-indigo-600 hover:to-indigo-500 transition-colors min-h-[2px]"
                    style={{ height: `${Math.max(2, h)}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-400">
            <span>J-13</span><span>Aujourd'hui</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-violet-50 text-violet-600 ring-1 ring-violet-100">
              <CreditCard size={16} />
            </div>
            <h3 className="font-clash text-base font-bold text-slate-900">Paiements Stripe</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Les paiements passent désormais directement par les liens Stripe configurés sur chaque pack.
            Consultez les transactions, remboursements et exports depuis votre dashboard Stripe.
          </p>
          <a
            href="https://dashboard.stripe.com/payments"
            target="_blank" rel="noopener noreferrer"
            className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-mono uppercase tracking-wider hover:bg-slate-800 transition-colors"
          >
            Ouvrir Stripe <ExternalLink size={13} />
          </a>
          <p className="text-[10px] text-slate-400 mt-3">
            Modifier un lien : <strong>Page Artiste → Packs</strong>
          </p>
        </div>
      </div>

      {/* Demandes : tabs + liste */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-200">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("devis")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                tab === "devis" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText size={14} /> Devis ({quotes.length})
            </button>
            <button
              onClick={() => setTab("contacts")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                tab === "contacts" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              <Mail size={14} /> Contacts ({contacts.length})
            </button>
          </div>
          <button
            onClick={() => exportCSV(tab)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Download size={13} /> Exporter CSV
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
          {tab === "devis" && (
            <>
              {quotes.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Aucune demande de devis.</p>}
              {quotes.map((q: any) => (
                <QuoteCard key={q.id} quote={q} onStatusChange={(s) => updateQuoteStatus.mutate({ id: q.id, status: s })} />
              ))}
            </>
          )}

          {tab === "contacts" && (
            <>
              {contacts.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Aucun message de contact.</p>}
              {contacts.map((c: any) => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.email}</p>
                      {c.phone && <p className="text-xs text-slate-500">{c.phone}</p>}
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-mono">{c.type}</span>
                      <StatusSelect value={c.status || "nouveau"} onChange={(s) => updateContactStatus.mutate({ id: c.id, status: s })} />
                      <p className="text-[10px] text-slate-400">{new Date(c.created_at).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                  {c.service && <p className="text-xs text-indigo-500 mb-1">Service : {c.service}</p>}
                  <p className="text-sm text-slate-600">{c.message}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Activité récente compacte */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-clash text-base font-bold text-slate-900">Activité récente</h3>
          <Clock size={14} className="text-slate-400" />
        </div>
        <div className="space-y-2">
          {recent.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">Aucune activité récente</p>
          ) : recent.map((a, i) => {
            const Icon = a.type === "quote" ? FileText : MessageSquare;
            const done = a.status === "traite" || a.status === "termine";
            return (
              <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="p-1.5 rounded-md bg-slate-100 text-slate-600 shrink-0 mt-0.5"><Icon size={12} /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-900 truncate">{a.label}</p>
                  <p className="text-[11px] text-slate-500 truncate">{a.sub}</p>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  {done ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Clock size={12} className="text-amber-500" />}
                  <span className="text-[10px] font-mono text-slate-400 mt-0.5">{fmtDate(a.date).split(",")[0]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
