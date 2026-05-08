import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Compte les demandes ouvertes (contact + devis) pour le badge sidebar admin.
 */
export function useAdminNotifications() {
  const { data = { demandes: 0 } } = useQuery({
    queryKey: ["admin_notifications_counts"],
    queryFn: async () => {
      const [contacts, quotes] = await Promise.all([
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "nouveau").is("archived_at", null),
        supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "nouveau").is("archived_at", null),
      ]);
      return {
        demandes: (contacts.count || 0) + (quotes.count || 0),
      };
    },
    refetchInterval: 10_000,
    refetchOnWindowFocus: true,
  });

  return data;
}
