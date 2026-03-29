import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import {
  LogOut, Users, Music, Building2, Package, BarChart3,
  Briefcase, MessageSquare, Settings, Menu, X, Image,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTab =
  | "editeur" | "demandes" | "equipe" | "artistes" | "clients"
  | "packs" | "stats" | "services" | "settings";

const NAV: { key: AdminTab; label: string; icon: React.ElementType }[] = [
  { key: "editeur", label: "Éditeur visuel", icon: Image },
  { key: "demandes", label: "Demandes", icon: MessageSquare },
  { key: "equipe", label: "Équipe", icon: Users },
  { key: "artistes", label: "Artistes", icon: Music },
  { key: "clients", label: "Clients", icon: Building2 },
  { key: "packs", label: "Packs", icon: Package },
  { key: "stats", label: "Statistiques", icon: BarChart3 },
  { key: "services", label: "Services", icon: Briefcase },
  { key: "settings", label: "Paramètres", icon: Settings },
];

interface Props {
  children: (tab: AdminTab) => React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [tab, setTab] = useState<AdminTab>("editeur");
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground font-mono text-sm">Chargement…</p>
      </div>
    );
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  const select = (t: AdminTab) => {
    setTab(t);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-56 border-r border-border bg-surface shrink-0">
        <div className="p-5 border-b border-border">
          <h1 className="font-clash text-lg font-bold text-foreground">Must Admin</h1>
          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">Tableau de bord</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => select(key)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                tab === key
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-surface border-r border-border flex flex-col">
            <div className="p-5 flex justify-between items-center border-b border-border">
              <h1 className="font-clash text-lg font-bold text-foreground">Must Admin</h1>
              <button onClick={() => setMobileOpen(false)} className="text-muted-foreground"><X size={20} /></button>
            </div>
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
              {NAV.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => select(key)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                    tab === key
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
            <div className="p-3 border-t border-border">
              <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive transition-colors">
                <LogOut size={16} /> Déconnexion
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
          <button onClick={() => setMobileOpen(true)} className="text-foreground"><Menu size={22} /></button>
          <h1 className="font-clash text-base font-bold text-foreground">Must Admin</h1>
          <button onClick={signOut} className="text-muted-foreground"><LogOut size={18} /></button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <h2 className="font-clash text-2xl font-bold text-foreground mb-6">
            {NAV.find((n) => n.key === tab)?.label}
          </h2>
          {children(tab)}
        </main>
      </div>
    </div>
  );
}
