import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Download, Mail, FileText, ChevronDown, ChevronUp } from "lucide-react";

export default function DemandesPanel() {
  const [subTab, setSubTab] = useState<"contacts" | "devis">("devis");

  const { data: contacts = [] } = useQuery({
    queryKey: ["admin_contact_submissions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ["admin_quote_requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const exportCSV = (type: "contacts" | "devis") => {
    const items = type === "contacts" ? contacts : quotes;
    if (!items.length) return;
    const keys = Object.keys(items[0]);
    const csv = [
      keys.join(","),
      ...items.map((item) => keys.map((k) => `"${String((item as any)[k] ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSubTab("devis")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all ${
            subTab === "devis" ? "bg-primary text-primary-foreground" : "bg-surface border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText size={14} /> Devis ({quotes.length})
        </button>
        <button
          onClick={() => setSubTab("contacts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all ${
            subTab === "contacts" ? "bg-primary text-primary-foreground" : "bg-surface border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mail size={14} /> Contacts ({contacts.length})
        </button>
      </div>

      {/* Export */}
      <button
        onClick={() => exportCSV(subTab)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Download size={14} /> Exporter en CSV
      </button>

      {subTab === "devis" && (
        <div className="space-y-3">
          {quotes.length === 0 && <p className="text-sm text-muted-foreground">Aucune demande de devis.</p>}
          {quotes.map((q) => (
            <QuoteCard key={q.id} quote={q} />
          ))}
        </div>
      )}

      {subTab === "contacts" && (
        <div className="space-y-3">
          {contacts.length === 0 && <p className="text-sm text-muted-foreground">Aucun message de contact.</p>}
          {contacts.map((c) => (
            <div key={c.id} className="p-4 rounded-xl border border-border bg-surface">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-mono">{c.type}</span>
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(c.created_at).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{c.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuoteCard({ quote: q }: { quote: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{q.profile} — {q.budget}</p>
          <p className="text-xs text-muted-foreground truncate">{q.project_desc}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="text-[10px] text-muted-foreground">{new Date(q.created_at).toLocaleDateString("fr-FR")}</span>
          {open ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
          <p className="text-sm text-foreground">{q.project_desc}</p>
          {q.deadline && <p className="text-xs text-muted-foreground">📅 Échéance : {q.deadline}</p>}
          {q.expectations && q.expectations.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {q.expectations.map((e: string) => (
                <span key={e} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-mono">{e}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
