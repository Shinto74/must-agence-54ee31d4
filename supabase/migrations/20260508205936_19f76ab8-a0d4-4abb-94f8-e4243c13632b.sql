-- Add business qualification columns + lead score to both request tables
ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS style text DEFAULT '',
  ADD COLUMN IF NOT EXISTS company_size text DEFAULT '',
  ADD COLUMN IF NOT EXISTS objective text DEFAULT '',
  ADD COLUMN IF NOT EXISTS timeline text DEFAULT '',
  ADD COLUMN IF NOT EXISTS lead_score integer NOT NULL DEFAULT 0;

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS style text DEFAULT '',
  ADD COLUMN IF NOT EXISTS company_size text DEFAULT '',
  ADD COLUMN IF NOT EXISTS objective text DEFAULT '',
  ADD COLUMN IF NOT EXISTS timeline text DEFAULT '',
  ADD COLUMN IF NOT EXISTS lead_score integer NOT NULL DEFAULT 0;

-- Update statuses defaults: keep "nouveau" valid + allow new ones (text col, no constraint)
-- Adjust existing rows: leave as-is.

-- Lead scoring helpers
CREATE OR REPLACE FUNCTION public.calc_lead_score(
  _budget text, _timeline text, _objective text, _desc text
) RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  s integer := 0;
  b text := lower(coalesce(_budget, ''));
  t text := lower(coalesce(_timeline, ''));
BEGIN
  IF b LIKE '%5k%' OR b LIKE '%10k%' OR b LIKE '%+%' OR b LIKE '%plus%' THEN
    s := s + 30;
  END IF;
  IF t = 'asap' OR t LIKE '%dès que%' OR t LIKE '%mois-ci%' OR t = 'ce_mois' THEN
    s := s + 20;
  END IF;
  IF coalesce(_objective, '') <> '' THEN
    s := s + 20;
  END IF;
  IF length(coalesce(_desc, '')) > 80 THEN
    s := s + 30;
  END IF;
  RETURN LEAST(s, 100);
END;
$$;

CREATE OR REPLACE FUNCTION public.compute_lead_score_quote()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.lead_score := public.calc_lead_score(NEW.budget, NEW.timeline, NEW.objective, NEW.project_desc);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.compute_lead_score_contact()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.lead_score := public.calc_lead_score(NEW.budget_estimate, NEW.timeline, NEW.objective, NEW.message);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_quote_lead_score ON public.quote_requests;
CREATE TRIGGER trg_quote_lead_score
  BEFORE INSERT OR UPDATE OF budget, timeline, objective, project_desc
  ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.compute_lead_score_quote();

DROP TRIGGER IF EXISTS trg_contact_lead_score ON public.contact_submissions;
CREATE TRIGGER trg_contact_lead_score
  BEFORE INSERT OR UPDATE OF budget_estimate, timeline, objective, message
  ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.compute_lead_score_contact();

-- Backfill scores for existing rows
UPDATE public.quote_requests SET lead_score = public.calc_lead_score(budget, timeline, objective, project_desc);
UPDATE public.contact_submissions SET lead_score = public.calc_lead_score(budget_estimate, timeline, objective, message);