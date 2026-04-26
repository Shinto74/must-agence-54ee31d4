-- 1. Table contact_sectors (options du select du formulaire de contact)
CREATE TABLE public.contact_sectors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  display_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.contact_sectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read contact_sectors"
  ON public.contact_sectors FOR SELECT
  USING (true);

CREATE POLICY "Admin insert contact_sectors"
  ON public.contact_sectors FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin update contact_sectors"
  ON public.contact_sectors FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin delete contact_sectors"
  ON public.contact_sectors FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed valeurs initiales
INSERT INTO public.contact_sectors (name, display_order) VALUES
  ('Gastronomie', 1),
  ('Hôtellerie', 2),
  ('Beauté & Bien-être', 3),
  ('Sport & Fitness', 4),
  ('Automobile', 5),
  ('Grande Distribution', 6),
  ('Mode & Luxe', 7),
  ('Immobilier', 8),
  ('Santé', 9),
  ('Tech & Startup', 10),
  ('Autre', 99);

-- 2. Ajout du paramètre site clip_portugal_description
INSERT INTO public.site_settings (key, value, type)
VALUES ('clip_portugal_description', 'Des décors de rêve entre Lisbonne, l''Algarve et Porto. Une production clé en main : réalisation, logistique, hébergement. Concentrez-vous sur votre art, on gère le reste.', 'textarea')
ON CONFLICT (key) DO NOTHING;