import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/* ─── Site settings (key/value) ─── */
export function useSiteSettings() {
  const { data = [] } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data;
    },
  });

  const get = (key: string, fallback = ""): string => {
    const found = data.find((s: any) => s.key === key);
    return (found?.value as string) || fallback;
  };

  return { settings: data, get };
}

/* ─── Marquee items per page ─── */
export function useMarqueeItems(page: "home" | "artiste" | "entreprise") {
  return useQuery({
    queryKey: ["marquee_items", page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marquee_items")
        .select("*")
        .eq("page", page)
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
  });
}

/* ─── Entreprise sectors (orbit 3D) ─── */
export function useEntrepriseSectors() {
  return useQuery({
    queryKey: ["entreprise_sectors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entreprise_sectors")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
  });
}

/* ─── TheArtist features ─── */
export function useTheArtistFeatures() {
  return useQuery({
    queryKey: ["theartist_features"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("theartist_features")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
  });
}

/* ─── Clip Portugal advantages ─── */
export function useClipPortugalAdvantages() {
  return useQuery({
    queryKey: ["clip_portugal_advantages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clip_portugal_advantages")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
  });
}

/* ─── Clients (with categories) for entreprise references ─── */
export function useClientsWithCategories() {
  return useQuery({
    queryKey: ["clients_with_categories"],
    queryFn: async () => {
      const [catsRes, clientsRes] = await Promise.all([
        supabase.from("client_categories").select("*").order("display_order"),
        supabase.from("clients").select("*").order("display_order"),
      ]);
      if (catsRes.error) throw catsRes.error;
      if (clientsRes.error) throw clientsRes.error;
      const cats = catsRes.data || [];
      const clients = clientsRes.data || [];
      return cats.map((c: any) => ({
        id: c.id,
        name: c.name,
        clients: clients.filter((cl: any) => cl.category_id === c.id),
      }));
    },
  });
}
