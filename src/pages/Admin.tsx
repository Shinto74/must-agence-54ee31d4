import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Users, Music, Building2, Package, BarChart3, Briefcase, FileText, MessageSquare, Settings } from "lucide-react";

type Tab = "equipe" | "artistes" | "clients" | "packs" | "stats" | "services" | "portfolio" | "demandes" | "settings";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("demandes");

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Chargement...</p></div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "demandes", label: "Demandes", icon: <MessageSquare size={16} /> },
    { key: "equipe", label: "Équipe", icon: <Users size={16} /> },
    { key: "artistes", label: "Artistes", icon: <Music size={16} /> },
    { key: "clients", label: "Clients", icon: <Building2 size={16} /> },
    { key: "packs", label: "Packs", icon: <Package size={16} /> },
    { key: "stats", label: "Statistiques", icon: <BarChart3 size={16} /> },
    { key: "services", label: "Services", icon: <Briefcase size={16} /> },
    { key: "portfolio", label: "Portfolio", icon: <FileText size={16} /> },
    { key: "settings", label: "Paramètres", icon: <Settings size={16} /> },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-clash text-3xl font-bold text-foreground">Administration</h1>
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-8 bg-surface rounded-lg p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-mono uppercase tracking-wider transition-all ${
                tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "demandes" && <DemandesPanel />}
        {tab === "equipe" && <CrudPanel table="team_members" columns={["name", "initials", "role", "description"]} label="Membre" />}
        {tab === "artistes" && <ArtistesPanel />}
        {tab === "clients" && <ClientsPanel />}
        {tab === "packs" && <CrudPanel table="packs" columns={["number", "name", "subtitle", "price", "price_suffix", "featured", "badge", "bonus", "reassurance"]} label="Pack" />}
        {tab === "stats" && <CrudPanel table="stats" columns={["page", "value", "label", "suffix"]} label="Statistique" />}
        {tab === "services" && <ServicesPanel />}
        {tab === "portfolio" && <CrudPanel table="portfolio_cases" columns={["icon", "tag", "title", "description"]} label="Cas d'étude" />}
        {tab === "settings" && <SettingsPanel />}
      </div>
    </div>
  );
};

// ── Generic CRUD Panel ──
function CrudPanel({ table, columns, label }: { table: string; columns: string[]; label: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table as any).select("*").order("display_order");
      if (error) throw error;
      return data as any[];
    },
  });

  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const record = { ...editing };
    delete record.created_at;
    delete record.updated_at;
    if (record.id) {
      await supabase.from(table as any).update(record).eq("id", record.id);
    } else {
      delete record.id;
      await supabase.from(table as any).insert(record as any);
    }
    setSaving(false);
    setEditing(null);
    qc.invalidateQueries({ queryKey: [table] });
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    await supabase.from(table as any).delete().eq("id", id);
    qc.invalidateQueries({ queryKey: [table] });
  };

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-clash text-xl font-bold text-foreground">{label}s</h2>
        <button
          onClick={() => setEditing(columns.reduce((acc, c) => ({ ...acc, [c]: c === "featured" ? false : "" }), { display_order: (data?.length || 0) }))}
          className="px-4 py-2 rounded-pill bg-primary text-primary-foreground text-xs font-mono uppercase"
        >
          + Ajouter
        </button>
      </div>

      {editing && (
        <div className="bg-surface border border-border rounded-xl p-6 mb-6 space-y-3">
          {columns.map((col) => (
            <div key={col}>
              <label className="text-xs font-mono text-muted-foreground uppercase">{col}</label>
              {col === "featured" ? (
                <div>
                  <input type="checkbox" checked={!!editing[col]} onChange={(e) => setEditing({ ...editing, [col]: e.target.checked })} />
                </div>
              ) : col === "description" || col === "reassurance" || col === "subtitle" ? (
                <textarea
                  value={editing[col] || ""}
                  onChange={(e) => setEditing({ ...editing, [col]: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/40 resize-none"
                  rows={3}
                />
              ) : (
                <input
                  type="text" value={editing[col] || ""}
                  onChange={(e) => setEditing({ ...editing, [col]: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/40"
                />
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="px-4 py-2 rounded-pill bg-primary text-primary-foreground text-xs font-mono uppercase disabled:opacity-50">
              {saving ? "..." : "Enregistrer"}
            </button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-pill border border-border text-foreground text-xs font-mono uppercase">
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {data?.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground font-medium truncate">
                {item.name || item.title || item.key || item.value}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {item.role || item.description || item.label || item.tag || ""}
              </p>
            </div>
            <div className="flex gap-2 shrink-0 ml-4">
              <button onClick={() => setEditing({ ...item })} className="text-xs text-primary hover:underline font-mono">Modifier</button>
              <button onClick={() => remove(item.id)} className="text-xs text-destructive hover:underline font-mono">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Demandes Panel ──
function DemandesPanel() {
  const { data: contacts } = useQuery({
    queryKey: ["contact_submissions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const { data: quotes } = useQuery({
    queryKey: ["quote_requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-clash text-xl font-bold text-foreground mb-4">Messages de contact</h2>
        {contacts?.length === 0 && <p className="text-sm text-muted-foreground">Aucun message.</p>}
        <div className="space-y-2">
          {contacts?.map((c) => (
            <div key={c.id} className="p-4 rounded-lg border border-border bg-surface">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{c.name} — {c.email}</span>
                <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString("fr-FR")}</span>
              </div>
              <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-mono mb-2">{c.type}</span>
              <p className="text-sm text-muted-foreground">{c.message}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-clash text-xl font-bold text-foreground mb-4">Demandes de devis</h2>
        {quotes?.length === 0 && <p className="text-sm text-muted-foreground">Aucune demande.</p>}
        <div className="space-y-2">
          {quotes?.map((q) => (
            <div key={q.id} className="p-4 rounded-lg border border-border bg-surface">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{q.profile} — {q.budget}</span>
                <span className="text-xs text-muted-foreground">{new Date(q.created_at).toLocaleDateString("fr-FR")}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{q.project_desc}</p>
              {q.deadline && <p className="text-xs text-muted-foreground">Échéance: {q.deadline}</p>}
              {q.expectations && q.expectations.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {q.expectations.map((e: string) => (
                    <span key={e} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-mono">{e}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Artistes Panel ──
function ArtistesPanel() {
  return (
    <div className="space-y-6">
      <CrudPanel table="artist_categories" columns={["name", "slug"]} label="Catégorie artiste" />
      <CrudPanel table="artists" columns={["name", "image_url", "category_id"]} label="Artiste" />
    </div>
  );
}

// ── Clients Panel ──
function ClientsPanel() {
  return (
    <div className="space-y-6">
      <CrudPanel table="client_categories" columns={["name"]} label="Catégorie client" />
      <CrudPanel table="clients" columns={["name", "logo_url", "category_id"]} label="Client" />
    </div>
  );
}

// ── Services Panel ──
function ServicesPanel() {
  return (
    <div className="space-y-6">
      <CrudPanel table="services_artiste" columns={["number", "title", "description"]} label="Service artiste" />
      <CrudPanel table="services_entreprise" columns={["number", "title", "description"]} label="Service entreprise" />
    </div>
  );
}

// ── Settings Panel ──
function SettingsPanel() {
  return <CrudPanel table="site_settings" columns={["key", "value", "type"]} label="Paramètre" />;
}

export default Admin;
