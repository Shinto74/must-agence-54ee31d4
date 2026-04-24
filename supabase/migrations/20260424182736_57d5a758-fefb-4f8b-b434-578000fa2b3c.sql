ALTER TABLE public.entreprise_sectors
ADD COLUMN IF NOT EXISTS image_url text NOT NULL DEFAULT '';

COMMENT ON COLUMN public.entreprise_sectors.image_url IS 'URL publique de l’image affichée pour le secteur entreprise';