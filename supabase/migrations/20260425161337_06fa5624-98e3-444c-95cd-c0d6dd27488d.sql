-- 1) Table générique de galerie multi-images
CREATE TABLE IF NOT EXISTS public.media_galleries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_table text NOT NULL,
  owner_id text NOT NULL,
  url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_galleries_owner
  ON public.media_galleries (owner_table, owner_id, display_order);

ALTER TABLE public.media_galleries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read media_galleries"
  ON public.media_galleries FOR SELECT TO public USING (true);

CREATE POLICY "Admin insert media_galleries"
  ON public.media_galleries FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin update media_galleries"
  ON public.media_galleries FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin delete media_galleries"
  ON public.media_galleries FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 2) Seed depuis les tables existantes (idempotent)
-- Artistes
INSERT INTO public.media_galleries (owner_table, owner_id, url, display_order)
SELECT 'artists', a.id::text, a.image_url, 0
FROM public.artists a
WHERE a.image_url IS NOT NULL AND a.image_url <> ''
  AND NOT EXISTS (
    SELECT 1 FROM public.media_galleries g
    WHERE g.owner_table = 'artists' AND g.owner_id = a.id::text AND g.url = a.image_url
  );

-- Clients (logos)
INSERT INTO public.media_galleries (owner_table, owner_id, url, display_order)
SELECT 'clients', c.id::text, c.logo_url, 0
FROM public.clients c
WHERE c.logo_url IS NOT NULL AND c.logo_url <> ''
  AND NOT EXISTS (
    SELECT 1 FROM public.media_galleries g
    WHERE g.owner_table = 'clients' AND g.owner_id = c.id::text AND g.url = c.logo_url
  );

-- Équipe
INSERT INTO public.media_galleries (owner_table, owner_id, url, display_order)
SELECT 'team_members', t.id::text, t.image_url, 0
FROM public.team_members t
WHERE t.image_url IS NOT NULL AND t.image_url <> ''
  AND NOT EXISTS (
    SELECT 1 FROM public.media_galleries g
    WHERE g.owner_table = 'team_members' AND g.owner_id = t.id::text AND g.url = t.image_url
  );

-- Secteurs entreprise
INSERT INTO public.media_galleries (owner_table, owner_id, url, display_order)
SELECT 'entreprise_sectors', s.id::text, s.image_url, 0
FROM public.entreprise_sectors s
WHERE s.image_url IS NOT NULL AND s.image_url <> ''
  AND NOT EXISTS (
    SELECT 1 FROM public.media_galleries g
    WHERE g.owner_table = 'entreprise_sectors' AND g.owner_id = s.id::text AND g.url = s.image_url
  );

-- site_settings : logos & images Gateway
INSERT INTO public.media_galleries (owner_table, owner_id, url, display_order)
SELECT 'site_settings', s.key, s.value, 0
FROM public.site_settings s
WHERE s.key IN ('logo_green','logo_white','gateway_image_artiste','gateway_image_entreprise')
  AND s.value IS NOT NULL AND s.value <> ''
  AND NOT EXISTS (
    SELECT 1 FROM public.media_galleries g
    WHERE g.owner_table = 'site_settings' AND g.owner_id = s.key AND g.url = s.value
  );
