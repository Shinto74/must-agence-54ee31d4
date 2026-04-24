import { useState, useEffect } from "react";
import { useAdminCrud } from "../useAdminCrud";
import AdminField from "../AdminField";
import AdminForm from "../AdminForm";
import AdminList from "../AdminList";
import { cn } from "@/lib/utils";
import {
  Megaphone, Globe2, Sparkles, Film, Lightbulb, ListChecks, Type,
} from "lucide-react";

type SubKey =
  | "identite" | "marquee" | "sectors" | "theartist" | "clip"
  | "expertise" | "process" | "textes_artiste" | "textes_entreprise" | "textes_home";

const SUBS: { key: SubKey; label: string; icon: any; desc: string }[] = [
  { key: "identite",  label: "Logos & Identité",    icon: Sparkles,   desc: "Logos blanc/vert, nom de marque, contact" },
  { key: "marquee",   label: "Bandeaux défilants",  icon: Megaphone,  desc: "Mots et logos défilants par page" },
  { key: "sectors",   label: "Secteurs Entreprise", icon: Globe2,     desc: "Cards de l'orbite 3D côté entreprise" },
  { key: "theartist", label: "TheArtist",           icon: Sparkles,   desc: "Pills features & textes" },
  { key: "clip",      label: "Clip Portugal",       icon: Film,       desc: "Avantages affichés & textes" },
  { key: "expertise", label: "Piliers d'expertise", icon: Lightbulb,  desc: "Artiste & Entreprise" },
  { key: "process",   label: "Étapes du process",   icon: ListChecks, desc: "Artiste & Entreprise" },
  { key: "textes_home",       label: "Textes — Accueil",    icon: Type, desc: "Hero, Vision, CTA accueil" },
  { key: "textes_artiste",    label: "Textes — Artiste",    icon: Type, desc: "Hero, sections page artiste" },
  { key: "textes_entreprise", label: "Textes — Entreprise", icon: Type, desc: "Hero, sections page entreprise" },
];

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
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

/* ─── Settings sub-editor (filter by prefix) ─── */
function SettingRow({ k, label, multiline, type }: { k: string; label: string; multiline?: boolean; type?: "image" }) {
  const crud = useAdminCrud("site_settings", { idField: "key", orderBy: "key" });
  const dbValue = crud.data.find((s: any) => s.key === k)?.value || "";
  const [local, setLocal] = useState<string>(dbValue);
  const [touched, setTouched] = useState(false);

  // Sync from DB when not currently editing
  useEffect(() => {
    if (!touched) setLocal(dbValue);
  }, [dbValue, touched]);

  const handleSave = async () => {
    await crud.save({ key: k, value: local, type: type === "image" ? "image" : multiline ? "textarea" : "text" } as any);
    setTouched(false);
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/40">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5">{label}</p>
        {type === "image" ? (
          <AdminField
            label=""
            type="image"
            value={local}
            onChange={(v) => { setLocal(v); setTouched(true); }}
            imageFolder="settings"
          />
        ) : multiline ? (
          <textarea
            value={local}
            onChange={(e) => { setLocal(e.target.value); setTouched(true); }}
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-400"
          />
        ) : (
          <input
            type="text"
            value={local}
            onChange={(e) => { setLocal(e.target.value); setTouched(true); }}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-400"
          />
        )}
      </div>
      <button
        onClick={handleSave}
        disabled={crud.saving || !touched}
        className="shrink-0 px-3 py-2 mt-6 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {touched ? "Enregistrer" : "✓"}
      </button>
    </div>
  );
}

function SettingsList({ keys }: { keys: { key: string; label: string; multiline?: boolean; type?: "image" }[] }) {
  return (
    <div className="space-y-3">
      {keys.map((k) => (
        <SettingRow key={k.key} k={k.key} label={k.label} multiline={k.multiline} type={k.type} />
      ))}
    </div>
  );
}

/* ─── Marquee Items ─── */
function MarqueePanel() {
  const [page, setPage] = useState<"home" | "artiste" | "entreprise">("home");
  const crud = useAdminCrud("marquee_items");
  const items = crud.data.filter((i: any) => i.page === page);

  return (
    <Card title="Bandeaux défilants" subtitle="Mots et logos qui défilent dans les marquees">
      <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 w-fit">
        {(["home", "artiste", "entreprise"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-medium transition",
              page === p ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            {p === "home" ? "Accueil" : p === "artiste" ? "Artiste" : "Entreprise"}
          </button>
        ))}
      </div>

      <AdminList
        items={items}
        isLoading={crud.isLoading}
        label="élément"
        onAdd={() =>
          crud.setEditing({ page, kind: "word", text_value: "", image_url: "", display_order: items.length } as any)
        }
        onEdit={(item) => crud.setEditing(item)}
        onDelete={crud.remove}
        renderItem={(item) => (
          <div className="flex items-center gap-3">
            {item.kind === "logo" && item.image_url && (
              <img src={item.image_url} alt="" className="w-10 h-6 object-contain bg-slate-100 rounded p-0.5" />
            )}
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{item.kind}</span>
            <p className="text-sm text-slate-900">{item.text_value}</p>
          </div>
        )}
      />

      {crud.editing && (
        <AdminForm onSave={() => crud.save(crud.editing!)} onCancel={() => crud.setEditing(null)} saving={crud.saving}>
          <AdminField
            label="page"
            type="select"
            options={[
              { label: "Accueil", value: "home" },
              { label: "Artiste", value: "artiste" },
              { label: "Entreprise", value: "entreprise" },
            ]}
            value={crud.editing.page}
            onChange={(v) => crud.setEditing({ ...crud.editing!, page: v })}
          />
          <AdminField
            label="kind"
            type="select"
            options={[{ label: "Mot", value: "word" }, { label: "Logo", value: "logo" }]}
            value={crud.editing.kind}
            onChange={(v) => crud.setEditing({ ...crud.editing!, kind: v })}
          />
          <AdminField
            label="text_value"
            value={crud.editing.text_value}
            onChange={(v) => crud.setEditing({ ...crud.editing!, text_value: v })}
          />
          {crud.editing.kind === "logo" && (
            <AdminField
              label="image_url"
              type="image"
              value={crud.editing.image_url}
              onChange={(v) => crud.setEditing({ ...crud.editing!, image_url: v })}
              imageFolder="marquee"
            />
          )}
          <AdminField
            label="display_order"
            value={crud.editing.display_order}
            onChange={(v) => crud.setEditing({ ...crud.editing!, display_order: parseInt(v) || 0 })}
          />
        </AdminForm>
      )}
    </Card>
  );
}

/* ─── Sectors Entreprise ─── */
function SectorsPanel() {
  const crud = useAdminCrud("entreprise_sectors");
  return (
    <Card title="Secteurs Entreprise" subtitle="Cards affichées dans l'orbite 3D — utilisez l'URL d'une image dans 'icon'">
      <AdminList
        items={crud.data}
        isLoading={crud.isLoading}
        label="secteur"
        onAdd={() => crud.setEditing({ name: "", icon: "", description: "", display_order: crud.data.length } as any)}
        onEdit={(item) => crud.setEditing(item)}
        onDelete={crud.remove}
        renderItem={(item) => (
          <div className="flex items-center gap-3">
            {item.icon && <img src={item.icon} alt="" className="w-10 h-10 object-cover rounded-lg" />}
            <div>
              <p className="text-sm font-medium text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-500 truncate">{item.description}</p>
            </div>
          </div>
        )}
      />
      {crud.editing && (
        <AdminForm onSave={() => crud.save(crud.editing!)} onCancel={() => crud.setEditing(null)} saving={crud.saving}>
          <AdminField label="name" value={crud.editing.name} onChange={(v) => crud.setEditing({ ...crud.editing!, name: v })} />
          <AdminField label="icon (URL image)" type="image" value={crud.editing.icon} onChange={(v) => crud.setEditing({ ...crud.editing!, icon: v })} imageFolder="sectors" />
          <AdminField label="description" type="textarea" value={crud.editing.description} onChange={(v) => crud.setEditing({ ...crud.editing!, description: v })} />
          <AdminField label="display_order" value={crud.editing.display_order} onChange={(v) => crud.setEditing({ ...crud.editing!, display_order: parseInt(v) || 0 })} />
        </AdminForm>
      )}
    </Card>
  );
}

/* ─── TheArtist Features ─── */
function TheArtistPanel() {
  const crud = useAdminCrud("theartist_features");
  return (
    <>
      <Card title="TheArtist — Pills" subtitle="Petites pastilles affichées sous le logo">
        <AdminList
          items={crud.data}
          isLoading={crud.isLoading}
          label="pill"
          onAdd={() => crud.setEditing({ title: "", description: "", display_order: crud.data.length } as any)}
          onEdit={(item) => crud.setEditing(item)}
          onDelete={crud.remove}
          renderItem={(item) => (
            <p className="text-sm"><strong className="text-slate-900">{item.title}</strong> <span className="text-slate-500">— {item.description}</span></p>
          )}
        />
        {crud.editing && (
          <AdminForm onSave={() => crud.save(crud.editing!)} onCancel={() => crud.setEditing(null)} saving={crud.saving}>
            <AdminField label="title" value={crud.editing.title} onChange={(v) => crud.setEditing({ ...crud.editing!, title: v })} />
            <AdminField label="description" value={crud.editing.description} onChange={(v) => crud.setEditing({ ...crud.editing!, description: v })} />
            <AdminField label="display_order" value={crud.editing.display_order} onChange={(v) => crud.setEditing({ ...crud.editing!, display_order: parseInt(v) || 0 })} />
          </AdminForm>
        )}
      </Card>
      <Card title="TheArtist — Textes">
        <SettingsList keys={[
          { key: "theartist_kicker", label: "Petit kicker" },
          { key: "theartist_title_part1", label: "Titre — partie 1" },
          { key: "theartist_title_part2", label: "Titre — partie 2 (accent)" },
          { key: "theartist_cta_label", label: "Bouton — texte" },
          { key: "theartist_cta_url", label: "Bouton — URL" },
          { key: "theartist_footer_text", label: "Texte sous le bouton", multiline: true },
        ]} />
      </Card>
    </>
  );
}

/* ─── Clip Portugal ─── */
function ClipPortugalPanel() {
  const crud = useAdminCrud("clip_portugal_advantages");
  return (
    <>
      <Card title="Clip Portugal — Avantages">
        <AdminList
          items={crud.data}
          isLoading={crud.isLoading}
          label="avantage"
          onAdd={() => crud.setEditing({ title: "", description: "", icon: "", display_order: crud.data.length } as any)}
          onEdit={(item) => crud.setEditing(item)}
          onDelete={crud.remove}
          renderItem={(item) => (
            <p className="text-sm">{item.icon} <strong className="text-slate-900">{item.title}</strong> <span className="text-slate-500">— {item.description}</span></p>
          )}
        />
        {crud.editing && (
          <AdminForm onSave={() => crud.save(crud.editing!)} onCancel={() => crud.setEditing(null)} saving={crud.saving}>
            <AdminField label="icon (emoji ou court texte)" value={crud.editing.icon} onChange={(v) => crud.setEditing({ ...crud.editing!, icon: v })} />
            <AdminField label="title" value={crud.editing.title} onChange={(v) => crud.setEditing({ ...crud.editing!, title: v })} />
            <AdminField label="description" type="textarea" value={crud.editing.description} onChange={(v) => crud.setEditing({ ...crud.editing!, description: v })} />
            <AdminField label="display_order" value={crud.editing.display_order} onChange={(v) => crud.setEditing({ ...crud.editing!, display_order: parseInt(v) || 0 })} />
          </AdminForm>
        )}
      </Card>
      <Card title="Clip Portugal — Textes">
        <SettingsList keys={[
          { key: "clip_portugal_kicker", label: "Kicker" },
          { key: "clip_portugal_title", label: "Titre" },
          { key: "clip_portugal_subtitle", label: "Sous-titre", multiline: true },
          { key: "clip_portugal_video_url", label: "Vidéo — URL" },
          { key: "clip_portugal_cta_label", label: "Bouton — texte" },
        ]} />
      </Card>
    </>
  );
}

/* ─── Expertise (artiste + entreprise) ─── */
function ExpertisePanel() {
  return (
    <>
      <Card title="Expertise — Pôle Artiste"><GenericCrud table="expertise_artiste" /></Card>
      <Card title="Expertise — Pôle Entreprise"><GenericCrud table="expertise_entreprise" /></Card>
    </>
  );
}

/* ─── Process (artiste + entreprise) ─── */
function ProcessPanel() {
  return (
    <>
      <Card title="Process — Pôle Artiste"><GenericCrud table="process_artiste" /></Card>
      <Card title="Process — Pôle Entreprise"><GenericCrud table="process_entreprise" /></Card>
    </>
  );
}

function GenericCrud({ table }: { table: "expertise_artiste" | "expertise_entreprise" | "process_artiste" | "process_entreprise" }) {
  const crud = useAdminCrud(table);
  return (
    <>
      <AdminList
        items={crud.data}
        isLoading={crud.isLoading}
        label="élément"
        onAdd={() => crud.setEditing({ number: String(crud.data.length + 1).padStart(2, "0"), title: "", text: "", display_order: crud.data.length } as any)}
        onEdit={(item) => crud.setEditing(item)}
        onDelete={crud.remove}
        renderItem={(item) => (
          <p className="text-sm"><span className="font-mono text-indigo-600 mr-2">{item.number}</span><strong className="text-slate-900">{item.title}</strong></p>
        )}
      />
      {crud.editing && (
        <AdminForm onSave={() => crud.save(crud.editing!)} onCancel={() => crud.setEditing(null)} saving={crud.saving}>
          <AdminField label="number" value={crud.editing.number} onChange={(v) => crud.setEditing({ ...crud.editing!, number: v })} />
          <AdminField label="title" value={crud.editing.title} onChange={(v) => crud.setEditing({ ...crud.editing!, title: v })} />
          <AdminField label="text" type="textarea" value={crud.editing.text} onChange={(v) => crud.setEditing({ ...crud.editing!, text: v })} />
          <AdminField label="display_order" value={crud.editing.display_order} onChange={(v) => crud.setEditing({ ...crud.editing!, display_order: parseInt(v) || 0 })} />
        </AdminForm>
      )}
    </>
  );
}

/* ─── Main panel ─── */
export default function ContentSectionsPanel() {
  const [active, setActive] = useState<SubKey>("identite");
  const current = SUBS.find((s) => s.key === active)!;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 max-h-[calc(100vh-7rem)] overflow-y-auto">
          <p className="px-3 pt-1 pb-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-medium">
            Contenu site
          </p>
          <nav className="space-y-0.5">
            {SUBS.map((s) => {
              const Icon = s.icon;
              const isActive = active === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setActive(s.key)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon size={15} className={cn("shrink-0", isActive ? "text-indigo-600" : "text-slate-400")} />
                  <span className="flex-1 text-sm font-medium">{s.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="space-y-5 min-w-0">
        <div className="flex items-start gap-3 px-1">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
            <current.icon size={18} />
          </div>
          <div>
            <h2 className="font-clash text-xl font-bold text-slate-900">{current.label}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{current.desc}</p>
          </div>
        </div>

        {active === "identite" && (
          <Card title="Logos & Identité" subtitle="Logos affichés dans le header, footer et sections — uploadez vos PNG transparents">
            <SettingsList keys={[
              { key: "logo_white", label: "Logo blanc (header dark / footer)", type: "image" },
              { key: "logo_green", label: "Logo vert (header accueil / signature)", type: "image" },
              { key: "brand_name", label: "Nom de marque (texte à côté du logo)" },
              { key: "footer_tagline", label: "Footer — Tagline", multiline: true },
              { key: "contact_email", label: "Email de contact" },
              { key: "contact_phone", label: "Téléphone" },
              { key: "contact_location", label: "Localisation" },
            ]} />
          </Card>
        )}
        {active === "marquee" && <MarqueePanel />}
        {active === "sectors" && <SectorsPanel />}
        {active === "theartist" && <TheArtistPanel />}
        {active === "clip" && <ClipPortugalPanel />}
        {active === "expertise" && <ExpertisePanel />}
        {active === "process" && <ProcessPanel />}

        {active === "textes_home" && (
          <Card title="Textes — Page d'accueil">
            <SettingsList keys={[
              { key: "hero_home_badge", label: "Hero — Badge" },
              { key: "hero_home_title", label: "Hero — Titre" },
              { key: "hero_home_subtitle", label: "Hero — Sous-titre", multiline: true },
              { key: "vision_kicker", label: "Vision — Kicker" },
              { key: "vision_title_line1", label: "Vision — Titre ligne 1" },
              { key: "vision_title_line2", label: "Vision — Titre ligne 2 (accent)" },
              { key: "vision_quote", label: "Vision — Citation", multiline: true },
              { key: "vision_text", label: "Vision — Texte", multiline: true },
              { key: "cta_title", label: "CTA Band — Titre" },
              { key: "cta_subtitle", label: "CTA Band — Sous-titre", multiline: true },
            ]} />
          </Card>
        )}

        {active === "textes_artiste" && (
          <Card title="Textes — Page Artiste">
            <SettingsList keys={[
              { key: "hero_artiste_badge", label: "Hero — Badge" },
              { key: "hero_artiste_title", label: "Hero — Titre" },
              { key: "hero_artiste_subtitle", label: "Hero — Sous-titre", multiline: true },
              { key: "hero_artiste_video_url", label: "Hero — URL vidéo de fond" },
              { key: "hero_artiste_cta_label", label: "Hero — Bouton" },
            ]} />
          </Card>
        )}

        {active === "textes_entreprise" && (
          <Card title="Textes — Page Entreprise">
            <SettingsList keys={[
              { key: "hero_entreprise_badge", label: "Hero — Badge" },
              { key: "hero_entreprise_title", label: "Hero — Titre" },
              { key: "hero_entreprise_subtitle", label: "Hero — Sous-titre", multiline: true },
              { key: "hero_entreprise_video_url", label: "Hero — URL vidéo de fond" },
              { key: "hero_entreprise_cta_label", label: "Hero — Bouton" },
              { key: "entreprise_sectors_title", label: "Secteurs — Titre" },
              { key: "entreprise_sectors_subtitle", label: "Secteurs — Sous-titre", multiline: true },
              { key: "entreprise_orbit_title", label: "Orbite — Titre" },
            ]} />
          </Card>
        )}
      </div>
    </div>
  );
}
