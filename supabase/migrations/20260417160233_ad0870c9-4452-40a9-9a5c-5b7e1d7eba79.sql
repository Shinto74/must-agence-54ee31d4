-- ─────────────────────────────────────────────────────────
-- 1. MARQUEE ITEMS (mots ou logos défilants par page)
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.marquee_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,                  -- 'home' | 'artiste' | 'entreprise'
  kind text NOT NULL DEFAULT 'word',   -- 'word' | 'logo'
  text_value text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.marquee_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read marquee_items" ON public.marquee_items
  FOR SELECT USING (true);
CREATE POLICY "Admin insert marquee_items" ON public.marquee_items
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin update marquee_items" ON public.marquee_items
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin delete marquee_items" ON public.marquee_items
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));


-- ─────────────────────────────────────────────────────────
-- 2. ENTREPRISE SECTORS (orbite 3D)
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.entreprise_sectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.entreprise_sectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read entreprise_sectors" ON public.entreprise_sectors
  FOR SELECT USING (true);
CREATE POLICY "Admin insert entreprise_sectors" ON public.entreprise_sectors
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin update entreprise_sectors" ON public.entreprise_sectors
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin delete entreprise_sectors" ON public.entreprise_sectors
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));


-- ─────────────────────────────────────────────────────────
-- 3. THEARTIST FEATURES (pills page Artiste)
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.theartist_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.theartist_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read theartist_features" ON public.theartist_features
  FOR SELECT USING (true);
CREATE POLICY "Admin insert theartist_features" ON public.theartist_features
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin update theartist_features" ON public.theartist_features
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin delete theartist_features" ON public.theartist_features
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));


-- ─────────────────────────────────────────────────────────
-- 4. CLIP PORTUGAL ADVANTAGES
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.clip_portugal_advantages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.clip_portugal_advantages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read clip_portugal_advantages" ON public.clip_portugal_advantages
  FOR SELECT USING (true);
CREATE POLICY "Admin insert clip_portugal_advantages" ON public.clip_portugal_advantages
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin update clip_portugal_advantages" ON public.clip_portugal_advantages
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin delete clip_portugal_advantages" ON public.clip_portugal_advantages
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));


-- ─────────────────────────────────────────────────────────
-- 5. SEED site_settings (clés de contenu Hero / sections)
-- ─────────────────────────────────────────────────────────
INSERT INTO public.site_settings (key, value, type) VALUES
  -- Hero ARTISTE
  ('hero_artiste_badge', 'Pôle Artiste', 'text'),
  ('hero_artiste_title', 'On ne suit pas les tendances on les crée', 'text'),
  ('hero_artiste_subtitle', 'Production, image, stratégie : on construit ta carrière artistique de A à Z.', 'textarea'),
  ('hero_artiste_video_url', '', 'text'),
  ('hero_artiste_cta_label', 'Découvrir nos packs', 'text'),

  -- Hero ENTREPRISE
  ('hero_entreprise_badge', 'Pôle Entreprise', 'text'),
  ('hero_entreprise_title', 'Donnez une voix à votre marque', 'text'),
  ('hero_entreprise_subtitle', 'Stratégie de contenu, production audiovisuelle et image de marque pour entreprises ambitieuses.', 'textarea'),
  ('hero_entreprise_video_url', '', 'text'),
  ('hero_entreprise_cta_label', 'Discutons de votre projet', 'text'),

  -- Hero HOME / GATEWAY
  ('hero_home_badge', 'MUST AGENCE', 'text'),
  ('hero_home_title', 'On ne suit pas les tendances on les crée', 'text'),
  ('hero_home_subtitle', 'Agence créative dédiée aux artistes et aux marques.', 'textarea'),

  -- TheArtist showcase
  ('theartist_kicker', 'Partenaire officiel', 'text'),
  ('theartist_title_part1', 'Le réseau pro-social', 'text'),
  ('theartist_title_part2', 'dédié au monde artistique.', 'text'),
  ('theartist_cta_label', 'Découvrir TheArtist', 'text'),
  ('theartist_cta_url', 'https://www.theartist.life/', 'text'),
  ('theartist_footer_text', 'Offert avec nos packs — jusqu''à 8 mois d''accès', 'text'),

  -- Clip Portugal
  ('clip_portugal_kicker', 'Tournage Portugal', 'text'),
  ('clip_portugal_title', 'Tournez votre clip au Portugal', 'text'),
  ('clip_portugal_subtitle', 'Décors uniques, lumière exceptionnelle, coûts maîtrisés.', 'textarea'),
  ('clip_portugal_video_url', '', 'text'),
  ('clip_portugal_cta_label', 'Demander un devis', 'text'),

  -- Vision (commun)
  ('vision_kicker', 'Notre vision', 'text'),
  ('vision_title', 'Créer ce qui compte', 'text'),
  ('vision_text', 'Nous croyons que les marques et les artistes les plus puissants sont ceux qui osent créer leur propre langage.', 'textarea'),

  -- Entreprise sections additionnelles
  ('entreprise_sectors_title', 'Secteurs d''expertise', 'text'),
  ('entreprise_sectors_subtitle', 'Une approche sur mesure pour chaque industrie', 'textarea'),
  ('entreprise_orbit_title', 'Notre univers d''intervention', 'text')
ON CONFLICT (key) DO NOTHING;


-- ─────────────────────────────────────────────────────────
-- 6. SEED de démarrage (contenu existant)
-- ─────────────────────────────────────────────────────────

-- Marquee HOME
INSERT INTO public.marquee_items (page, kind, text_value, display_order) VALUES
  ('home', 'word', 'Création', 1),
  ('home', 'word', 'Production', 2),
  ('home', 'word', 'Stratégie', 3),
  ('home', 'word', 'Image de marque', 4),
  ('home', 'word', 'Direction artistique', 5);

-- Marquee ENTREPRISE
INSERT INTO public.marquee_items (page, kind, text_value, display_order) VALUES
  ('entreprise', 'word', 'Brand Content', 1),
  ('entreprise', 'word', 'Audiovisuel', 2),
  ('entreprise', 'word', 'Storytelling', 3),
  ('entreprise', 'word', 'Stratégie digitale', 4);

-- Sectors entreprise
INSERT INTO public.entreprise_sectors (name, icon, description, display_order) VALUES
  ('Luxe', '✨', 'Maisons et marques premium', 1),
  ('Tech', '⚡', 'Startups et scale-ups innovantes', 2),
  ('Mode', '👗', 'Créateurs et enseignes lifestyle', 3),
  ('Hôtellerie', '🏨', 'Groupes et adresses d''exception', 4),
  ('Food & Beverage', '🍷', 'Marques gastronomiques et spiritueux', 5),
  ('Culture', '🎭', 'Institutions et événements', 6);

-- TheArtist features
INSERT INTO public.theartist_features (title, description, display_order) VALUES
  ('Feed', 'Partage & découvre', 1),
  ('Portfolio', 'Bio, CV, tarifs', 2),
  ('Booking', 'Réserve facilement', 3),
  ('Chat', 'Échange en direct', 4);

-- Clip Portugal advantages
INSERT INTO public.clip_portugal_advantages (title, description, icon, display_order) VALUES
  ('Décors variés', 'Plages, falaises, villes historiques', '🌊', 1),
  ('Lumière naturelle', '300 jours de soleil par an', '☀️', 2),
  ('Coûts optimisés', 'Production 30-40% moins chère', '💰', 3),
  ('Équipe locale', 'Crew francophone expérimenté', '🎬', 4);
