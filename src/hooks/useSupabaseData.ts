import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  TEAM, STATS, ARTIST_REFERENCES, COMPANY_REFERENCES, PACKS,
  SERVICES_ARTISTE, SERVICES_ENTREPRISE, EXPERTISE_ARTISTE,
  EXPERTISE_ENTREPRISE, PROCESS_ARTISTE, PROCESS_ENTREPRISE,
  PORTFOLIO, QUOTE_STEPS,
} from "@/lib/constants";

// ── Team ──
export function useTeam() {
  return useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
    placeholderData: TEAM.map((t, i) => ({
      id: `fallback-${i}`, name: t.name, initials: t.initials,
      role: t.role, description: t.description, image_url: null,
      display_order: i, created_at: "", updated_at: "",
    })),
  });
}

// ── Stats ──
export function useStats(page: string) {
  const fallback = STATS[page as keyof typeof STATS] || STATS.home;
  return useQuery({
    queryKey: ["stats", page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stats").select("*").eq("page", page).order("display_order");
      if (error) throw error;
      return data.map((s) => ({ value: s.value, label: s.label, suffix: s.suffix }));
    },
    placeholderData: fallback,
  });
}

// ── Artists ──
export function useArtists() {
  return useQuery({
    queryKey: ["artists_with_categories"],
    queryFn: async () => {
      const { data: cats, error: e1 } = await supabase
        .from("artist_categories").select("*").order("display_order");
      if (e1) throw e1;
      const { data: arts, error: e2 } = await supabase
        .from("artists").select("*").order("display_order");
      if (e2) throw e2;
      return (cats || []).map((cat) => ({
        name: cat.name, slug: cat.slug,
        artists: (arts || []).filter((a) => a.category_id === cat.id)
          .map((a) => ({ name: a.name, image: a.image_url })),
      }));
    },
    placeholderData: ARTIST_REFERENCES.categories.map((c) => ({
      name: c.name, slug: c.slug,
      artists: c.artists.map((a) => ({ name: a.name, image: a.image })),
    })),
  });
}

// ── Clients ──
export function useClients() {
  return useQuery({
    queryKey: ["clients_with_categories"],
    queryFn: async () => {
      const { data: cats, error: e1 } = await supabase
        .from("client_categories").select("*").order("display_order");
      if (e1) throw e1;
      const { data: cls, error: e2 } = await supabase
        .from("clients").select("*").order("display_order");
      if (e2) throw e2;
      return (cats || []).map((cat) => ({
        name: cat.name,
        clients: (cls || []).filter((c) => c.category_id === cat.id)
          .map((c) => ({ name: c.name, logo: c.logo_url })),
      }));
    },
    placeholderData: COMPANY_REFERENCES.categories.map((c) => ({
      name: c.name, clients: c.clients,
    })),
  });
}

// ── Packs ──
export function usePacks() {
  return useQuery({
    queryKey: ["packs_with_features"],
    queryFn: async () => {
      const { data: packs, error: e1 } = await supabase
        .from("packs").select("*").order("display_order");
      if (e1) throw e1;
      const { data: features, error: e2 } = await supabase
        .from("pack_features").select("*").order("display_order");
      if (e2) throw e2;
      return (packs || []).map((p) => ({
        number: p.number, name: p.name, subtitle: p.subtitle,
        price: p.price, priceSuffix: p.price_suffix,
        featured: p.featured, badge: p.badge,
        features: (features || []).filter((f) => f.pack_id === p.id).map((f) => f.text),
        bonus: p.bonus, reassurance: p.reassurance,
      }));
    },
    placeholderData: PACKS,
  });
}

// ── Services ──
function useServices(table: "services_artiste" | "services_entreprise", chipsTable: "service_artiste_chips" | "service_entreprise_chips", fallback: typeof SERVICES_ARTISTE) {
  return useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data: svcs, error: e1 } = await supabase
        .from(table).select("*").order("display_order");
      if (e1) throw e1;
      const { data: chips, error: e2 } = await supabase
        .from(chipsTable).select("*").order("display_order");
      if (e2) throw e2;
      return (svcs || []).map((s) => ({
        number: s.number, title: s.title, description: s.description,
        chips: (chips || []).filter((c) => c.service_id === s.id).map((c) => c.text),
      }));
    },
    placeholderData: fallback,
  });
}
export const useServicesArtiste = () => useServices("services_artiste", "service_artiste_chips", SERVICES_ARTISTE);
export const useServicesEntreprise = () => useServices("services_entreprise", "service_entreprise_chips", SERVICES_ENTREPRISE);

// ── Expertise ──
function useExpertise(table: "expertise_artiste" | "expertise_entreprise", fallback: typeof EXPERTISE_ARTISTE) {
  return useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order("display_order");
      if (error) throw error;
      return (data || []).map((e) => ({ number: e.number, title: e.title, text: e.text }));
    },
    placeholderData: fallback,
  });
}
export const useExpertiseArtiste = () => useExpertise("expertise_artiste", EXPERTISE_ARTISTE);
export const useExpertiseEntreprise = () => useExpertise("expertise_entreprise", EXPERTISE_ENTREPRISE);

// ── Process ──
function useProcess(table: "process_artiste" | "process_entreprise", fallback: typeof PROCESS_ARTISTE) {
  return useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order("display_order");
      if (error) throw error;
      return (data || []).map((p) => ({ number: p.number, title: p.title, text: p.text }));
    },
    placeholderData: fallback,
  });
}
export const useProcessArtiste = () => useProcess("process_artiste", PROCESS_ARTISTE);
export const useProcessEntreprise = () => useProcess("process_entreprise", PROCESS_ENTREPRISE);

// ── Portfolio ──
export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const { data: cases, error: e1 } = await supabase
        .from("portfolio_cases").select("*").order("display_order");
      if (e1) throw e1;
      const { data: metrics, error: e2 } = await supabase
        .from("case_metrics").select("*").order("display_order");
      if (e2) throw e2;
      return (cases || []).map((c) => ({
        icon: c.icon, tag: c.tag, title: c.title, description: c.description,
        metrics: (metrics || []).filter((m) => m.case_id === c.id)
          .map((m) => ({ value: m.value, label: m.label })),
      }));
    },
    placeholderData: PORTFOLIO,
  });
}

// ── Quote Steps ──
export function useQuoteSteps() {
  return useQuery({
    queryKey: ["quote_steps"],
    queryFn: async () => {
      const { data: steps, error: e1 } = await supabase
        .from("form_steps").select("*").order("display_order");
      if (e1) throw e1;
      const { data: opts, error: e2 } = await supabase
        .from("form_options").select("*").order("display_order");
      if (e2) throw e2;
      return (steps || []).map((s) => ({
        title: s.title, question: s.question,
        type: s.type as "radio" | "textarea" | "date" | "checkbox",
        placeholder: s.placeholder || undefined,
        options: (opts || []).filter((o) => o.step_id === s.id)
          .map((o) => ({ label: o.label, icon: o.icon })),
      }));
    },
    placeholderData: QUOTE_STEPS.map((s) => ({
      ...s,
      placeholder: s.placeholder || "",
      options: s.options || [],
    })),
  });
}
