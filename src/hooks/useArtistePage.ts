import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateRows } from "@/lib/i18n/translateRow";

/* ─── Piliers Page Artiste (avec items left/right) ─── */
export function useArtistPillars() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["artist_pillars_full", lang],
    queryFn: async () => {
      const [pillarsRes, leftRes, rightRes] = await Promise.all([
        supabase.from("artist_pillars").select("*").order("display_order"),
        supabase.from("pillar_left_items").select("*").order("display_order"),
        supabase.from("pillar_right_items").select("*").order("display_order"),
      ]);
      if (pillarsRes.error) throw pillarsRes.error;
      const pillars = translateRows(pillarsRes.data || [], lang);
      const left = translateRows(leftRes.data || [], lang);
      const right = translateRows(rightRes.data || [], lang);
      return pillars.map((p: any) => ({
        ...p,
        leftItems: left.filter((i: any) => i.pillar_id === p.id).map((i: any) => i.text),
        rightItems: right.filter((i: any) => i.pillar_id === p.id).map((i: any) => i.text),
      }));
    },
  });
}

/* ─── Tooltips packs ─── */
export function usePackTooltips() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["pack_tooltips", lang],
    queryFn: async () => {
      const { data, error } = await supabase.from("pack_tooltips").select("*");
      if (error) throw error;
      return translateRows(data || [], lang);
    },
  });
}

/* ─── Détails artistes ─── */
export function useArtistDetails() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["artist_details", lang],
    queryFn: async () => {
      const { data, error } = await supabase.from("artist_details").select("*");
      if (error) throw error;
      return translateRows(data || [], lang);
    },
  });
}
