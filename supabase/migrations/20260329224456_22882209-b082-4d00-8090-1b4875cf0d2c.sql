
-- Drop ALL policies and recreate with explicit per-operation policies for admin tables
-- This ensures DELETE, UPDATE, INSERT work correctly for admin users

DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'artists', 'artist_categories', 'clients', 'client_categories',
    'team_members', 'packs', 'pack_features', 'stats',
    'services_artiste', 'services_entreprise',
    'service_artiste_chips', 'service_entreprise_chips',
    'expertise_artiste', 'expertise_entreprise',
    'process_artiste', 'process_entreprise',
    'portfolio_cases', 'case_metrics',
    'form_steps', 'form_options', 'site_settings'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    -- Drop existing admin write policy
    EXECUTE format('DROP POLICY IF EXISTS "Admin write %s" ON public.%I', tbl, tbl);
    
    -- Create explicit SELECT policy for admin (in addition to public read)
    EXECUTE format('DROP POLICY IF EXISTS "Admin select %s" ON public.%I', tbl, tbl);
    
    -- Create explicit INSERT policy for admin
    EXECUTE format('DROP POLICY IF EXISTS "Admin insert %s" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "Admin insert %s" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), ''admin''::app_role))', tbl, tbl);
    
    -- Create explicit UPDATE policy for admin
    EXECUTE format('DROP POLICY IF EXISTS "Admin update %s" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "Admin update %s" ON public.%I FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''admin''::app_role)) WITH CHECK (public.has_role(auth.uid(), ''admin''::app_role))', tbl, tbl);
    
    -- Create explicit DELETE policy for admin
    EXECUTE format('DROP POLICY IF EXISTS "Admin delete %s" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "Admin delete %s" ON public.%I FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''admin''::app_role))', tbl, tbl);
  END LOOP;
END $$;
