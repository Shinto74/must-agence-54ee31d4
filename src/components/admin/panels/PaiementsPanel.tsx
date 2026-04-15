import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, Filter } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "En attente", color: "bg-yellow-500/20 text-yellow-400" },
  completed: { label: "Complété", color: "bg-green-500/20 text-green-400" },
  failed: { label: "Échoué", color: "bg-red-500/20 text-red-400" },
};

export default function PaiementsPanel() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = payments.filter((p: any) => {
    const matchSearch = !search || 
      p.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
      p.pack_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = filtered
    .filter((p: any) => p.status === "completed")
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
        <Loader2 size={16} className="animate-spin" /> Chargement…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total paiements" value={payments.length.toString()} />
        <StatCard label="Complétés" value={payments.filter((p: any) => p.status === "completed").length.toString()} />
        <StatCard label="En attente" value={payments.filter((p: any) => p.status === "pending").length.toString()} />
        <StatCard label="Revenus" value={`${(totalRevenue / 100).toFixed(0)}€`} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, pack…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-foreground focus:outline-none focus:border-primary/40"
        >
          <option value="all">Tous les statuts</option>
          <option value="completed">Complétés</option>
          <option value="pending">En attente</option>
          <option value="failed">Échoués</option>
        </select>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">Aucun paiement trouvé</p>
        )}
        {filtered.map((payment: any) => (
          <div key={payment.id} className="p-4 rounded-xl border border-border bg-surface hover:border-primary/20 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground truncate">{payment.customer_name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${STATUS_LABELS[payment.status]?.color || "bg-muted text-muted-foreground"}`}>
                    {STATUS_LABELS[payment.status]?.label || payment.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{payment.customer_email}</p>
                {payment.customer_phone && (
                  <p className="text-xs text-muted-foreground">{payment.customer_phone}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-primary font-clash">{(payment.amount / 100).toFixed(0)}€</p>
                <p className="text-[10px] text-muted-foreground font-mono">{payment.pack_name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(payment.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl border border-border bg-surface">
      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-clash font-bold text-foreground">{value}</p>
    </div>
  );
}
