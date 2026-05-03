import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PACKS, QUOTE_STEPS } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateRows } from "@/lib/i18n/translateRow";

// ── Team ──
export function useTeam() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["team_members", lang],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members").select("*").order("display_order");
      if (error) throw error;
      return translateRows(data || [], lang);
    },
  });
}

// ── Stats ──
export function useStats(page: string) {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["stats", page, lang],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stats").select("*").eq("page", page).order("display_order");
      if (error) throw error;
      return translateRows(data || [], lang).map((s: any) => ({ value: s.value, label: s.label, suffix: s.suffix }));
    },
  });
}

// ── Artists ──
export function useArtists() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["artists_with_categories", lang],
    queryFn: async () => {
      const { data: cats, error: e1 } = await supabase
        .from("artist_categories").select("*").order("display_order");
      if (e1) throw e1;
      const { data: arts, error: e2 } = await supabase
        .from("artists").select("*").order("display_order");
      if (e2) throw e2;
      const tCats = translateRows(cats || [], lang);
      const tArts = translateRows(arts || [], lang);
      return tCats.map((cat: any) => ({
        name: cat.name, slug: cat.slug,
        artists: tArts.filter((a: any) => a.category_id === cat.id)
          .map((a: any) => ({ name: a.name, image: a.image_url })),
      }));
    },
  });
}

// ── Clients ──
export function useClients() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["clients_with_categories", lang],
    queryFn: async () => {
      const { data: cats, error: e1 } = await supabase
        .from("client_categories").select("*").order("display_order");
      if (e1) throw e1;
      const { data: cls, error: e2 } = await supabase
        .from("clients").select("*").order("display_order");
      if (e2) throw e2;
      const tCats = translateRows(cats || [], lang);
      const tCls = translateRows(cls || [], lang);
      return tCats.map((cat: any) => ({
        name: cat.name,
        clients: tCls.filter((c: any) => c.category_id === cat.id)
          .map((c: any) => ({ name: c.name, logo: c.logo_url })),
      }));
    },
  });
}

const pad2 = (n: number) => String(n).padStart(2, "0");

// ── Packs ──
export function usePacks() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["packs_with_features", lang],
    queryFn: async () => {
      const { data: packs, error: e1 } = await supabase
        .from("packs").select("*").order("display_order");
      if (e1) throw e1;
      const { data: features, error: e2 } = await supabase
        .from("pack_features").select("*").order("display_order");
      if (e2) throw e2;
      const tPacks = translateRows(packs || [], lang);
      const tFeats = translateRows(features || [], lang);
      const rawFeats = (features || []) as any[];
      return tPacks.map((p: any, i: number) => {
        const packFeats = tFeats.filter((f: any) => f.pack_id === p.id);
        return {
          number: `Pack ${i + 1}`,
          id: p.id,
          name: p.name, subtitle: p.subtitle,
          price: p.price, priceSuffix: p.price_suffix,
          featured: p.featured, badge: p.badge,
          features: packFeats.map((f: any) => f.text),
          // FR-original texts in same order, used for stable icon/tooltip matching
          featuresFr: packFeats.map((f: any) => {
            const orig = rawFeats.find((rf) => rf.id === f.id);
            return orig?.text || f.text;
          }),
          bonus: p.bonus, reassurance: p.reassurance,
        };
      });
    },
    placeholderData: PACKS.map((p) => ({ ...p, id: "" })),
  });
}

// ── Services ──
function useServices(table: "services_artiste" | "services_entreprise", chipsTable: "service_artiste_chips" | "service_entreprise_chips") {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: [table, lang],
    queryFn: async () => {
      const { data: svcs, error: e1 } = await supabase
        .from(table).select("*").order("display_order");
      if (e1) throw e1;
      const { data: chips, error: e2 } = await supabase
        .from(chipsTable).select("*").order("display_order");
      if (e2) throw e2;
      const tSvcs = translateRows(svcs || [], lang);
      const tChips = translateRows(chips || [], lang);
      return tSvcs.map((s: any, i: number) => ({
        id: s.id,
        number: pad2(i + 1),
        title: s.title, description: s.description,
        chips: tChips.filter((c: any) => c.service_id === s.id).map((c: any) => c.text),
      }));
    },
  });
}
export const useServicesArtiste = () => useServices("services_artiste", "service_artiste_chips");
export const useServicesEntreprise = () => useServices("services_entreprise", "service_entreprise_chips");

// ── Expertise ──
function useExpertise(table: "expertise_artiste" | "expertise_entreprise") {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: [table, lang],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order("display_order");
      if (error) throw error;
      return translateRows(data || [], lang).map((e: any, i: number) => ({
        id: e.id,
        number: pad2(i + 1),
        title: e.title, text: e.text,
      }));
    },
  });
}
export const useExpertiseArtiste = () => useExpertise("expertise_artiste");
export const useExpertiseEntreprise = () => useExpertise("expertise_entreprise");

// ── Process ──
function useProcess(table: "process_artiste" | "process_entreprise") {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: [table, lang],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order("display_order");
      if (error) throw error;
      return translateRows(data || [], lang).map((p: any, i: number) => ({
        id: p.id,
        number: pad2(i + 1),
        title: p.title, text: p.text,
      }));
    },
  });
}
export const useProcessArtiste = () => useProcess("process_artiste");
export const useProcessEntreprise = () => useProcess("process_entreprise");

// ── Portfolio ──
export function usePortfolio() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["portfolio", lang],
    queryFn: async () => {
      const { data: cases, error: e1 } = await supabase
        .from("portfolio_cases").select("*").order("display_order");
      if (e1) throw e1;
      const { data: metrics, error: e2 } = await supabase
        .from("case_metrics").select("*").order("display_order");
      if (e2) throw e2;
      const tCases = translateRows(cases || [], lang);
      const tMetrics = translateRows(metrics || [], lang);
      return tCases.map((c: any) => ({
        icon: c.icon, tag: c.tag, title: c.title, description: c.description,
        metrics: tMetrics.filter((m: any) => m.case_id === c.id)
          .map((m: any) => ({ value: m.value, label: m.label })),
      }));
    },
  });
}

// ── Quote Steps ──
export function useQuoteSteps() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["quote_steps", lang],
    queryFn: async () => {
      const { data: steps, error: e1 } = await supabase
        .from("form_steps").select("*").order("display_order");
      if (e1) throw e1;
      const { data: opts, error: e2 } = await supabase
        .from("form_options").select("*").order("display_order");
      if (e2) throw e2;
      const tSteps = translateRows(steps || [], lang);
      const tOpts = translateRows(opts || [], lang);
      return tSteps.map((s: any) => ({
        title: s.title, question: s.question,
        type: s.type as "radio" | "textarea" | "date" | "checkbox",
        placeholder: s.placeholder || undefined,
        options: tOpts.filter((o: any) => o.step_id === s.id)
          .map((o: any) => ({ label: o.label, icon: o.icon })),
      }));
    },
    placeholderData: QUOTE_STEPS.map((s) => ({
      ...s,
      placeholder: s.placeholder || "",
      options: s.options || [],
    })),
  });
}
