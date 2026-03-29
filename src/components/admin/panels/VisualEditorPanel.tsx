import { useState } from "react";
import { useAdminCrud } from "../useAdminCrud";
import AdminField from "../AdminField";
import AdminForm from "../AdminForm";
import AdminList from "../AdminList";
import { ChevronDown, ChevronRight, Eye, Edit3, X } from "lucide-react";

// Section wrapper with toggle + edit capability
function Section({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-surface">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/20 transition-colors"
      >
        <span className="text-lg">{icon}</span>
        <span className="font-clash font-bold text-foreground flex-1">{title}</span>
        {open ? <ChevronDown size={18} className="text-muted-foreground" /> : <ChevronRight size={18} className="text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-border pt-4">{children}</div>}
    </div>
  );
}

// Live preview card for an artist
function ArtistPreviewGrid({ artists, categories }: { artists: any[]; categories: any[] }) {
  const getCat = (id: string) => categories.find((c: any) => c.id === id)?.name || "";
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {artists.map((a: any) => (
        <div key={a.id} className="rounded-lg overflow-hidden bg-background border border-border group">
          {a.image_url ? (
            <img src={a.image_url} alt={a.name} className="w-full aspect-[3/4] object-cover" />
          ) : (
            <div className="w-full aspect-[3/4] bg-muted/20 flex items-center justify-center text-muted-foreground text-xs">?</div>
          )}
          <div className="p-1.5">
            <p className="text-[10px] font-medium text-foreground truncate">{a.name}</p>
            <p className="text-[8px] text-primary truncate">{getCat(a.category_id)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Live preview for clients
function ClientPreviewGrid({ clients }: { clients: any[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {clients.map((c: any) => (
        <div key={c.id} className="w-16 h-10 rounded border border-border bg-white/5 flex items-center justify-center p-1">
          {c.logo_url ? (
            <img src={c.logo_url} alt={c.name} className="max-w-full max-h-full object-contain opacity-50 grayscale" />
          ) : (
            <span className="text-[8px] text-muted-foreground">{c.name}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// Live preview for team
function TeamPreviewGrid({ members }: { members: any[] }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {members.map((m: any) => (
        <div key={m.id} className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
          {m.image_url ? (
            <img src={m.image_url} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
              {m.initials}
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-foreground">{m.name}</p>
            <p className="text-[10px] text-muted-foreground">{m.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function VisualEditorPanel() {
  // Load all data
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

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header: site overview */}
      <div className="bg-background rounded-xl border border-primary/20 p-5">
        <div className="flex items-center gap-3 mb-3">
          <Eye size={18} className="text-primary" />
          <h3 className="font-clash font-bold text-foreground">Éditeur Visuel Global</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Cliquez sur une section pour la modifier. Tous les changements sont reflétés immédiatement sur le site.
        </p>
      </div>

      {/* ═══ HERO & BRANDING ═══ */}
      <Section title="Héro & Identité" icon="🎨">
        <div className="space-y-4">
          {/* Live preview */}
          <div className="bg-[#0A0A0A] rounded-xl p-6 border border-border">
            <div className="flex items-center gap-4 mb-6">
              {getSetting("logo_white") && <img src={getSetting("logo_white")} alt="" className="h-8" />}
              {getSetting("logo_green") && <img src={getSetting("logo_green")} alt="" className="h-8" />}
            </div>
            <h1 className="text-white text-2xl font-bold font-clash">
              {getSetting("hero_title_line1") || "Titre héro"}{" "}
              <span className="text-[#CCFF00]">{getSetting("hero_title_accent") || "accent"}</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2">{getSetting("hero_subtitle") || "Sous-titre"}</p>
          </div>

          {/* Edit settings */}
          <AdminList
            items={settings.data.filter((s: any) => ["logo_white", "logo_green", "hero_title_line1", "hero_title_accent", "hero_subtitle"].includes(s.key))}
            isLoading={settings.isLoading}
            label="paramètre"
            idField="key"
            onAdd={() => {}}
            onEdit={(item) => settings.setEditing(item)}
            onDelete={(pkValue) => settings.remove(pkValue)}
            renderItem={(item) => (
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{SETTING_LABELS[item.key] || item.key}</p>
                <p className="text-xs text-muted-foreground truncate">{item.type === "image" ? "🖼️ Image" : item.value}</p>
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
        </div>
      </Section>

      {/* ═══ STATS ═══ */}
      <Section title="Statistiques" icon="📊">
        {/* Preview */}
        <div className="flex gap-4 mb-4 flex-wrap">
          {stats.data.map((s: any) => (
            <div key={s.id} className="bg-[#0A0A0A] rounded-xl border border-border px-4 py-3 text-center min-w-[100px]">
              <p className="text-[#CCFF00] text-xl font-bold font-clash">{s.value}{s.suffix}</p>
              <p className="text-gray-400 text-[10px] mt-1">{s.label}</p>
              <p className="text-[8px] text-gray-600 mt-0.5">{s.page}</p>
            </div>
          ))}
        </div>
        <AdminList
          items={stats.data}
          isLoading={stats.isLoading}
          label="statistique"
          onAdd={() => stats.setEditing({ page: "home", value: "", label: "", suffix: "", display_order: stats.data.length } as any)}
          onEdit={(item) => stats.setEditing(item)}
          onDelete={stats.remove}
          renderItem={(item) => (
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-mono">{item.page}</span>
              <p className="text-sm text-foreground">{item.value}{item.suffix} — {item.label}</p>
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
      </Section>

      {/* ═══ ÉQUIPE ═══ */}
      <Section title="Équipe" icon="👥">
        <TeamPreviewGrid members={team.data} />
        <div className="mt-4">
          <AdminList
            items={team.data}
            isLoading={team.isLoading}
            label="membre"
            onAdd={() => team.setEditing({ name: "", initials: "", role: "", description: "", image_url: "", display_order: team.data.length } as any)}
            onEdit={(item) => team.setEditing(item)}
            onDelete={team.remove}
            renderItem={(item) => (
              <p className="text-sm text-foreground">{item.name} — {item.role}</p>
            )}
          />
          {team.editing && (
            <AdminForm onSave={() => team.save(team.editing!)} onCancel={() => team.setEditing(null)} saving={team.saving}>
              <AdminField label="name" value={team.editing.name} onChange={(v) => team.setEditing({ ...team.editing!, name: v })} />
              <AdminField label="initials" value={team.editing.initials} onChange={(v) => team.setEditing({ ...team.editing!, initials: v })} />
              <AdminField label="role" value={team.editing.role} onChange={(v) => team.setEditing({ ...team.editing!, role: v })} />
              <AdminField label="description" type="textarea" value={team.editing.description} onChange={(v) => team.setEditing({ ...team.editing!, description: v })} />
              <AdminField label="image_url" type="image" value={team.editing.image_url} onChange={(v) => team.setEditing({ ...team.editing!, image_url: v })} imageFolder="team" />
              <AdminField label="display_order" value={team.editing.display_order} onChange={(v) => team.setEditing({ ...team.editing!, display_order: parseInt(v) || 0 })} />
            </AdminForm>
          )}
        </div>
      </Section>

      {/* ═══ ARTISTES ═══ */}
      <Section title="Artistes" icon="🎤">
        <ArtistPreviewGrid artists={artists.data} categories={artistCategories.data} />

        {/* Categories */}
        <div className="mt-4">
          <h4 className="text-xs font-mono text-muted-foreground uppercase mb-2">Catégories</h4>
          <AdminList
            items={artistCategories.data}
            isLoading={artistCategories.isLoading}
            label="catégorie"
            onAdd={() => artistCategories.setEditing({ name: "", slug: "", display_order: artistCategories.data.length } as any)}
            onEdit={(item) => artistCategories.setEditing(item)}
            onDelete={artistCategories.remove}
            renderItem={(item) => <p className="text-sm text-foreground">{item.name} <span className="text-muted-foreground text-xs">({item.slug})</span></p>}
          />
          {artistCategories.editing && (
            <AdminForm onSave={() => artistCategories.save(artistCategories.editing!)} onCancel={() => artistCategories.setEditing(null)} saving={artistCategories.saving}>
              <AdminField label="name" value={artistCategories.editing.name} onChange={(v) => artistCategories.setEditing({ ...artistCategories.editing!, name: v })} />
              <AdminField label="slug" value={artistCategories.editing.slug} onChange={(v) => artistCategories.setEditing({ ...artistCategories.editing!, slug: v })} />
              <AdminField label="display_order" value={artistCategories.editing.display_order} onChange={(v) => artistCategories.setEditing({ ...artistCategories.editing!, display_order: parseInt(v) || 0 })} />
            </AdminForm>
          )}
        </div>

        {/* Artists list */}
        <div className="mt-4">
          <h4 className="text-xs font-mono text-muted-foreground uppercase mb-2">Artistes</h4>
          <AdminList
            items={artists.data}
            isLoading={artists.isLoading}
            label="artiste"
            onAdd={() => artists.setEditing({ name: "", image_url: "", category_id: "", display_order: artists.data.length } as any)}
            onEdit={(item) => artists.setEditing(item)}
            onDelete={artists.remove}
            renderItem={(item) => (
              <div className="flex items-center gap-2">
                {item.image_url && <img src={item.image_url} alt="" className="w-8 h-8 rounded object-cover shrink-0" />}
                <p className="text-sm text-foreground">{item.name} <span className="text-muted-foreground text-xs">({getCatName(item.category_id)})</span></p>
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
      </Section>

      {/* ═══ CLIENTS ═══ */}
      <Section title="Clients & Références" icon="🏢">
        <ClientPreviewGrid clients={clients.data} />

        <div className="mt-4">
          <h4 className="text-xs font-mono text-muted-foreground uppercase mb-2">Catégories</h4>
          <AdminList
            items={clientCategories.data}
            isLoading={clientCategories.isLoading}
            label="catégorie"
            onAdd={() => clientCategories.setEditing({ name: "", display_order: clientCategories.data.length } as any)}
            onEdit={(item) => clientCategories.setEditing(item)}
            onDelete={clientCategories.remove}
            renderItem={(item) => <p className="text-sm text-foreground">{item.name}</p>}
          />
          {clientCategories.editing && (
            <AdminForm onSave={() => clientCategories.save(clientCategories.editing!)} onCancel={() => clientCategories.setEditing(null)} saving={clientCategories.saving}>
              <AdminField label="name" value={clientCategories.editing.name} onChange={(v) => clientCategories.setEditing({ ...clientCategories.editing!, name: v })} />
              <AdminField label="display_order" value={clientCategories.editing.display_order} onChange={(v) => clientCategories.setEditing({ ...clientCategories.editing!, display_order: parseInt(v) || 0 })} />
            </AdminForm>
          )}
        </div>

        <div className="mt-4">
          <h4 className="text-xs font-mono text-muted-foreground uppercase mb-2">Clients</h4>
          <AdminList
            items={clients.data}
            isLoading={clients.isLoading}
            label="client"
            onAdd={() => clients.setEditing({ name: "", logo_url: "", category_id: "", display_order: clients.data.length } as any)}
            onEdit={(item) => clients.setEditing(item)}
            onDelete={clients.remove}
            renderItem={(item) => (
              <div className="flex items-center gap-2">
                {item.logo_url && <img src={item.logo_url} alt="" className="w-8 h-6 object-contain opacity-60 grayscale shrink-0" />}
                <p className="text-sm text-foreground">{item.name} <span className="text-muted-foreground text-xs">({getClientCatName(item.category_id)})</span></p>
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
      </Section>

      {/* ═══ PACKS ═══ */}
      <Section title="Packs & Tarifs" icon="💰">
        {/* Preview */}
        <div className="flex gap-3 mb-4 flex-wrap">
          {packs.data.map((p: any) => (
            <div key={p.id} className={`rounded-xl border px-4 py-3 min-w-[140px] ${p.featured ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
              <p className="text-[10px] text-muted-foreground font-mono">{p.number}</p>
              <p className="text-sm font-bold text-foreground">{p.name}</p>
              <p className="text-primary font-clash font-bold mt-1">{p.price}<span className="text-xs text-muted-foreground ml-1">{p.price_suffix}</span></p>
              {p.badge && <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px]">{p.badge}</span>}
            </div>
          ))}
        </div>
        <AdminList
          items={packs.data}
          isLoading={packs.isLoading}
          label="pack"
          onAdd={() => packs.setEditing({ name: "", number: "", subtitle: "", price: "", price_suffix: "HT", badge: "", bonus: "", reassurance: "", featured: false, display_order: packs.data.length } as any)}
          onEdit={(item) => packs.setEditing(item)}
          onDelete={packs.remove}
          renderItem={(item) => (
            <p className="text-sm text-foreground">{item.number}. {item.name} — {item.price} {item.price_suffix} {item.featured ? "⭐" : ""}</p>
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
      </Section>

      {/* ═══ PORTFOLIO ═══ */}
      <Section title="Portfolio / Cas clients" icon="📁">
        <AdminList
          items={portfolio.data}
          isLoading={portfolio.isLoading}
          label="cas"
          onAdd={() => portfolio.setEditing({ icon: "🎯", tag: "", title: "", description: "", display_order: portfolio.data.length } as any)}
          onEdit={(item) => portfolio.setEditing(item)}
          onDelete={portfolio.remove}
          renderItem={(item) => (
            <p className="text-sm text-foreground">{item.icon} {item.title} <span className="text-muted-foreground text-xs">({item.tag})</span></p>
          )}
        />
        {portfolio.editing && (
          <AdminForm onSave={() => portfolio.save(portfolio.editing!)} onCancel={() => portfolio.setEditing(null)} saving={portfolio.saving}>
            <AdminField label="icon" value={portfolio.editing.icon} onChange={(v) => portfolio.setEditing({ ...portfolio.editing!, icon: v })} />
            <AdminField label="tag" value={portfolio.editing.tag} onChange={(v) => portfolio.setEditing({ ...portfolio.editing!, tag: v })} />
            <AdminField label="title" value={portfolio.editing.title} onChange={(v) => portfolio.setEditing({ ...portfolio.editing!, title: v })} />
            <AdminField label="description" type="textarea" value={portfolio.editing.description} onChange={(v) => portfolio.setEditing({ ...portfolio.editing!, description: v })} />
            <AdminField label="display_order" value={portfolio.editing.display_order} onChange={(v) => portfolio.setEditing({ ...portfolio.editing!, display_order: parseInt(v) || 0 })} />
          </AdminForm>
        )}
      </Section>

      {/* ═══ SERVICES ═══ */}
      <Section title="Services (Pôle Artiste)" icon="🎵">
        <AdminList
          items={services.data}
          isLoading={services.isLoading}
          label="service"
          onAdd={() => services.setEditing({ number: "", title: "", description: "", display_order: services.data.length } as any)}
          onEdit={(item) => services.setEditing(item)}
          onDelete={services.remove}
          renderItem={(item) => <p className="text-sm text-foreground">{item.number}. {item.title}</p>}
        />
        {services.editing && (
          <AdminForm onSave={() => services.save(services.editing!)} onCancel={() => services.setEditing(null)} saving={services.saving}>
            <AdminField label="number" value={services.editing.number} onChange={(v) => services.setEditing({ ...services.editing!, number: v })} />
            <AdminField label="title" value={services.editing.title} onChange={(v) => services.setEditing({ ...services.editing!, title: v })} />
            <AdminField label="description" type="textarea" value={services.editing.description} onChange={(v) => services.setEditing({ ...services.editing!, description: v })} />
            <AdminField label="display_order" value={services.editing.display_order} onChange={(v) => services.setEditing({ ...services.editing!, display_order: parseInt(v) || 0 })} />
          </AdminForm>
        )}
      </Section>

      <Section title="Services (Pôle Entreprise)" icon="🏷️">
        <AdminList
          items={servicesEnt.data}
          isLoading={servicesEnt.isLoading}
          label="service"
          onAdd={() => servicesEnt.setEditing({ number: "", title: "", description: "", display_order: servicesEnt.data.length } as any)}
          onEdit={(item) => servicesEnt.setEditing(item)}
          onDelete={servicesEnt.remove}
          renderItem={(item) => <p className="text-sm text-foreground">{item.number}. {item.title}</p>}
        />
        {servicesEnt.editing && (
          <AdminForm onSave={() => servicesEnt.save(servicesEnt.editing!)} onCancel={() => servicesEnt.setEditing(null)} saving={servicesEnt.saving}>
            <AdminField label="number" value={servicesEnt.editing.number} onChange={(v) => servicesEnt.setEditing({ ...servicesEnt.editing!, number: v })} />
            <AdminField label="title" value={servicesEnt.editing.title} onChange={(v) => servicesEnt.setEditing({ ...servicesEnt.editing!, title: v })} />
            <AdminField label="description" type="textarea" value={servicesEnt.editing.description} onChange={(v) => servicesEnt.setEditing({ ...servicesEnt.editing!, description: v })} />
            <AdminField label="display_order" value={servicesEnt.editing.display_order} onChange={(v) => servicesEnt.setEditing({ ...servicesEnt.editing!, display_order: parseInt(v) || 0 })} />
          </AdminForm>
        )}
      </Section>

      {/* ═══ CONTACT & SOCIAL ═══ */}
      <Section title="Contact & Réseaux" icon="📞">
        <AdminList
          items={settings.data.filter((s: any) => ["contact_email", "contact_phone", "social_instagram", "social_tiktok", "social_linkedin"].includes(s.key))}
          isLoading={settings.isLoading}
          label="info"
          idField="key"
          onAdd={() => {}}
          onEdit={(item) => settings.setEditing(item)}
          onDelete={(pkValue) => settings.remove(pkValue)}
          renderItem={(item) => (
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{SETTING_LABELS[item.key] || item.key}</p>
              <p className="text-xs text-muted-foreground truncate">{item.value}</p>
            </div>
          )}
        />
      </Section>

      {/* ═══ TEXTES VISION & CTA ═══ */}
      <Section title="Textes (Vision, CTA)" icon="✍️">
        <AdminList
          items={settings.data.filter((s: any) => ["vision_quote", "vision_text", "cta_title", "cta_subtitle"].includes(s.key))}
          isLoading={settings.isLoading}
          label="texte"
          idField="key"
          onAdd={() => {}}
          onEdit={(item) => settings.setEditing(item)}
          onDelete={(pkValue) => settings.remove(pkValue)}
          renderItem={(item) => (
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{SETTING_LABELS[item.key] || item.key}</p>
              <p className="text-xs text-muted-foreground truncate">{item.value}</p>
            </div>
          )}
        />
      </Section>
    </div>
  );
}

const SETTING_LABELS: Record<string, string> = {
  logo_white: "🎨 Logo blanc",
  logo_green: "🎨 Logo vert",
  contact_email: "📧 Email",
  contact_phone: "📱 Téléphone / WhatsApp",
  social_instagram: "📸 Instagram",
  social_tiktok: "🎵 TikTok",
  social_linkedin: "💼 LinkedIn",
  hero_title_line1: "🏠 Héro — Ligne 1",
  hero_title_accent: "🏠 Héro — Accent",
  hero_subtitle: "🏠 Héro — Sous-titre",
  vision_quote: "👁️ Vision — Citation",
  vision_text: "👁️ Vision — Texte",
  cta_title: "📢 CTA — Titre",
  cta_subtitle: "📢 CTA — Sous-titre",
};
