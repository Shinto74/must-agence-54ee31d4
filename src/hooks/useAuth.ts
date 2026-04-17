import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    const checkAdmin = async (u: User) => {
      try {
        const { data } = await supabase
          .from("user_roles").select("role").eq("user_id", u.id).eq("role", "admin").maybeSingle();
        setIsAdmin(!!data);
      } catch {
        setIsAdmin(false);
      }
    };

    // Safety: never stay loading more than 5s
    const safety = setTimeout(() => {
      if (!initialized.current) {
        initialized.current = true;
        setLoading(false);
      }
    }, 5000);

    // 1. Restore session first
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) await checkAdmin(u);
      })
      .catch((err) => {
        console.error("[useAuth] getSession error:", err);
      })
      .finally(() => {
        initialized.current = true;
        setLoading(false);
        clearTimeout(safety);
      });

    // 2. Listen for subsequent changes — never await inside the callback (deadlock risk)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        setTimeout(() => { checkAdmin(u); }, 0);
      } else {
        setIsAdmin(false);
      }
      if (initialized.current) setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(safety);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, isAdmin, signIn, signOut };
}
