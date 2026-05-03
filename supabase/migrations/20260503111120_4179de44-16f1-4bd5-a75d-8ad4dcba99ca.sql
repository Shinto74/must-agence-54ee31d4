DO $$
DECLARE t text;
DECLARE tables text[] := ARRAY[
  'artist_categories','artist_details','artist_pillars','artists',
  'case_metrics','client_categories','clients','clip_portugal_advantages',
  'contact_form_types','contact_sectors','entreprise_sectors',
  'expertise_artiste','expertise_entreprise','form_options','form_steps',
  'marquee_items','pack_features','pack_tooltips','packs',
  'pillar_left_items','pillar_right_items','portfolio_cases',
  'process_artiste','process_entreprise','service_artiste_chips',
  'service_entreprise_chips','services_artiste','services_entreprise',
  'site_settings','stats','team_members','theartist_features'
];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT ''{}''::jsonb', t);
  END LOOP;
END $$;