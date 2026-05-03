import { useState, useEffect, useMemo, ReactNode } from "react";
import { Plus, Trash2, Loader2, Check, X } from "lucide-react";
import { useAdminCrud } from "../../useAdminCrud";
import AdminField from "../../AdminField";
import type { FieldDef } from "./TableEditor";
import { isTranslatableKey, isTranslatableType, setEnField } from "@/lib/i18n/adminTranslate";

interface Props {
  table: string;
  title: string;
  description?: string;
  fields: FieldDef[];
  initialRecord?: Record<string, any>;
  /** Filtre optionnel sur les rows */
  filter?: (row: any) => boolean;
  /** Label de chaque onglet (recevra l'item + son index) */
  renderTabLabel: (item: any, index: number) => string;
  /** Sous-éditeur(s) à afficher sous le formulaire principal de l'item actif */
  renderSubEditors?: (item: any) => ReactNode;
  /** Singulier pour le bouton "+ Ajouter un X" */
  itemNoun: string;
  orderBy?: string;
  /** Couleur d'accent (hue HSL) — défaut indigo */
  accentHue?: number;
}

/**
 * Éditeur "tabbed" : header de cartes-onglets + formulaire toujours ouvert
 * sur l'item sélectionné. Pensé pour les entités riches (packs, piliers, artistes).
 */
export default function TabbedEditor({
  table, title, description, fields, initialRecord, filter,
  renderTabLabel, renderSubEditors, itemNoun, orderBy, accentHue = 240,
}: Props) {
  const crud = useAdminCrud<any>(table, { orderBy });
  const items = useMemo(
    () => (filter ? (crud.data as any[]).filter(filter) : (crud.data as any[])),
    [crud.data, filter]
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, any> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Auto-sélectionne le 1er item au chargement
  useEffect(() => {
    if (!activeId && items.length > 0) {
      setActiveId(items[0].id);
    }
    if (activeId && !items.find((i) => i.id === activeId)) {
      setActiveId(items[0]?.id || null);
    }
  }, [items, activeId]);

  const activeItem = items.find((i) => i.id === activeId);

  // Resync draft quand on change d'item
  useEffect(() => {
    if (activeItem) {
      const { created_at, updated_at, ...clean } = activeItem;
      setDraft(clean);
      setConfirmDelete(false);
    } else {
      setDraft(null);
    }
  }, [activeId, activeItem?.updated_at]);

  const handleAdd = async () => {
    const base = { display_order: items.length, ...(initialRecord || {}) };
    await crud.save(base as any);
    // Le nouvel item sera sélectionné via le useEffect après refetch
  };

  const handleSave = () => {
    if (draft) crud.save(draft as any);
  };

  const handleDelete = () => {
    if (activeId) crud.remove(activeId);
    setConfirmDelete(false);
  };

  const isDirty = useMemo(() => {
    if (!draft || !activeItem) return false;
    return Object.keys(draft).some((k) => {
      const a = draft[k];
      const b = (activeItem as any)[k];
      if (Array.isArray(a) && Array.isArray(b)) return JSON.stringify(a) !== JSON.stringify(b);
      return a !== b;
    });
  }, [draft, activeItem]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6 shadow-sm">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-clash text-base font-bold text-slate-900">{title}</h3>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        <button
          onClick={handleAdd}
          disabled={crud.saving}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 shrink-0"
        >
          <Plus size={13} /> Ajouter un {itemNoun}
        </button>
      </header>

      {crud.isLoading ? (
        <div className="py-12 flex items-center justify-center text-slate-400 gap-2">
          <Loader2 size={16} className="animate-spin" /> Chargement…
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60">
          <p className="text-sm text-slate-500 mb-3">Aucun {itemNoun} pour le moment</p>
          <button
            onClick={handleAdd}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            + Créer le premier
          </button>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 mb-5">
            {items.map((item, i) => {
              const isActive = item.id === activeId;
              const num = String(i + 1).padStart(2, "0");
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`text-left p-3 rounded-xl border-2 transition-all ${
                    isActive
                      ? "border-slate-900 bg-slate-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
                      style={{
                        background: `hsla(${accentHue}, 70%, 50%, 0.12)`,
                        color: `hsl(${accentHue}, 60%, 35%)`,
                      }}
                    >
                      {num}
                    </span>
                    <p className={`text-sm leading-snug truncate ${isActive ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                      {renderTabLabel(item, i)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Édition de l'item actif */}
          {activeItem && draft && (
            <div className="rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50/30 to-white p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-mono text-indigo-600 uppercase tracking-wider font-semibold">
                  ✎ Édition — {renderTabLabel(activeItem, items.findIndex((i) => i.id === activeId))}
                </p>
                {confirmDelete ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-600">Supprimer ?</span>
                    <button
                      onClick={handleDelete}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                    >
                      Non
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={12} /> Supprimer
                  </button>
                )}
              </div>

              <div className="grid gap-4">
                {fields.map((f) => {
                  const translatable = isTranslatableKey(f.key) && isTranslatableType(f.type);
                  const enValue = translatable ? (draft?.translations?.en?.[f.key] ?? "") : "";
                  return (
                    <AdminField
                      key={f.key}
                      label={f.label || f.key}
                      type={f.type as any}
                      options={f.options}
                      placeholder={f.placeholder}
                      imageFolder={f.imageFolder}
                      hint={f.hint}
                      value={draft[f.key]}
                      onChange={(v) => {
                        const val = f.type === "number" ? (parseInt(v) || 0) : v;
                        setDraft({ ...draft, [f.key]: val });
                      }}
                      translation={translatable ? {
                        value: enValue,
                        onChange: (v) => {
                          const nextT = setEnField(draft?.translations, f.key, v);
                          setDraft({ ...draft, translations: nextT });
                        },
                      } : undefined}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-200">
                <button
                  onClick={handleSave}
                  disabled={!isDirty || crud.saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all disabled:opacity-40 shadow-sm"
                >
                  {crud.saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {crud.saving ? "Enregistrement…" : "Enregistrer"}
                </button>
                {isDirty && (
                  <button
                    onClick={() => {
                      const { created_at, updated_at, ...clean } = activeItem;
                      setDraft(clean);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm hover:bg-slate-50"
                  >
                    <X size={14} /> Annuler
                  </button>
                )}
                {!isDirty && (
                  <span className="text-xs text-slate-400 italic">Aucune modification</span>
                )}
              </div>

              {/* Sous-éditeurs (features pack, items pillar, etc.) */}
              {renderSubEditors && (
                <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-200 space-y-4">
                  {renderSubEditors(activeItem)}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
