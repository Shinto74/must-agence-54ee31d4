
-- ═══════════════════════════════════════════════════════════════
-- Page Artiste : nouvelles tables pour 100% BDD-driven
-- ═══════════════════════════════════════════════════════════════

-- 1. Piliers de la page Artiste (les 5 services V4B)
CREATE TABLE public.artist_pillars (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  display_order integer NOT NULL DEFAULT 0,
  icon text NOT NULL DEFAULT 'Zap',
  left_title text NOT NULL DEFAULT '',
  statement text NOT NULL DEFAULT '',
  right_title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  accent_hue integer NOT NULL DEFAULT 73
);

CREATE TABLE public.pillar_left_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pillar_id uuid NOT NULL REFERENCES public.artist_pillars(id) ON DELETE CASCADE,
  text text NOT NULL,
  display_order integer NOT NULL DEFAULT 0
);

CREATE TABLE public.pillar_right_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pillar_id uuid NOT NULL REFERENCES public.artist_pillars(id) ON DELETE CASCADE,
  text text NOT NULL,
  display_order integer NOT NULL DEFAULT 0
);

-- 2. Tooltips des packs (info détaillée par feature)
CREATE TABLE public.pack_tooltips (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pack_id uuid NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
  feature_prefix text NOT NULL,
  tooltip_text text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0
);

-- 3. Détails artistes (modale au clic sur la carte du carrousel)
CREATE TABLE public.artist_details (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id uuid NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE UNIQUE,
  strategie text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  plateformes text[] NOT NULL DEFAULT '{}',
  chiffre text NOT NULL DEFAULT ''
);

-- ═══════════════════════════════════════════════════════════════
-- RLS: lecture publique, écriture admin
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE public.artist_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pillar_left_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pillar_right_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pack_tooltips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_details ENABLE ROW LEVEL SECURITY;

-- Helper macro-style: 4 policies par table
CREATE POLICY "Public read artist_pillars" ON public.artist_pillars FOR SELECT USING (true);
CREATE POLICY "Admin insert artist_pillars" ON public.artist_pillars FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update artist_pillars" ON public.artist_pillars FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete artist_pillars" ON public.artist_pillars FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read pillar_left_items" ON public.pillar_left_items FOR SELECT USING (true);
CREATE POLICY "Admin insert pillar_left_items" ON public.pillar_left_items FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update pillar_left_items" ON public.pillar_left_items FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete pillar_left_items" ON public.pillar_left_items FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read pillar_right_items" ON public.pillar_right_items FOR SELECT USING (true);
CREATE POLICY "Admin insert pillar_right_items" ON public.pillar_right_items FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update pillar_right_items" ON public.pillar_right_items FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete pillar_right_items" ON public.pillar_right_items FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read pack_tooltips" ON public.pack_tooltips FOR SELECT USING (true);
CREATE POLICY "Admin insert pack_tooltips" ON public.pack_tooltips FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update pack_tooltips" ON public.pack_tooltips FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete pack_tooltips" ON public.pack_tooltips FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read artist_details" ON public.artist_details FOR SELECT USING (true);
CREATE POLICY "Admin insert artist_details" ON public.artist_details FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update artist_details" ON public.artist_details FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete artist_details" ON public.artist_details FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
