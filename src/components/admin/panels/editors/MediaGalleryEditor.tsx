import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Loader2, Trash2, Check, Images } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "../../ImageUpload";

/**
 * Galerie multi-images générique.
 *
 * - Stocke toutes les images dans `media_galleries` (owner_table, owner_id, url).
 * - L'image "active" est référencée ailleurs (table métier OU site_settings).
 * - Click sur une vignette = la définit comme image principale.
 * - Upload = ajoute à la galerie sans toucher à l'active.
 * - Suppression = retire de la galerie (et bascule sur une autre si c'était l'active).
 *
 * Deux modes de stockage de l'URL active :
 *  1. mode="row"      → update {targetTable}.{targetColumn} where id=ownerId
 *  2. mode="setting"  → upsert site_settings(key=settingKey, value=url)
 */
type RowMode = {
  mode: "row";
  targetTable: string;
  targetColumn: string; // ex: "image_url", "logo_url"
  invalidateKeys?: string[][];
};
type SettingMode = {
  mode: "setting";
  settingKey: string;
  invalidateKeys?: string[][];
};

type Props = {
  ownerTable: string;
  ownerId: string;
  /** Optionnel : valeur initiale de l'URL active. La vraie source de vérité est lue ci-dessous depuis la BDD. */
  currentUrl?: string;
  folder?: string;
  title?: string;
  helper?: string;
  aspect?: "portrait" | "square" | "landscape" | "video";
  /** Si true, accepte les vidéos (mp4) en plus des images. */
  allowVideo?: boolean;
} & (RowMode | SettingMode);

export default function MediaGalleryEditor(props: Props) {
  const {
    ownerTable, ownerId,
    folder = "uploads",
    title = "Galerie",
    helper = "Ajoute plusieurs versions sans perdre les anciennes. Clique sur une vignette pour la définir comme principale.",
    aspect = "portrait",
    allowVideo = false,
  } = props;

  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["media_galleries", ownerTable, ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_galleries")
        .select("*")
        .eq("owner_table", ownerTable)
        .eq("owner_id", ownerId)
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
    enabled: Boolean(ownerId),
  });

  // ─── Source de vérité pour "image active" : on lit depuis la BDD ─────
  // Comme ça, peu importe ce qui se passe dans le state du parent,
  // on affiche TOUJOURS la valeur actuellement persistée.
  const { data: liveActiveUrl = "" } = useQuery({
    queryKey: ["media_active_url", ownerTable, ownerId, props.mode === "row" ? props.targetTable : props.settingKey],
    queryFn: async () => {
      if (props.mode === "row") {
        const { data } = await supabase
          .from(props.targetTable as any)
          .select(props.targetColumn)
          .eq("id", ownerId)
          .maybeSingle();
        return ((data as any)?.[props.targetColumn] as string) || "";
      } else {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", props.settingKey)
          .maybeSingle();
        return ((data as any)?.value as string) || "";
      }
    },
    enabled: Boolean(ownerId),
  });

  const currentUrl = liveActiveUrl || props.currentUrl || "";

  const refetch = () => {
    qc.invalidateQueries({ queryKey: ["media_galleries", ownerTable, ownerId] });
    (props.invalidateKeys || []).forEach((k) => qc.invalidateQueries({ queryKey: k }));
  };

  const persistActive = async (url: string) => {
    if (props.mode === "row") {
      const { error } = await supabase
        .from(props.targetTable as any)
        .update({ [props.targetColumn]: url })
        .eq("id", ownerId);
      if (error) throw error;
    } else {
      // setting mode → upsert
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: props.settingKey, value: url, type: "image" }, { onConflict: "key" });
      if (error) throw error;
    }
  };

  const addImage = async (url: string) => {
    if (!url || !ownerId) return;
    setBusy(true);
    try {
      const { error } = await supabase
        .from("media_galleries")
        .insert({ owner_table: ownerTable, owner_id: ownerId, url, display_order: images.length });
      if (error) throw error;
      // si pas d'image active, devient active automatiquement
      if (!currentUrl) await persistActive(url);
      toast.success("Image ajoutée ✓");
      refetch();
    } catch (e: any) {
      toast.error("Erreur : " + e.message);
    } finally {
      setBusy(false);
    }
  };

  const setActive = async (url: string) => {
    setBusy(true);
    try {
      await persistActive(url);
      toast.success("Image principale mise à jour ✓");
      refetch();
    } catch (e: any) {
      toast.error("Erreur : " + e.message);
    } finally {
      setBusy(false);
    }
  };

  const removeImage = async (id: string, url: string) => {
    setBusy(true);
    try {
      const { error } = await supabase.from("media_galleries").delete().eq("id", id);
      if (error) throw error;
      if (url === currentUrl) {
        const remaining = images.filter((i) => i.id !== id);
        const fallback = remaining[0]?.url || "";
        await persistActive(fallback);
      }
      toast.success("Image retirée ✓");
      setConfirmId(null);
      refetch();
    } catch (e: any) {
      toast.error("Erreur : " + e.message);
    } finally {
      setBusy(false);
    }
  };

  const aspectClass =
    aspect === "square" ? "aspect-square" :
    aspect === "landscape" ? "aspect-video" :
    "aspect-[3/4]";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <Images size={16} className="text-slate-600" />
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider ml-auto">
          {images.length} image{images.length > 1 ? "s" : ""}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-4">{helper}</p>

      {!ownerId ? (
        <p className="text-xs text-slate-400 italic py-4 text-center">
          Enregistre d'abord cet élément pour pouvoir y attacher des images.
        </p>
      ) : isLoading ? (
        <div className="py-8 flex items-center justify-center text-slate-400 gap-2">
          <Loader2 size={14} className="animate-spin" /> Chargement…
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {images.map((img) => {
            const isActive = img.url === currentUrl;
            return (
              <div
                key={img.id}
                className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                  isActive ? "border-emerald-500 shadow-md" : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <button
                  type="button"
                  onClick={() => !isActive && setActive(img.url)}
                  disabled={busy || isActive}
                  className={`block w-full ${aspectClass} bg-slate-100`}
                  title={isActive ? "Image principale" : "Définir comme image principale"}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>

                {isActive && (
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-mono uppercase tracking-wider flex items-center gap-1">
                    <Check size={10} /> Active
                  </span>
                )}

                {confirmId === img.id ? (
                  <div className="absolute inset-x-1 bottom-1 flex gap-1">
                    <button
                      onClick={() => removeImage(img.id, img.url)}
                      className="flex-1 px-1 py-1 rounded bg-red-500 text-white text-[10px] font-medium hover:bg-red-600"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="px-1.5 py-1 rounded bg-white/90 text-slate-700 text-[10px]"
                    >
                      Non
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(img.id)}
                    className="absolute top-1.5 right-1.5 p-1 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                    title="Supprimer"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            );
          })}

          {images.length === 0 && (
            <p className="col-span-full text-xs text-slate-400 italic py-4 text-center">
              Aucune image dans la galerie pour le moment.
            </p>
          )}
        </div>
      )}

      {ownerId && (
        <div>
          <p className="text-[11px] font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-semibold">
            + Ajouter une nouvelle image
          </p>
          <ImageUpload value="" onChange={addImage} folder={folder} />
        </div>
      )}
    </section>
  );
}
