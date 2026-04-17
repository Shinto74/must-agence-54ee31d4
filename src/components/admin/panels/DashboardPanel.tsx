import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, MessageSquare, CreditCard, Users, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useMemo } from "react";

const fmtEUR = (cents: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(cents / 100);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

function KpiCard({
  label, value, sub, icon: Icon, accent = "indigo",
}: { label: string; value: string; sub?: string; icon: any; accent?: "indigo" | "emerald" | "amber" | "slate" }) {
  const accents = {
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    slate: "bg-slate-100 text-slate-600 ring-slate-200",
  }[accent];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ring-1 ${accents}`}>
          <Icon size={18} />
        </div>
        {sub && <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{sub}</span>}
      </div>
      <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="font-clash text-3xl font-bold text-slate-900 tabular-nums">{value}</p>
    </div>
  );
}

export default function DashboardPanel() {
  const { data: payments = [] } = useQuery({
    queryKey: ["admin_dashboard_payments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("payments").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["admin_dashboard_contacts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(20);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ["admin_dashboard_quotes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(20);
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

  const stats = useMemo(() => {
    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const last30 = now.getTime() - 30 * 24 * 60 * 60 * 1000;

    const completedThisMonth = payments.filter(
      (p: any) => p.status === "completed" && new Date(p.created_at).getTime() >= startMonth
    );
    const revenueMonth = completedThisMonth.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    const paymentsLast30 = payments.filter((p: any) => new Date(p.created_at).getTime() >= last30);
    const pendingDemandes = [...contacts, ...quotes].filter((d: any) => d.status === "nouveau").length;

    // Sparkline data — paiements complétés par jour sur 14 jours
    const days: { date: string; total: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const total = payments
        .filter((p: any) => p.status === "completed" && new Date(p.created_at) >= d && new Date(p.created_at) < next)
        .reduce((s: number, p: any) => s + (p.amount || 0), 0);
      days.push({ date: d.toISOString(), total });
    }
    const maxDay = Math.max(1, ...days.map((d) => d.total));

    return { revenueMonth, paymentsLast30Count: paymentsLast30.length, pendingDemandes, days, maxDay };
  }, [payments, contacts, quotes]);

  // Activité récente — fusion paiements + demandes
  const activity = useMemo(() => {
    const acts: { type: string; label: string; sub: string; date: string; status?: string }[] = [];
    payments.slice(0, 8).forEach((p: any) =>
      acts.push({
        type: "payment",
        label: `${p.customer_name} — ${p.pack_name}`,
        sub: fmtEUR(p.amount),
        date: p.created_at,
        status: p.status,
      })
    );
    contacts.slice(0, 5).forEach((c: any) =>
      acts.push({ type: "contact", label: c.name, sub: c.email, date: c.created_at, status: c.status })
    );
    quotes.slice(0, 5).forEach((q: any) =>
      acts.push({ type: "quote", label: "Demande de devis", sub: q.profile || "—", date: q.created_at, status: q.status })
    );
    return acts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  }, [payments, contacts, quotes]);

  return (
    <div className="space-y-6">
      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="CA du mois" value={fmtEUR(stats.revenueMonth)} sub="completed" icon={TrendingUp} accent="emerald" />
        <KpiCard label="Demandes en attente" value={String(stats.pendingDemandes)} sub="à traiter" icon={MessageSquare} accent="amber" />
        <KpiCard label="Paiements 30j" value={String(stats.paymentsLast30Count)} sub="total" icon={CreditCard} accent="indigo" />
        <KpiCard label="Clients actifs" value={String(clientsCount)} sub="références" icon={Users} accent="slate" />
      </div>

      {/* Graph + Activité */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sparkline 14j */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-clash text-base font-bold text-slate-900">Revenus 14 derniers jours</h3>
              <p className="text-xs text-slate-500 mt-0.5">Paiements complétés par jour</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">EUR</span>
          </div>
          <div className="flex items-end gap-1.5 h-40">
            {stats.days.map((d, i) => {
              const h = (d.total / stats.maxDay) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-slate-600 whitespace-nowrap">
                    {fmtEUR(d.total)}
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
            <span>J-13</span>
            <span>Aujourd'hui</span>
          </div>
        </div>

        {/* Activité récente */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-clash text-base font-bold text-slate-900">Activité récente</h3>
            <Clock size={14} className="text-slate-400" />
          </div>
          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {activity.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Aucune activité récente</p>
            ) : (
              activity.map((a, i) => {
                const Icon =
                  a.type === "payment" ? CreditCard : a.type === "contact" ? MessageSquare : ArrowUpRight;
                const StatusIcon =
                  a.status === "completed" || a.status === "traite" || a.status === "termine"
                    ? CheckCircle2
                    : a.status === "failed"
                      ? AlertCircle
                      : Clock;
                const statusColor =
                  a.status === "completed" || a.status === "traite" || a.status === "termine"
                    ? "text-emerald-500"
                    : a.status === "failed"
                      ? "text-red-500"
                      : "text-amber-500";
                return (
                  <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="p-1.5 rounded-md bg-slate-100 text-slate-600 shrink-0 mt-0.5">
                      <Icon size={12} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-900 truncate">{a.label}</p>
                      <p className="text-[11px] text-slate-500 truncate">{a.sub}</p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <StatusIcon size={12} className={statusColor} />
                      <span className="text-[10px] font-mono text-slate-400 mt-0.5">{fmtDate(a.date).split(",")[0]}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
