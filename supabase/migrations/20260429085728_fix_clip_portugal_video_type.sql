-- Corrige le type de site_settings pour clip_portugal_video_url
-- (était 'image', doit être 'video' pour que l'admin affiche le bon uploader)
UPDATE public.site_settings
SET type = 'video'
WHERE key = 'clip_portugal_video_url';
