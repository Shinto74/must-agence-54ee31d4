CREATE TABLE public.contact_form_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  label TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.contact_form_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read contact_form_types" ON public.contact_form_types FOR SELECT USING (true);
CREATE POLICY "Admin insert contact_form_types" ON public.contact_form_types FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admin update contact_form_types" ON public.contact_form_types FOR UPDATE TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admin delete contact_form_types" ON public.contact_form_types FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'::app_role));

INSERT INTO public.contact_form_types (page, label, display_order) VALUES
  ('artiste', 'Single', 1),
  ('artiste', 'Album', 2),
  ('artiste', 'Clip', 3),
  ('artiste', 'Campagne TikTok', 4),
  ('artiste', 'Autre', 5),
  ('entreprise', 'Influence Marketing', 1),
  ('entreprise', 'Social Media', 2),
  ('entreprise', 'Contenu Premium', 3),
  ('entreprise', 'Growth Hacking', 4),
  ('entreprise', 'Autre', 5);