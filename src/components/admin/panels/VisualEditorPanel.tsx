import { useState } from "react";
import { useAdminCrud } from "../useAdminCrud";
import AdminField from "../AdminField";
import AdminForm from "../AdminForm";
import AdminList from "../AdminList";
import {
  Sparkles, BarChart3, Users, Mic2, Building2, Package, FolderKanban,
  Music, Briefcase, Phone, Type as TypeIcon, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SETTING_LABELS: Record<string, string> = {
  logo_white: "Logo blanc",
  logo_green: "Logo vert",
  contact_email: "Email",
  contact_phone: "Téléphone / WhatsApp",
  social_instagram: "Instagram",
  social_tiktok: "TikTok",
  social_linkedin: "LinkedIn",
  hero_title_line1: "Héro — Ligne 1",
  hero_title_accent: "Héro — Accent",
  hero_subtitle: "Héro — Sous-titre",
  vision_quote: "Vision — Citation",
  vision_text: "Vision — Texte",
  cta_title: "CTA — Titre",
  cta_subtitle: "CTA — Sous-titre",
};

type SectionKey =
  | "hero" | "stats" | "team" | "artistes" | "clients"
  | "packs" | "portfolio" | "services_artiste" | "services_entreprise"
  | "contact" | "textes";

const SECTIONS: { key: SectionKey; label: string; icon: any; desc: string }[] = [
  { key: "hero", label: "Héro & Identité", icon: Sparkles, desc: "Logos, titre principal, sous-titre" },
  { key: "stats", label: "Statistiques", icon: BarChart3, desc: "Chiffres clés affichés sur le site" },
  { key: "team", label: "Équipe", icon: Users, desc: "Membres et rôles" },
  { key: "artistes", label: "Artistes", icon: Mic2, desc: "Catégories et profils artistes" },
  { key: "clients", label: "Clients", icon: Building2, desc: "Logos et références entreprises" },
  { key: "packs", label: "Packs & Tarifs", icon: Package, desc: "Offres et prix" },
  { key: "portfolio", label: "Portfolio", icon: FolderKanban, desc: "Cas clients mis en avant" },
  { key: "services_artiste", label: "Services Artiste", icon: Music, desc: "Pôle artiste" },
  { key: "services_entreprise", label: "Services Entreprise", icon: Briefcase, desc: "Pôle entreprise" },
  { key: "contact", label: "Contact & Réseaux", icon: Phone, desc: "Email, tel, réseaux sociaux" },
  { key: "textes", label: "Textes (Vision, CTA)", icon: TypeIcon, desc: "Citations et appels à l'action" },
];

// ─────────────────────────────────────────
// Live previews (clean light theme)
// ─────────────────────────────────────────
function ArtistPreviewGrid({ artists, categories }: { artists: any[]; categories: any[] }) {
  const getCat = (id: string) => categories.find((c: any) => c.id === id)?.name || "";
  if (artists.length === 0) return null;
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
      {artists.slice(0, 14).map((a: any) => (
        <div key={a.id} className="rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
          {a.image_url ? (
            <img src={a.image_url} alt={a.name} className="w-full aspect-[3/4] object-cover" />
          ) : (
            <div className="w-full aspect-[3/4] flex items-center justify-center text-slate-300 text-xs">?</div>
          )}
          <div className="p-1.5">
            <p className="text-[10px] font-medium text-slate-900 truncate">{a.name}</p>
            <p className="text-[9px] text-indigo-600 truncate">{getCat(a.category_id)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ClientPreviewGrid({ clients }: { clients: any[] }) {
  if (clients.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {clients.slice(0, 16).map((c: any) => (
        <div key={c.id} className="w-16 h-10 rounded border border-slate-200 bg-slate-50 flex items-center justify-center p-1">
          {c.logo_url ? (
            <img src={c.logo_url} alt={c.name} className="max-w-full max-h-full object-contain opacity-70" />
          ) : (
            <span className="text-[8px] text-slate-400">{c.name}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function TeamPreviewGrid({ members }: { members: any[] }) {
  if (members.length === 0) return null;
  return (
    <div className="flex gap-2 flex-wrap">
      {members.map((m: any) => (
        <div key={m.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          {m.image_url ? (
            <img src={m.image_url} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
              {m.initials}
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-slate-900">{m.name}</p>
            <p className="text-[10px] text-slate-500">{m.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Card wrapper for a section's content
function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6">
      <div className="mb-5">
        <h3 className="font-clash text-lg font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function PreviewBox({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={cn(
      "rounded-xl p-4 border",
      dark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
    )}>
      <p className={cn("text-[10px] font-mono uppercase tracking-wider mb-3", dark ? "text-slate-500" : "text-slate-400")}>
        Aperçu en direct
      </p>
      {children}
    </div>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2 font-medium">{children}</h4>
  );
}

// ─────────────────────────────────────────
// Main panel
// ─────────────────────────────────────────
export default function VisualEditorPanel() {
  const [active, setActive] = useState<SectionKey>("hero");

  const settings = useAdminCrud("site_settings", { idField: "key", orderBy: "key" });
  const stats = useAdminCrud("stats");
  const team = useAdminCrud("team_members");
  const artistCategories = useAdminCrud("artist_categories");
  const artists = useAdminCrud("artists");
  const clientCategories = useAdminCrud("client_categories");
  const clients = useAdminCrud("clients");
  const packs = useAdminCrud("packs");
  const services = useAdminCrud("services_artiste");
  const servicesEnt = useAdminCrud("services_entreprise");
  const portfolio = useAdminCrud("portfolio_cases");

  const getSetting = (key: string) => settings.data.find((s: any) => s.key === key)?.value || "";
  const catOptions = artistCategories.data.map((c: any) => ({ label: c.name, value: c.id }));
  const clientCatOptions = clientCategories.data.map((c: any) => ({ label: c.name, value: c.id }));
  const getCatName = (id: string) => artistCategories.data.find((c: any) => c.id === id)?.name || "—";
  const getClientCatName = (id: string) => clientCategories.data.find((c: any) => c.id === id)?.name || "—";

  const currentSection = SECTIONS.find((s) => s.key === active)!;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
      {/* Sub-navigation */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 max-h-[calc(100vh-7rem)] overflow-y-auto">
          <p className="px-3 pt-1 pb-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-medium">
            Sections du site
          </p>
          <nav className="space-y-0.5">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = active === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setActive(s.key)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group text-left",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon size={15} className={cn("shrink-0", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                  <span className="flex-1 text-sm font-medium">{s.label}</span>
                  <ChevronRight
                    size={14}
                    className={cn(
                      "shrink-0 transition-transform",
                      isActive ? "text-indigo-500" : "text-slate-300 opacity-0 group-hover:opacity-100"
                    )}
                  />
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <div className="space-y-5 min-w-0">
        {/* Section header */}
        <div className="flex items-start gap-3 px-1">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
            <currentSection.icon size={18} />
          </div>
          <div>
            <h2 className="font-clash text-xl font-bold text-slate-900">{currentSection.label}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{currentSection.desc}</p>
          </div>
        </div>

        {/* ═══ HERO ═══ */}
        {active === "hero" && (
          <SectionCard title="Héro & Identité" subtitle="Premier élément vu par vos visiteurs">
            <PreviewBox dark>
              <div className="flex items-center gap-4 mb-5">
                {getSetting("logo_white") && <img src={getSetting("logo_white")} alt="" className="h-7" />}
                {getSetting("logo_green") && <img src={getSetting("logo_green")} alt="" className="h-7" />}
              </div>
              <h1 className="text-white text-2xl font-bold font-clash">
                {getSetting("hero_title_line1") || "Titre héro"}{" "}
                <span className="text-[#CCFF00]">{getSetting("hero_title_accent") || "accent"}</span>
              </h1>
              <p className="text-slate-400 text-sm mt-2">{getSetting("hero_subtitle") || "Sous-titre"}</p>
            </PreviewBox>

            <AdminList
              items={settings.data.filter((s: any) =>
                ["logo_white", "logo_green", "hero_title_line1", "hero_title_accent", "hero_subtitle"].includes(s.key)
              )}
              isLoading={settings.isLoading}
              label="paramètre"
              idField="key"
              hideAdd
              onAdd={() => {}}
              onEdit={(item) => settings.setEditing(item)}
              onDelete={(pkValue) => settings.remove(pkValue)}
              renderItem={(item) => (
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{SETTING_LABELS[item.key] || item.key}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {item.type === "image" ? "🖼️ Image" : item.value}
                  </p>
                </div>
              )}
            />
            {settings.editing && (
              <AdminForm onSave={() => settings.save(settings.editing!)} onCancel={() => settings.setEditing(null)} saving={settings.saving}>
                {settings.editing.type === "image" || settings.editing.key?.startsWith("logo_") ? (
                  <AdminField label="value" type="image" value={settings.editing.value} onChange={(v) => settings.setEditing({ ...settings.editing!, value: v })} imageFolder="settings" />
                ) : (
                  <AdminField
                    label="value"
                    type={settings.editing.value?.length > 80 ? "textarea" : "text"}
                    value={settings.editing.value}
                    onChange={(v) => settings.setEditing({ ...settings.editing!, value: v })}
                  />
                )}
              </AdminForm>
            )}
          </SectionCard>
        )}

        {/* ═══ STATS ═══ */}
        {active === "stats" && (
          <SectionCard title="Statistiques" subtitle="Chiffres clés sur les pages d'accueil">
            <PreviewBox>
              <div className="flex gap-3 flex-wrap">
                {stats.data.map((s: any) => (
                  <div key={s.id} className="bg-white rounded-xl border border-slate-200 px-4 py-3 text-center min-w-[100px] shadow-sm">
                    <p className="text-indigo-600 text-xl font-bold font-clash">{s.value}{s.suffix}</p>
                    <p className="text-slate-600 text-[10px] mt-1">{s.label}</p>
                    <p className="text-[8px] text-slate-400 mt-0.5 uppercase">{s.page}</p>
                  </div>
                ))}
              </div>
            </PreviewBox>

            <AdminList
              items={stats.data}
              isLoading={stats.isLoading}
              label="statistique"
              onAdd={() => stats.setEditing({ page: "home", value: "", label: "", suffix: "", display_order: stats.data.length } as any)}
              onEdit={(item) => stats.setEditing(item)}
              onDelete={stats.remove}
              renderItem={(item) => (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-mono font-medium">{item.page}</span>
                  <p className="text-sm text-slate-900"><strong>{item.value}{item.suffix}</strong> — {item.label}</p>
                </div>
              )}
            />
            {stats.editing && (
              <AdminForm onSave={() => stats.save(stats.editing!)} onCancel={() => stats.setEditing(null)} saving={stats.saving}>
                <AdminField label="page" type="select" options={[
                  { label: "Accueil", value: "home" },
                  { label: "Artiste", value: "artiste" },
                  { label: "Entreprise", value: "entreprise" },
                ]} value={stats.editing.page} onChange={(v) => stats.setEditing({ ...stats.editing!, page: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <AdminField label="value" value={stats.editing.value} onChange={(v) => stats.setEditing({ ...stats.editing!, value: v })} />
                  <AdminField label="suffix" value={stats.editing.suffix} onChange={(v) => stats.setEditing({ ...stats.editing!, suffix: v })} />
                </div>
                <AdminField label="label" value={stats.editing.label} onChange={(v) => stats.setEditing({ ...stats.editing!, label: v })} />
                <AdminField label="display_order" value={stats.editing.display_order} onChange={(v) => stats.setEditing({ ...stats.editing!, display_order: parseInt(v) || 0 })} />
              </AdminForm>
            )}
          </SectionCard>
        )}

        {/* ═══ TEAM ═══ */}
        {active === "team" && (
          <SectionCard title="Équipe" subtitle="Membres affichés sur la page d'accueil">
            <PreviewBox><TeamPreviewGrid members={team.data} /></PreviewBox>
            <AdminList
              items={team.data}
              isLoading={team.isLoading}
              label="membre"
              onAdd={() => team.setEditing({ name: "", initials: "", role: "", description: "", image_url: "", display_order: team.data.length } as any)}
              onEdit={(item) => team.setEditing(item)}
              onDelete={team.remove}
              renderItem={(item) => (
                <div className="flex items-center gap-2.5">
                  {item.image_url ? (
                    <img src={item.image_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-[10px] font-bold">{item.initials}</div>
                  )}
                  <p className="text-sm text-slate-900"><strong>{item.name}</strong> <span className="text-slate-500">— {item.role}</span></p>
                </div>
              )}
            />
            {team.editing && (
              <AdminForm onSave={() => team.save(team.editing!)} onCancel={() => team.setEditing(null)} saving={team.saving}>
                <div className="grid grid-cols-2 gap-3">
                  <AdminField label="name" value={team.editing.name} onChange={(v) => team.setEditing({ ...team.editing!, name: v })} />
                  <AdminField label="initials" value={team.editing.initials} onChange={(v) => team.setEditing({ ...team.editing!, initials: v })} />
                </div>
                <AdminField label="role" value={team.editing.role} onChange={(v) => team.setEditing({ ...team.editing!, role: v })} />
                <AdminField label="description" type="textarea" value={team.editing.description} onChange={(v) => team.setEditing({ ...team.editing!, description: v })} />
                <AdminField label="image_url" type="image" value={team.editing.image_url} onChange={(v) => team.setEditing({ ...team.editing!, image_url: v })} imageFolder="team" />
                <AdminField label="display_order" value={team.editing.display_order} onChange={(v) => team.setEditing({ ...team.editing!, display_order: parseInt(v) || 0 })} />
              </AdminForm>
            )}
          </SectionCard>
        )}

        {/* ═══ ARTISTES ═══ */}
        {active === "artistes" && (
          <SectionCard title="Artistes" subtitle="Catégories et profils affichés sur la page Artiste">
            <PreviewBox><ArtistPreviewGrid artists={artists.data} categories={artistCategories.data} /></PreviewBox>

            <div>
              <SubLabel>Catégories</SubLabel>
              <AdminList
                items={artistCategories.data}
                isLoading={artistCategories.isLoading}
                label="catégorie"
                onAdd={() => artistCategories.setEditing({ name: "", slug: "", display_order: artistCategories.data.length } as any)}
                onEdit={(item) => artistCategories.setEditing(item)}
                onDelete={artistCategories.remove}
                renderItem={(item) => <p className="text-sm text-slate-900"><strong>{item.name}</strong> <span className="text-slate-500 text-xs">({item.slug})</span></p>}
              />
              {artistCategories.editing && (
                <AdminForm onSave={() => artistCategories.save(artistCategories.editing!)} onCancel={() => artistCategories.setEditing(null)} saving={artistCategories.saving}>
                  <AdminField label="name" value={artistCategories.editing.name} onChange={(v) => artistCategories.setEditing({ ...artistCategories.editing!, name: v })} />
                  <AdminField label="slug" value={artistCategories.editing.slug} onChange={(v) => artistCategories.setEditing({ ...artistCategories.editing!, slug: v })} />
                  <AdminField label="display_order" value={artistCategories.editing.display_order} onChange={(v) => artistCategories.setEditing({ ...artistCategories.editing!, display_order: parseInt(v) || 0 })} />
                </AdminForm>
              )}
            </div>

            <div>
              <SubLabel>Profils artistes</SubLabel>
              <AdminList
                items={artists.data}
                isLoading={artists.isLoading}
                label="artiste"
                onAdd={() => artists.setEditing({ name: "", image_url: "", category_id: "", display_order: artists.data.length } as any)}
                onEdit={(item) => artists.setEditing(item)}
                onDelete={artists.remove}
                renderItem={(item) => (
                  <div className="flex items-center gap-2.5">
                    {item.image_url && <img src={item.image_url} alt="" className="w-8 h-8 rounded object-cover shrink-0" />}
                    <p className="text-sm text-slate-900"><strong>{item.name}</strong> <span className="text-slate-500 text-xs">({getCatName(item.category_id)})</span></p>
                  </div>
                )}
              />
              {artists.editing && (
                <AdminForm onSave={() => artists.save(artists.editing!)} onCancel={() => artists.setEditing(null)} saving={artists.saving}>
                  <AdminField label="name" value={artists.editing.name} onChange={(v) => artists.setEditing({ ...artists.editing!, name: v })} />
                  <AdminField label="category_id" type="select" options={catOptions} value={artists.editing.category_id} onChange={(v) => artists.setEditing({ ...artists.editing!, category_id: v })} />
                  <AdminField label="image_url" type="image" value={artists.editing.image_url} onChange={(v) => artists.setEditing({ ...artists.editing!, image_url: v })} imageFolder="artistes" />
                  <AdminField label="display_order" value={artists.editing.display_order} onChange={(v) => artists.setEditing({ ...artists.editing!, display_order: parseInt(v) || 0 })} />
                </AdminForm>
              )}
            </div>
          </SectionCard>
        )}

        {/* ═══ CLIENTS ═══ */}
        {active === "clients" && (
          <SectionCard title="Clients & Références" subtitle="Logos et entreprises mises en avant">
            <PreviewBox><ClientPreviewGrid clients={clients.data} /></PreviewBox>

            <div>
              <SubLabel>Catégories</SubLabel>
              <AdminList
                items={clientCategories.data}
                isLoading={clientCategories.isLoading}
                label="catégorie"
                onAdd={() => clientCategories.setEditing({ name: "", display_order: clientCategories.data.length } as any)}
                onEdit={(item) => clientCategories.setEditing(item)}
                onDelete={clientCategories.remove}
                renderItem={(item) => <p className="text-sm text-slate-900">{item.name}</p>}
              />
              {clientCategories.editing && (
                <AdminForm onSave={() => clientCategories.save(clientCategories.editing!)} onCancel={() => clientCategories.setEditing(null)} saving={clientCategories.saving}>
                  <AdminField label="name" value={clientCategories.editing.name} onChange={(v) => clientCategories.setEditing({ ...clientCategories.editing!, name: v })} />
                  <AdminField label="display_order" value={clientCategories.editing.display_order} onChange={(v) => clientCategories.setEditing({ ...clientCategories.editing!, display_order: parseInt(v) || 0 })} />
                </AdminForm>
              )}
            </div>

            <div>
              <SubLabel>Clients</SubLabel>
              <AdminList
                items={clients.data}
                isLoading={clients.isLoading}
                label="client"
                onAdd={() => clients.setEditing({ name: "", logo_url: "", category_id: "", display_order: clients.data.length } as any)}
                onEdit={(item) => clients.setEditing(item)}
                onDelete={clients.remove}
                renderItem={(item) => (
                  <div className="flex items-center gap-2.5">
                    {item.logo_url && <img src={item.logo_url} alt="" className="w-8 h-6 object-contain shrink-0 opacity-80" />}
                    <p className="text-sm text-slate-900"><strong>{item.name}</strong> <span className="text-slate-500 text-xs">({getClientCatName(item.category_id)})</span></p>
                  </div>
                )}
              />
              {clients.editing && (
                <AdminForm onSave={() => clients.save(clients.editing!)} onCancel={() => clients.setEditing(null)} saving={clients.saving}>
                  <AdminField label="name" value={clients.editing.name} onChange={(v) => clients.setEditing({ ...clients.editing!, name: v })} />
                  <AdminField label="category_id" type="select" options={clientCatOptions} value={clients.editing.category_id} onChange={(v) => clients.setEditing({ ...clients.editing!, category_id: v })} />
                  <AdminField label="logo_url" type="image" value={clients.editing.logo_url} onChange={(v) => clients.setEditing({ ...clients.editing!, logo_url: v })} imageFolder="clients" />
                  <AdminField label="display_order" value={clients.editing.display_order} onChange={(v) => clients.setEditing({ ...clients.editing!, display_order: parseInt(v) || 0 })} />
                </AdminForm>
              )}
            </div>
          </SectionCard>
        )}

        {/* ═══ PACKS ═══ */}
        {active === "packs" && (
          <SectionCard title="Packs & Tarifs" subtitle="Offres de la page Artiste">
            <PreviewBox>
              <div className="flex gap-3 flex-wrap">
                {packs.data.map((p: any) => (
                  <div key={p.id} className={cn(
                    "rounded-xl border px-4 py-3 min-w-[140px] bg-white shadow-sm",
                    p.featured ? "border-indigo-400 ring-2 ring-indigo-100" : "border-slate-200"
                  )}>
                    <p className="text-[10px] text-slate-400 font-mono">#{p.number}</p>
                    <p className="text-sm font-bold text-slate-900">{p.name}</p>
                    <p className="text-indigo-600 font-clash font-bold mt-1">{p.price}<span className="text-xs text-slate-400 ml-1">{p.price_suffix}</span></p>
                    {p.badge && <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[9px] font-medium">{p.badge}</span>}
                  </div>
                ))}
              </div>
            </PreviewBox>
            <AdminList
              items={packs.data}
              isLoading={packs.isLoading}
              label="pack"
              onAdd={() => packs.setEditing({ name: "", number: "", subtitle: "", price: "", price_suffix: "HT", badge: "", bonus: "", reassurance: "", featured: false, display_order: packs.data.length } as any)}
              onEdit={(item) => packs.setEditing(item)}
              onDelete={packs.remove}
              renderItem={(item) => (
                <p className="text-sm text-slate-900">
                  <span className="text-slate-400 font-mono text-xs">#{item.number}</span>{" "}
                  <strong>{item.name}</strong> <span className="text-slate-500">— {item.price} {item.price_suffix}</span>
                  {item.featured && <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px]">⭐ Vedette</span>}
                </p>
              )}
            />
            {packs.editing && (
              <AdminForm onSave={() => packs.save(packs.editing!)} onCancel={() => packs.setEditing(null)} saving={packs.saving}>
                <div className="grid grid-cols-2 gap-3">
                  <AdminField label="number" value={packs.editing.number} onChange={(v) => packs.setEditing({ ...packs.editing!, number: v })} />
                  <AdminField label="name" value={packs.editing.name} onChange={(v) => packs.setEditing({ ...packs.editing!, name: v })} />
                </div>
                <AdminField label="subtitle" value={packs.editing.subtitle} onChange={(v) => packs.setEditing({ ...packs.editing!, subtitle: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <AdminField label="price" value={packs.editing.price} onChange={(v) => packs.setEditing({ ...packs.editing!, price: v })} />
                  <AdminField label="price_suffix" value={packs.editing.price_suffix} onChange={(v) => packs.setEditing({ ...packs.editing!, price_suffix: v })} />
                </div>
                <AdminField label="badge" value={packs.editing.badge} onChange={(v) => packs.setEditing({ ...packs.editing!, badge: v })} />
                <AdminField label="bonus" value={packs.editing.bonus} onChange={(v) => packs.setEditing({ ...packs.editing!, bonus: v })} />
                <AdminField label="reassurance" value={packs.editing.reassurance} onChange={(v) => packs.setEditing({ ...packs.editing!, reassurance: v })} />
                <AdminField label="featured" type="checkbox" value={packs.editing.featured} onChange={(v) => packs.setEditing({ ...packs.editing!, featured: v })} />
                <AdminField label="display_order" value={packs.editing.display_order} onChange={(v) => packs.setEditing({ ...packs.editing!, display_order: parseInt(v) || 0 })} />
              </AdminForm>
            )}
          </SectionCard>
        )}

        {/* ═══ PORTFOLIO ═══ */}
        {active === "portfolio" && (
          <SectionCard title="Portfolio / Cas clients" subtitle="Études de cas mises en avant">
            <AdminList
              items={portfolio.data}
              isLoading={portfolio.isLoading}
              label="cas"
              onAdd={() => portfolio.setEditing({ icon: "🎯", tag: "", title: "", description: "", display_order: portfolio.data.length } as any)}
              onEdit={(item) => portfolio.setEditing(item)}
              onDelete={portfolio.remove}
              renderItem={(item) => (
                <p className="text-sm text-slate-900"><span className="mr-1.5">{item.icon}</span><strong>{item.title}</strong> <span className="text-slate-500 text-xs">({item.tag})</span></p>
              )}
            />
            {portfolio.editing && (
              <AdminForm onSave={() => portfolio.save(portfolio.editing!)} onCancel={() => portfolio.setEditing(null)} saving={portfolio.saving}>
                <div className="grid grid-cols-2 gap-3">
                  <AdminField label="icon" value={portfolio.editing.icon} onChange={(v) => portfolio.setEditing({ ...portfolio.editing!, icon: v })} />
                  <AdminField label="tag" value={portfolio.editing.tag} onChange={(v) => portfolio.setEditing({ ...portfolio.editing!, tag: v })} />
                </div>
                <AdminField label="title" value={portfolio.editing.title} onChange={(v) => portfolio.setEditing({ ...portfolio.editing!, title: v })} />
                <AdminField label="description" type="textarea" value={portfolio.editing.description} onChange={(v) => portfolio.setEditing({ ...portfolio.editing!, description: v })} />
                <AdminField label="display_order" value={portfolio.editing.display_order} onChange={(v) => portfolio.setEditing({ ...portfolio.editing!, display_order: parseInt(v) || 0 })} />
              </AdminForm>
            )}
          </SectionCard>
        )}

        {/* ═══ SERVICES ARTISTE ═══ */}
        {active === "services_artiste" && (
          <SectionCard title="Services — Pôle Artiste" subtitle="Expertises présentées sur la page Artiste">
            <AdminList
              items={services.data}
              isLoading={services.isLoading}
              label="service"
              onAdd={() => services.setEditing({ number: "", title: "", description: "", display_order: services.data.length } as any)}
              onEdit={(item) => services.setEditing(item)}
              onDelete={services.remove}
              renderItem={(item) => <p className="text-sm text-slate-900"><span className="text-slate-400 font-mono text-xs">#{item.number}</span> <strong>{item.title}</strong></p>}
            />
            {services.editing && (
              <AdminForm onSave={() => services.save(services.editing!)} onCancel={() => services.setEditing(null)} saving={services.saving}>
                <AdminField label="number" value={services.editing.number} onChange={(v) => services.setEditing({ ...services.editing!, number: v })} />
                <AdminField label="title" value={services.editing.title} onChange={(v) => services.setEditing({ ...services.editing!, title: v })} />
                <AdminField label="description" type="textarea" value={services.editing.description} onChange={(v) => services.setEditing({ ...services.editing!, description: v })} />
                <AdminField label="display_order" value={services.editing.display_order} onChange={(v) => services.setEditing({ ...services.editing!, display_order: parseInt(v) || 0 })} />
              </AdminForm>
            )}
          </SectionCard>
        )}

        {/* ═══ SERVICES ENTREPRISE ═══ */}
        {active === "services_entreprise" && (
          <SectionCard title="Services — Pôle Entreprise" subtitle="Expertises présentées sur la page Entreprise">
            <AdminList
              items={servicesEnt.data}
              isLoading={servicesEnt.isLoading}
              label="service"
              onAdd={() => servicesEnt.setEditing({ number: "", title: "", description: "", display_order: servicesEnt.data.length } as any)}
              onEdit={(item) => servicesEnt.setEditing(item)}
              onDelete={servicesEnt.remove}
              renderItem={(item) => <p className="text-sm text-slate-900"><span className="text-slate-400 font-mono text-xs">#{item.number}</span> <strong>{item.title}</strong></p>}
            />
            {servicesEnt.editing && (
              <AdminForm onSave={() => servicesEnt.save(servicesEnt.editing!)} onCancel={() => servicesEnt.setEditing(null)} saving={servicesEnt.saving}>
                <AdminField label="number" value={servicesEnt.editing.number} onChange={(v) => servicesEnt.setEditing({ ...servicesEnt.editing!, number: v })} />
                <AdminField label="title" value={servicesEnt.editing.title} onChange={(v) => servicesEnt.setEditing({ ...servicesEnt.editing!, title: v })} />
                <AdminField label="description" type="textarea" value={servicesEnt.editing.description} onChange={(v) => servicesEnt.setEditing({ ...servicesEnt.editing!, description: v })} />
                <AdminField label="display_order" value={servicesEnt.editing.display_order} onChange={(v) => servicesEnt.setEditing({ ...servicesEnt.editing!, display_order: parseInt(v) || 0 })} />
              </AdminForm>
            )}
          </SectionCard>
        )}

        {/* ═══ CONTACT ═══ */}
        {active === "contact" && (
          <SectionCard title="Contact & Réseaux sociaux" subtitle="Informations de contact affichées sur le site">
            <AdminList
              items={settings.data.filter((s: any) =>
                ["contact_email", "contact_phone", "social_instagram", "social_tiktok", "social_linkedin"].includes(s.key)
              )}
              isLoading={settings.isLoading}
              label="info"
              idField="key"
              hideAdd
              onAdd={() => {}}
              onEdit={(item) => settings.setEditing(item)}
              onDelete={(pkValue) => settings.remove(pkValue)}
              renderItem={(item) => (
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{SETTING_LABELS[item.key] || item.key}</p>
                  <p className="text-xs text-slate-500 truncate">{item.value}</p>
                </div>
              )}
            />
            {settings.editing && (
              <AdminForm onSave={() => settings.save(settings.editing!)} onCancel={() => settings.setEditing(null)} saving={settings.saving}>
                <AdminField label="value" value={settings.editing.value} onChange={(v) => settings.setEditing({ ...settings.editing!, value: v })} />
              </AdminForm>
            )}
          </SectionCard>
        )}

        {/* ═══ TEXTES ═══ */}
        {active === "textes" && (
          <SectionCard title="Textes (Vision, CTA)" subtitle="Citations et appels à l'action">
            <AdminList
              items={settings.data.filter((s: any) =>
                ["vision_quote", "vision_text", "cta_title", "cta_subtitle"].includes(s.key)
              )}
              isLoading={settings.isLoading}
              label="texte"
              idField="key"
              hideAdd
              onAdd={() => {}}
              onEdit={(item) => settings.setEditing(item)}
              onDelete={(pkValue) => settings.remove(pkValue)}
              renderItem={(item) => (
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{SETTING_LABELS[item.key] || item.key}</p>
                  <p className="text-xs text-slate-500 truncate">{item.value}</p>
                </div>
              )}
            />
            {settings.editing && (
              <AdminForm onSave={() => settings.save(settings.editing!)} onCancel={() => settings.setEditing(null)} saving={settings.saving}>
                <AdminField
                  label="value"
                  type={settings.editing.value?.length > 80 ? "textarea" : "text"}
                  value={settings.editing.value}
                  onChange={(v) => settings.setEditing({ ...settings.editing!, value: v })}
                />
              </AdminForm>
            )}
          </SectionCard>
        )}
      </div>
    </div>
  );
}
