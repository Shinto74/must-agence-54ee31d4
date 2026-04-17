import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Compte les éléments "à traiter" pour afficher les badges dans la sidebar admin.
 * - demandes : contact_submissions + quote_requests avec status = 'nouveau'
 * - paiements : payments avec status = 'pending'
 */
export function useAdminNotifications() {
  const { data = { demandes: 0, paiements: 0 } } = useQuery({
    queryKey: ["admin_notifications_counts"],
    queryFn: async () => {
      const [contacts, quotes, pendingPayments] = await Promise.all([
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "nouveau"),
        supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "nouveau"),
        supabase.from("payments").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      return {
        demandes: (contacts.count || 0) + (quotes.count || 0),
        paiements: pendingPayments.count || 0,
      };
    },
    refetchInterval: 30_000,
  });

  return data;
}
