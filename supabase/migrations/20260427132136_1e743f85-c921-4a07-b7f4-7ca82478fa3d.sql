
-- Seed missing media settings so the admin reflects what the site actually shows.

-- 1. Hero vidéo Entreprise (currently uses sydney-hero.mp4 fallback)
INSERT INTO public.site_settings (key, value, type)
VALUES (
  'hero_entreprise_video_url',
  '/__l5e/assets-v1/f0a464c6-4f9d-4a3e-b7e4-ecb6ba1ccc05/sydney-hero.mp4',
  'video'
)
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value, type = EXCLUDED.type
  WHERE public.site_settings.value = '' OR public.site_settings.value IS NULL;

-- 2. Clip Portugal poster (currently uses Unsplash fallback)
INSERT INTO public.site_settings (key, value, type)
VALUES (
  'clip_portugal_poster',
  'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80',
  'image'
)
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value, type = EXCLUDED.type
  WHERE public.site_settings.value = '' OR public.site_settings.value IS NULL;

-- 3. Gateway visuels (currently use Unsplash fallback)
INSERT INTO public.site_settings (key, value, type)
VALUES
  ('gateway_image_artiste',    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=80', 'image'),
  ('gateway_image_entreprise', 'https://images.unsplash.com/photo-1637137467932-844c5736adc3?w=1400&q=80', 'image')
ON CONFLICT (key) DO NOTHING;

-- 4. Mirror these into media_galleries so they appear as the active item in each gallery editor.
INSERT INTO public.media_galleries (owner_table, owner_id, url, display_order)
SELECT 'site_settings', s.key, s.value, 0
FROM public.site_settings s
WHERE s.key IN (
  'hero_entreprise_video_url',
  'clip_portugal_poster',
  'gateway_image_artiste',
  'gateway_image_entreprise'
)
  AND s.value IS NOT NULL
  AND s.value <> ''
  AND NOT EXISTS (
    SELECT 1 FROM public.media_galleries g
    WHERE g.owner_table = 'site_settings'
      AND g.owner_id = s.key
      AND g.url = s.value
  );

-- 5. Also mirror the existing hero_video_url and logos if not yet in galleries (defensive).
INSERT INTO public.media_galleries (owner_table, owner_id, url, display_order)
SELECT 'site_settings', s.key, s.value, 0
FROM public.site_settings s
WHERE s.key IN ('hero_video_url', 'logo_white', 'logo_green')
  AND s.value IS NOT NULL
  AND s.value <> ''
  AND NOT EXISTS (
    SELECT 1 FROM public.media_galleries g
    WHERE g.owner_table = 'site_settings'
      AND g.owner_id = s.key
      AND g.url = s.value
  );
