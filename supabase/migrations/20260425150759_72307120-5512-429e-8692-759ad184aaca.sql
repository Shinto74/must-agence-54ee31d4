CREATE TABLE public.artist_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id uuid NOT NULL,
  url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.artist_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read artist_images"
  ON public.artist_images FOR SELECT USING (true);

CREATE POLICY "Admin insert artist_images"
  ON public.artist_images FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin update artist_images"
  ON public.artist_images FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin delete artist_images"
  ON public.artist_images FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_artist_images_artist_id ON public.artist_images(artist_id);

-- Seed : copie l'image_url actuelle de chaque artiste comme première entrée de sa galerie
INSERT INTO public.artist_images (artist_id, url, display_order)
SELECT id, image_url, 0
FROM public.artists
WHERE image_url IS NOT NULL AND image_url <> '';