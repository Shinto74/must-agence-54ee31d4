import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/* ─── Piliers Page Artiste (avec items left/right) ─── */
export function useArtistPillars() {
  return useQuery({
    queryKey: ["artist_pillars_full"],
    queryFn: async () => {
      const [pillarsRes, leftRes, rightRes] = await Promise.all([
        supabase.from("artist_pillars").select("*").order("display_order"),
        supabase.from("pillar_left_items").select("*").order("display_order"),
        supabase.from("pillar_right_items").select("*").order("display_order"),
      ]);
      if (pillarsRes.error) throw pillarsRes.error;
      const pillars = pillarsRes.data || [];
      const left = leftRes.data || [];
      const right = rightRes.data || [];
      return pillars.map((p: any) => ({
        ...p,
        leftItems: left.filter((i: any) => i.pillar_id === p.id).map((i: any) => i.text),
        rightItems: right.filter((i: any) => i.pillar_id === p.id).map((i: any) => i.text),
      }));
    },
  });
}

/* ─── Tooltips packs (lookup par pack_id + prefix) ─── */
export function usePackTooltips() {
  return useQuery({
    queryKey: ["pack_tooltips"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pack_tooltips").select("*");
      if (error) throw error;
      return data || [];
    },
  });
}

/* ─── Détails artistes (lookup par artist_id) ─── */
export function useArtistDetails() {
  return useQuery({
    queryKey: ["artist_details"],
    queryFn: async () => {
      const { data, error } = await supabase.from("artist_details").select("*");
      if (error) throw error;
      return data || [];
    },
  });
}
