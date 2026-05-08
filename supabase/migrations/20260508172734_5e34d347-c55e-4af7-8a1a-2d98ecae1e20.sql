
-- 1. Quote requests : ajouter coordonnées + suivi
ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS email text DEFAULT '',
  ADD COLUMN IF NOT EXISTS phone text DEFAULT '',
  ADD COLUMN IF NOT EXISTS company text DEFAULT '',
  ADD COLUMN IF NOT EXISTS source text DEFAULT '',
  ADD COLUMN IF NOT EXISTS assigned_to text DEFAULT '',
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_activity_at timestamptz NOT NULL DEFAULT now();

-- 2. Contact submissions : champs séparés + suivi
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS company text DEFAULT '',
  ADD COLUMN IF NOT EXISTS sector text DEFAULT '',
  ADD COLUMN IF NOT EXISTS budget_estimate text DEFAULT '',
  ADD COLUMN IF NOT EXISTS source text DEFAULT '',
  ADD COLUMN IF NOT EXISTS assigned_to text DEFAULT '',
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_activity_at timestamptz NOT NULL DEFAULT now();

-- 3. Index pour scalabilité
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON public.quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_archived ON public.quote_requests(archived_at);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created ON public.quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_archived ON public.contact_submissions(archived_at);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON public.contact_submissions(created_at DESC);

-- 4. Triggers : mettre à jour last_activity_at à chaque update
CREATE OR REPLACE FUNCTION public.touch_last_activity()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.last_activity_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS quote_requests_touch_activity ON public.quote_requests;
CREATE TRIGGER quote_requests_touch_activity
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.touch_last_activity();

DROP TRIGGER IF EXISTS contact_submissions_touch_activity ON public.contact_submissions;
CREATE TRIGGER contact_submissions_touch_activity
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.touch_last_activity();

-- 5. Notes internes
CREATE TABLE IF NOT EXISTS public.request_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type text NOT NULL CHECK (request_type IN ('quote','contact')),
  request_id uuid NOT NULL,
  author_id uuid,
  author_email text DEFAULT '',
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_request_notes_request ON public.request_notes(request_type, request_id, created_at DESC);

ALTER TABLE public.request_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin read request_notes" ON public.request_notes
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin insert request_notes" ON public.request_notes
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin update request_notes" ON public.request_notes
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin delete request_notes" ON public.request_notes
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Auto-archivage : fonction qui archive ce qui est "termine" depuis 30j
CREATE OR REPLACE FUNCTION public.auto_archive_old_requests()
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.quote_requests SET archived_at = now()
    WHERE status = 'termine' AND archived_at IS NULL
      AND last_activity_at < now() - interval '30 days';
  UPDATE public.contact_submissions SET archived_at = now()
    WHERE status = 'termine' AND archived_at IS NULL
      AND last_activity_at < now() - interval '30 days';
$$;
