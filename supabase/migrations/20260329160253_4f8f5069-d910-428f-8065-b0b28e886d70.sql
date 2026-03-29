
-- ═══════════════════════════════════════
-- Must Agence — Complete Database Schema
-- ═══════════════════════════════════════

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ───────── Site Settings ─────────
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text'
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);

-- ───────── Team Members ─────────
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  initials TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read team_members" ON public.team_members FOR SELECT USING (true);
CREATE TRIGGER update_team_members_ts BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ───────── Artist Categories ─────────
CREATE TABLE public.artist_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.artist_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read artist_categories" ON public.artist_categories FOR SELECT USING (true);

-- ───────── Artists ─────────
CREATE TABLE public.artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.artist_categories(id) ON DELETE CASCADE,
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read artists" ON public.artists FOR SELECT USING (true);

-- ───────── Client Categories ─────────
CREATE TABLE public.client_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.client_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read client_categories" ON public.client_categories FOR SELECT USING (true);

-- ───────── Clients ─────────
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL DEFAULT '',
  category_id UUID NOT NULL REFERENCES public.client_categories(id) ON DELETE CASCADE,
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read clients" ON public.clients FOR SELECT USING (true);

-- ───────── Packs ─────────
CREATE TABLE public.packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL,
  price_suffix TEXT NOT NULL DEFAULT 'HT',
  featured BOOLEAN NOT NULL DEFAULT false,
  badge TEXT NOT NULL DEFAULT '',
  bonus TEXT NOT NULL DEFAULT '',
  reassurance TEXT NOT NULL DEFAULT '',
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read packs" ON public.packs FOR SELECT USING (true);

-- ───────── Pack Features ─────────
CREATE TABLE public.pack_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id UUID NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.pack_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read pack_features" ON public.pack_features FOR SELECT USING (true);

-- ───────── Services Artiste ─────────
CREATE TABLE public.services_artiste (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.services_artiste ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services_artiste" ON public.services_artiste FOR SELECT USING (true);

CREATE TABLE public.service_artiste_chips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services_artiste(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.service_artiste_chips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read service_artiste_chips" ON public.service_artiste_chips FOR SELECT USING (true);

-- ───────── Services Entreprise ─────────
CREATE TABLE public.services_entreprise (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.services_entreprise ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services_entreprise" ON public.services_entreprise FOR SELECT USING (true);

CREATE TABLE public.service_entreprise_chips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services_entreprise(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.service_entreprise_chips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read service_entreprise_chips" ON public.service_entreprise_chips FOR SELECT USING (true);

-- ───────── Expertise ─────────
CREATE TABLE public.expertise_artiste (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  text TEXT NOT NULL DEFAULT '',
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.expertise_artiste ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read expertise_artiste" ON public.expertise_artiste FOR SELECT USING (true);

CREATE TABLE public.expertise_entreprise (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  text TEXT NOT NULL DEFAULT '',
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.expertise_entreprise ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read expertise_entreprise" ON public.expertise_entreprise FOR SELECT USING (true);

-- ───────── Process ─────────
CREATE TABLE public.process_artiste (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  text TEXT NOT NULL DEFAULT '',
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.process_artiste ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read process_artiste" ON public.process_artiste FOR SELECT USING (true);

CREATE TABLE public.process_entreprise (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  text TEXT NOT NULL DEFAULT '',
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.process_entreprise ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read process_entreprise" ON public.process_entreprise FOR SELECT USING (true);

-- ───────── Stats ─────────
CREATE TABLE public.stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  suffix TEXT NOT NULL DEFAULT '',
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read stats" ON public.stats FOR SELECT USING (true);

-- ───────── Portfolio ─────────
CREATE TABLE public.portfolio_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL DEFAULT '',
  tag TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.portfolio_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read portfolio_cases" ON public.portfolio_cases FOR SELECT USING (true);

CREATE TABLE public.case_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.portfolio_cases(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.case_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read case_metrics" ON public.case_metrics FOR SELECT USING (true);

-- ───────── Quote Form Steps ─────────
CREATE TABLE public.form_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  question TEXT NOT NULL,
  hint TEXT,
  type TEXT NOT NULL,
  placeholder TEXT,
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.form_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read form_steps" ON public.form_steps FOR SELECT USING (true);

CREATE TABLE public.form_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id UUID NOT NULL REFERENCES public.form_steps(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '',
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.form_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read form_options" ON public.form_options FOR SELECT USING (true);

-- ───────── Contact Submissions ─────────
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert contact_submissions" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- ───────── Quote Requests ─────────
CREATE TABLE public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile TEXT NOT NULL DEFAULT '',
  project_desc TEXT NOT NULL DEFAULT '',
  budget TEXT NOT NULL DEFAULT '',
  deadline TEXT,
  expectations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert quote_requests" ON public.quote_requests FOR INSERT WITH CHECK (true);

-- ───────── User Roles (for admin) ─────────
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Admin write policies for all content tables
CREATE POLICY "Admin write site_settings" ON public.site_settings FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write team_members" ON public.team_members FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write artist_categories" ON public.artist_categories FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write artists" ON public.artists FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write client_categories" ON public.client_categories FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write clients" ON public.clients FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write packs" ON public.packs FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write pack_features" ON public.pack_features FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write services_artiste" ON public.services_artiste FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write service_artiste_chips" ON public.service_artiste_chips FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write services_entreprise" ON public.services_entreprise FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write service_entreprise_chips" ON public.service_entreprise_chips FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write expertise_artiste" ON public.expertise_artiste FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write expertise_entreprise" ON public.expertise_entreprise FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write process_artiste" ON public.process_artiste FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write process_entreprise" ON public.process_entreprise FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write stats" ON public.stats FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write portfolio_cases" ON public.portfolio_cases FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write case_metrics" ON public.case_metrics FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write form_steps" ON public.form_steps FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write form_options" ON public.form_options FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin read contact_submissions" ON public.contact_submissions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin read quote_requests" ON public.quote_requests FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- ───────── Storage Bucket ─────────
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);
CREATE POLICY "Public read site-assets" ON storage.objects FOR SELECT USING (bucket_id = 'site-assets');
CREATE POLICY "Admin upload site-assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update site-assets" ON storage.objects FOR UPDATE USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete site-assets" ON storage.objects FOR DELETE USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
