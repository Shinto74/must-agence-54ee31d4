ALTER TABLE public.services_entreprise
  ADD COLUMN IF NOT EXISTS icon text NOT NULL DEFAULT '';

UPDATE public.services_entreprise SET icon = 'Megaphone' WHERE number = '01' AND icon = '';
UPDATE public.services_entreprise SET icon = 'Share2' WHERE number = '02' AND icon = '';
UPDATE public.services_entreprise SET icon = 'Camera' WHERE number = '03' AND icon = '';
UPDATE public.services_entreprise SET icon = 'Rocket' WHERE number = '04' AND icon = '';
UPDATE public.services_entreprise SET icon = 'Palette' WHERE number = '05' AND icon = '';
UPDATE public.services_entreprise SET icon = 'Shield' WHERE number = '06' AND icon = '';