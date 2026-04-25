import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { Loader2, Trash2, Check, Images } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "../../ImageUpload";

/**
 * Galerie multi-images pour un artiste donné.
 *  - Liste les photos uploadées (table artist_images).
 *  - Une miniature est marquée "active" = celle dont l'URL = artists.image_url.
 *  - Click sur une miniature = la définit comme active (update artists.image_url).
 *  - Upload = ajoute à la galerie (sans toucher à l'image active).
 *  - Suppression = retire de la galerie (et bascule sur une autre si c'était l'active).
 */
export default function ArtistGalleryEditor({ artistId, currentImageUrl }: { artistId: string; currentImageUrl: string }) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["artist_images", artistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artist_images")
        .select("*")
        .eq("artist_id", artistId)
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
  });

  const activeUrl = useMemo(() => currentImageUrl, [currentImageUrl]);

  const refetch = () => {
    qc.invalidateQueries({ queryKey: ["artist_images", artistId] });
    qc.invalidateQueries({ queryKey: ["admin_artists"] });
    qc.invalidateQueries({ queryKey: ["artists_with_categories"] });
    qc.invalidateQueries({ queryKey: ["artists_raw"] });
  };

  const addImage = async (url: string) => {
    if (!url) return;
    setBusy(true);
    const { error } = await supabase
      .from("artist_images")
      .insert({ artist_id: artistId, url, display_order: images.length });
    setBusy(false);
    if (error) {
      toast.error("Erreur ajout image : " + error.message);
      return;
    }
    toast.success("Image ajoutée à la galerie ✓");
    refetch();
  };

  const setActive = async (url: string) => {
    setBusy(true);
    const { error } = await supabase
      .from("artists")
      .update({ image_url: url })
      .eq("id", artistId);
    setBusy(false);
    if (error) {
      toast.error("Erreur : " + error.message);
      return;
    }
    toast.success("Image principale mise à jour ✓");
    refetch();
  };

  const removeImage = async (id: string, url: string) => {
    setBusy(true);
    const { error } = await supabase.from("artist_images").delete().eq("id", id);
    if (error) {
      setBusy(false);
      toast.error("Erreur suppression : " + error.message);
      return;
    }
    // Si c'était l'image active, bascule sur la première restante
    if (url === activeUrl) {
      const remaining = images.filter((i) => i.id !== id);
      const fallback = remaining[0]?.url || "";
      await supabase.from("artists").update({ image_url: fallback }).eq("id", artistId);
    }
    setBusy(false);
    setConfirmId(null);
    toast.success("Image retirée ✓");
    refetch();
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <Images size={16} className="text-slate-600" />
        <h4 className="text-sm font-semibold text-slate-900">Galerie photos</h4>
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider ml-auto">
          {images.length} image{images.length > 1 ? "s" : ""}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Ajoute plusieurs photos sans perdre les anciennes. Clique sur une vignette pour la définir comme image principale.
      </p>

      {isLoading ? (
        <div className="py-8 flex items-center justify-center text-slate-400 gap-2">
          <Loader2 size={14} className="animate-spin" /> Chargement…
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {images.map((img) => {
            const isActive = img.url === activeUrl;
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
                  className="block w-full aspect-[3/4] bg-slate-100"
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

      <div>
        <p className="text-[11px] font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-semibold">
          + Ajouter une nouvelle photo
        </p>
        <ImageUpload value="" onChange={addImage} folder="artistes" />
      </div>
    </section>
  );
}
