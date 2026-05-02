-- Remove Lovable/Supabase mention from default host name (hosting provider field stays user-editable)
UPDATE public.site_settings
SET value = 'À renseigner — nom de l''hébergeur'
WHERE key = 'legal_host_name' AND value ILIKE '%lovable%';

UPDATE public.site_settings
SET value = 'À renseigner — adresse de l''hébergeur'
WHERE key = 'legal_host_address' AND value ILIKE '%singapore%';