import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Link } from "react-router-dom";
import {
  LogOut, Menu, X, Search, Bell, ExternalLink,
  LayoutDashboard, CreditCard, MessageSquare,
  Home, Music, Building2, Settings as SettingsIcon, Share2, Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminNotifications } from "./useAdminNotifications";

export type AdminTab =
  | "dashboard"
  | "paiements" | "demandes"
  | "page_accueil" | "page_artiste" | "page_entreprise"
  | "partage" | "identite" | "legal"
  | "settings";

type NavItem = { key: AdminTab; label: string; icon: React.ElementType; badge?: "demandes" | "paiements" };
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Vue d'ensemble",
    items: [
      { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    ],
  },
  {
    label: "Business",
    items: [
      { key: "paiements", label: "Paiements", icon: CreditCard, badge: "paiements" },
      { key: "demandes", label: "Demandes", icon: MessageSquare, badge: "demandes" },
    ],
  },
  {
    label: "Pages du site",
    items: [
      { key: "page_accueil", label: "Page d'entrée", icon: Home },
      { key: "page_artiste", label: "Page Artiste", icon: Music },
      { key: "page_entreprise", label: "Page Entreprise", icon: Building2 },
    ],
  },
  {
    label: "Global",
    items: [
      { key: "partage", label: "Sections partagées", icon: Share2 },
      { key: "identite", label: "Identité & Logos", icon: SettingsIcon },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

interface Props {
  children: (tab: AdminTab) => React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const notifs = useAdminNotifications();

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return NAV_GROUPS;
    const q = search.toLowerCase();
    return NAV_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) => i.label.toLowerCase().includes(q)),
    })).filter((g) => g.items.length > 0);
  }, [search]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-mono text-sm">Chargement…</p>
      </div>
    );
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  const select = (t: AdminTab) => {
    setTab(t);
    setMobileOpen(false);
  };

  const currentItem = ALL_ITEMS.find((i) => i.key === tab);
  const totalNotifs = notifs.demandes + notifs.paiements;

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const count = item.badge ? notifs[item.badge] : 0;
    const active = tab === item.key;
    return (
      <button
        key={item.key}
        onClick={() => select(item.key)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group",
          active ? "bg-slate-900 text-white font-medium shadow-sm"
                 : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        )}
      >
        <Icon size={16} className={cn("shrink-0", active ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
        <span className="flex-1 text-left">{item.label}</span>
        {count > 0 && (
          <span className={cn(
            "min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center",
            active ? "bg-white/20 text-white" : "bg-red-500 text-white"
          )}>
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>
    );
  };

  const sidebar = (
    <>
      <div className="px-5 py-5 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-clash font-bold text-sm">M</div>
          <div>
            <h1 className="font-clash text-sm font-bold text-slate-900 leading-tight">MUST Admin</h1>
            <p className="text-[10px] text-slate-500 font-mono">Tableau de bord</p>
          </div>
        </div>
      </div>

      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="w-full pl-8 pr-2 py-2 text-xs rounded-lg bg-slate-100 border border-transparent focus:border-slate-300 focus:bg-white focus:outline-none transition-colors text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-5 overflow-y-auto">
        {filteredGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-medium">
              {group.label}
            </p>
            <div className="space-y-0.5">{group.items.map(renderNavItem)}</div>
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">Aucun résultat</p>
        )}
      </nav>

      <div className="p-3 border-t border-slate-200 space-y-2">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {(user.email || "A").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-900 truncate">{user.email?.split("@")[0]}</p>
            <p className="text-[10px] text-slate-500 truncate">Administrateur</p>
          </div>
        </div>
        <Link to="/" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
          <ExternalLink size={14} /> Retour au site
        </Link>
        <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors">
          <LogOut size={14} /> Déconnexion
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white shrink-0">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 flex flex-col">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-3 p-1.5 rounded-md text-slate-500 hover:bg-slate-100 z-10">
              <X size={18} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 lg:px-8 py-3 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 rounded-md text-slate-600 hover:bg-slate-100">
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider hidden sm:block">Admin</p>
              <h2 className="font-clash text-base lg:text-lg font-bold text-slate-900 truncate">
                {currentItem?.label || "Tableau de bord"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => select("demandes")} className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors" title="Notifications">
              <Bell size={16} />
              {totalNotifs > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />}
            </button>
            <Link to="/" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
              <ExternalLink size={13} /> Voir le site
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children(tab)}</main>
      </div>
    </div>
  );
}
