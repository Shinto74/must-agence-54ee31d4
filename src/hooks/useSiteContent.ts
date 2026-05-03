import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateRows } from "@/lib/i18n/translateRow";

/* ─── Site settings (key/value, with translations.en.value) ─── */
export function useSiteSettings() {
  const { lang } = useLanguage();
  const { data = [] } = useQuery({
    queryKey: ["site_settings", lang],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data;
    },
  });

  const get = (key: string, fallback = ""): string => {
    const found = data.find((s: any) => s.key === key);
    if (!found) return fallback;
    if (lang === "en") {
      const enVal = (found as any).translations?.en?.value;
      if (typeof enVal === "string" && enVal.trim()) return enVal;
    }
    return (found?.value as string) || fallback;
  };

  const getBool = (key: string, fallback = true): boolean => {
    const found = data.find((s: any) => s.key === key);
    if (!found) return fallback;
    return String(found.value).toLowerCase() !== "false";
  };

  return { settings: data, get, getBool };
}

/* ─── Marquee items per page ─── */
export function useMarqueeItems(page: "home" | "artiste" | "entreprise") {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["marquee_items", page, lang],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marquee_items")
        .select("*")
        .eq("page", page)
        .order("display_order");
      if (error) throw error;
      return translateRows(data || [], lang);
    },
  });
}

/* ─── Entreprise sectors (orbit 3D) ─── */
export function useEntrepriseSectors() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["entreprise_sectors", lang],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entreprise_sectors")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return translateRows(data || [], lang);
    },
  });
}

/* ─── TheArtist features ─── */
export function useTheArtistFeatures() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["theartist_features", lang],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("theartist_features")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return translateRows(data || [], lang);
    },
  });
}

/* ─── Clip Portugal advantages ─── */
export function useClipPortugalAdvantages() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["clip_portugal_advantages", lang],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clip_portugal_advantages")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return translateRows(data || [], lang);
    },
  });
}

/* ─── Services Entreprise (with chips) ─── */
export function useServicesEntreprise() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["services_entreprise_with_chips", lang],
    queryFn: async () => {
      const [svcRes, chipsRes] = await Promise.all([
        supabase.from("services_entreprise").select("*").order("display_order"),
        supabase.from("service_entreprise_chips").select("*").order("display_order"),
      ]);
      if (svcRes.error) throw svcRes.error;
      if (chipsRes.error) throw chipsRes.error;
      const services = translateRows(svcRes.data || [], lang);
      const chips = translateRows(chipsRes.data || [], lang);
      return services.map((s: any) => ({
        ...s,
        chips: chips.filter((c: any) => c.service_id === s.id).map((c: any) => c.text),
      }));
    },
  });
}

/* ─── Contact sectors ─── */
export function useContactSectors() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["contact_sectors", lang],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_sectors")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return translateRows(data || [], lang);
    },
  });
}

/* ─── Contact form types ─── */
export function useContactFormTypes(page: "artiste" | "entreprise") {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["contact_form_types", page, lang],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_form_types")
        .select("*")
        .eq("page", page)
        .order("display_order");
      if (error) throw error;
      return translateRows(data || [], lang);
    },
  });
}

/* ─── Clients (with categories) ─── */
export function useClientsWithCategories() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["clients_with_categories", lang],
    queryFn: async () => {
      const [catsRes, clientsRes] = await Promise.all([
        supabase.from("client_categories").select("*").order("display_order"),
        supabase.from("clients").select("*").order("display_order"),
      ]);
      if (catsRes.error) throw catsRes.error;
      if (clientsRes.error) throw clientsRes.error;
      const cats = translateRows(catsRes.data || [], lang);
      const clients = translateRows(clientsRes.data || [], lang);
      return cats.map((c: any) => ({
        id: c.id,
        name: c.name,
        clients: clients.filter((cl: any) => cl.category_id === c.id),
      }));
    },
  });
}
