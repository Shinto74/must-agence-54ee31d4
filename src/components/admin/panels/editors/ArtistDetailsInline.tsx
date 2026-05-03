import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminField from "../../AdminField";
import { setEnField } from "@/lib/i18n/adminTranslate";

/**
 * Fiche détaillée d'un artiste (1-1 avec artists).
 * Si la ligne n'existe pas encore dans `artist_details`, elle sera créée
 * automatiquement à la première sauvegarde (upsert sur artist_id).
 *
 * Affichée comme sous-éditeur dans l'onglet d'un artiste (TabbedEditor).
 */
export default function ArtistDetailsInline({ artistId }: { artistId: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["artist_details", artistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artist_details")
        .select("*")
        .eq("artist_id", artistId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [draft, setDraft] = useState<{
    strategie: string; description: string; chiffre: string; plateformes: string;
    translations: any;
  }>({
    strategie: "", description: "", chiffre: "", plateformes: "", translations: {},
  });
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft({
      strategie: data?.strategie ?? "",
      description: data?.description ?? "",
      chiffre: data?.chiffre ?? "",
      plateformes: Array.isArray(data?.plateformes) ? data!.plateformes.join(", ") : "",
      translations: (data as any)?.translations ?? {},
    });
  }, [data, artistId]);

  const initialPlateformes = Array.isArray(data?.plateformes)
    ? data!.plateformes.join(", ")
    : "";
  const isDirty =
    draft.strategie !== (data?.strategie ?? "") ||
    draft.description !== (data?.description ?? "") ||
    draft.chiffre !== (data?.chiffre ?? "") ||
    draft.plateformes !== initialPlateformes ||
    JSON.stringify(draft.translations || {}) !== JSON.stringify((data as any)?.translations || {});

  const handleSave = async () => {
    setSaving(true);
    const plateformes = draft.plateformes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: any = {
      artist_id: artistId,
      strategie: draft.strategie,
      description: draft.description,
      chiffre: draft.chiffre,
      plateformes,
      translations: draft.translations || {},
    };

    let error;
    if (data?.id) {
      ({ error } = await supabase
        .from("artist_details")
        .update(payload)
        .eq("id", data.id));
    } else {
      ({ error } = await supabase.from("artist_details").insert(payload));
    }

    setSaving(false);
    if (!error) {
      setSavedAt(Date.now());
      qc.invalidateQueries({ queryKey: ["artist_details", artistId] });
      qc.invalidateQueries({ queryKey: ["artist_details_all"] });
      qc.invalidateQueries({ queryKey: ["artist_details"] });
      setTimeout(() => setSavedAt(null), 2200);
    }
  };

  const enFor = (k: string) => draft.translations?.en?.[k] ?? "";
  const setEn = (k: string, v: string) => setDraft({ ...draft, translations: setEnField(draft.translations, k, v) });

  return (
    <section className="rounded-xl border border-amber-200/60 bg-gradient-to-br from-amber-50/40 to-white p-5">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-mono text-amber-700 uppercase tracking-wider font-semibold">
            ★ Fiche détaillée (popup au clic)
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Ces infos s'affichent dans la popup quand un visiteur clique sur cet artiste.
          </p>
        </div>
        {data?.id ? (
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
            Fiche existante
          </span>
        ) : (
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">
            À créer
          </span>
        )}
      </header>

      {isLoading ? (
        <div className="py-6 flex items-center justify-center text-slate-400 gap-2 text-sm">
          <Loader2 size={14} className="animate-spin" /> Chargement…
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            <AdminField
              label="Titre stratégie"
              value={draft.strategie}
              onChange={(v) => setDraft({ ...draft, strategie: v })}
              placeholder="Direction Artistique & Lancement Album"
              translation={{ value: enFor("strategie"), onChange: (v) => setEn("strategie", v) }}
            />
            <AdminField
              label="Description"
              type="textarea"
              value={draft.description}
              onChange={(v) => setDraft({ ...draft, description: v })}
              placeholder="Quelques phrases sur la collaboration, le contexte, les leviers utilisés."
              translation={{ value: enFor("description"), onChange: (v) => setEn("description", v) }}
            />
            <AdminField
              label="Chiffre clé (KPI affiché en gros)"
              value={draft.chiffre}
              onChange={(v) => setDraft({ ...draft, chiffre: v })}
              placeholder="+20M streams"
              hint="Visible en grand dans la popup. Laissez vide pour ne rien afficher."
              translation={{ value: enFor("chiffre"), onChange: (v) => setEn("chiffre", v) }}
            />
            <AdminField
              label="Plateformes (séparées par virgules)"
              value={draft.plateformes}
              onChange={(v) => setDraft({ ...draft, plateformes: v })}
              placeholder="Spotify, YouTube, TikTok, Instagram"
              hint="Étiquettes affichées en bas de la popup. Les noms de plateformes ne se traduisent pas."
            />
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-amber-200/60">
            <button
              onClick={handleSave}
              disabled={!isDirty || saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-all disabled:opacity-40 shadow-sm"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              {saving ? "Enregistrement…" : "Enregistrer la fiche"}
            </button>
            {savedAt && (
              <span className="text-xs text-emerald-600 font-medium">✓ Enregistré</span>
            )}
            {!isDirty && !savedAt && (
              <span className="text-xs text-slate-400 italic">Aucune modification</span>
            )}
          </div>
        </>
      )}
    </section>
  );
}
