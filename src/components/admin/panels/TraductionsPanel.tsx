import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BASE_DICTIONARY, setRuntimeOverrides } from "@/lib/i18n/dictionary";
import { toast } from "sonner";
import { Save, Plus, Trash2, Search, Download } from "lucide-react";

type Row = { fr: string; en: string; source: "base" | "admin" };

const PREFIX = "i18n.en.";

export default function TraductionsPanel() {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "missing" | "translated">("all");
  const [newFr, setNewFr] = useState("");
  const [newEn, setNewEn] = useState("");
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key,value")
        .like("key", `${PREFIX}%`);
      if (data) {
        const map: Record<string, string> = {};
        for (const r of data) {
          const fr = r.key.slice(PREFIX.length);
          try { map[decodeURIComponent(fr)] = r.value; } catch { map[fr] = r.value; }
        }
        setOverrides(map);
        setRuntimeOverrides(map);
      }
    })();
  }, []);

  const rows: Row[] = useMemo(() => {
    const all = new Map<string, Row>();
    for (const [fr, en] of Object.entries(BASE_DICTIONARY)) {
      all.set(fr, { fr, en, source: "base" });
    }
    for (const [fr, en] of Object.entries(overrides)) {
      all.set(fr, { fr, en, source: "admin" });
    }
    let list = Array.from(all.values());
    if (filter === "missing") list = list.filter(r => !r.en?.trim());
    if (filter === "translated") list = list.filter(r => !!r.en?.trim());
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r => r.fr.toLowerCase().includes(q) || r.en.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.fr.localeCompare(b.fr));
  }, [overrides, search, filter]);

  const saveOne = async (fr: string, en: string) => {
    setSavingKey(fr);
    const key = `${PREFIX}${encodeURIComponent(fr)}`;
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value: en, type: "text" }, { onConflict: "key" });
    setSavingKey(null);
    if (error) {
      toast.error("Erreur de sauvegarde");
      return;
    }
    const next = { ...overrides, [fr]: en };
    setOverrides(next);
    setRuntimeOverrides(next);
    toast.success("Traduction enregistrée");
  };

  const removeOne = async (fr: string) => {
    const key = `${PREFIX}${encodeURIComponent(fr)}`;
    const { error } = await supabase.from("site_settings").delete().eq("key", key);
    if (error) {
      toast.error("Erreur de suppression");
      return;
    }
    const next = { ...overrides };
    delete next[fr];
    setOverrides(next);
    setRuntimeOverrides(next);
    toast.success("Traduction supprimée");
  };

  const addNew = async () => {
    if (!newFr.trim() || !newEn.trim()) {
      toast.error("Renseigne FR et EN");
      return;
    }
    await saveOne(newFr.trim(), newEn.trim());
    setNewFr("");
    setNewEn("");
  };

  const exportJson = () => {
    const merged: Record<string, string> = { ...BASE_DICTIONARY, ...overrides };
    const blob = new Blob([JSON.stringify(merged, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "translations_en.json";
    a.click(); URL.revokeObjectURL(url);
  };

  const totalBase = Object.keys(BASE_DICTIONARY).length;
  const totalAdmin = Object.keys(overrides).length;

  return (
    <div data-i18n-skip className="space-y-6">
      <div>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Traductions EN</h2>
        <p className="text-sm text-slate-500 mt-1">
          Gestion manuelle des traductions françaises → anglaises affichées sur le site quand l'utilisateur active EN.
          {totalBase} entrées de base • {totalAdmin} ajoutées depuis l'admin.
        </p>
      </div>

      {/* Add new */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">Ajouter une traduction</p>
        <div className="grid md:grid-cols-[1fr_1fr_auto] gap-2">
          <input
            value={newFr}
            onChange={(e) => setNewFr(e.target.value)}
            placeholder="Texte français exact (ex: Découvrir nos pôles)"
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
          />
          <input
            value={newEn}
            onChange={(e) => setNewEn(e.target.value)}
            placeholder="English version"
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
          />
          <button
            onClick={addNew}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-2"
          >
            <Plus size={14} /> Ajouter
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
          />
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {(["all", "translated", "missing"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs rounded-md ${filter === f ? "bg-white shadow text-slate-900" : "text-slate-500"}`}
            >
              {f === "all" ? "Toutes" : f === "translated" ? "Traduites" : "Manquantes"}
            </button>
          ))}
        </div>
        <button
          onClick={exportJson}
          className="px-3 py-2 border border-slate-200 rounded-lg text-xs flex items-center gap-1.5 hover:bg-slate-50"
        >
          <Download size={13} /> Export JSON
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-mono uppercase tracking-wider text-slate-500">
            <tr>
              <th className="text-left px-4 py-2.5 w-[45%]">Français (clé)</th>
              <th className="text-left px-4 py-2.5">English</th>
              <th className="px-3 py-2.5 w-[140px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <RowEditor
                key={row.fr}
                row={row}
                saving={savingKey === row.fr}
                onSave={(en) => saveOne(row.fr, en)}
                onRemove={row.source === "admin" ? () => removeOne(row.fr) : undefined}
              />
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={3} className="text-center py-8 text-slate-400 text-sm">Aucun résultat</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RowEditor({
  row, saving, onSave, onRemove,
}: { row: Row; saving: boolean; onSave: (en: string) => void; onRemove?: () => void }) {
  const [val, setVal] = useState(row.en);
  useEffect(() => { setVal(row.en); }, [row.en]);
  const dirty = val !== row.en;
  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50/50">
      <td className="px-4 py-2 align-top">
        <span className="text-slate-700 font-medium">{row.fr}</span>
        <span className={`ml-2 text-[10px] font-mono uppercase ${row.source === "base" ? "text-slate-400" : "text-emerald-600"}`}>
          {row.source === "base" ? "défaut" : "admin"}
        </span>
      </td>
      <td className="px-4 py-2">
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-slate-400"
        />
      </td>
      <td className="px-3 py-2 text-right">
        <div className="flex gap-1 justify-end">
          <button
            onClick={() => onSave(val)}
            disabled={!dirty || saving}
            className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-30"
            title="Enregistrer"
          >
            <Save size={14} />
          </button>
          {onRemove && (
            <button onClick={onRemove} className="p-1.5 rounded-md text-red-500 hover:bg-red-50" title="Supprimer">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
