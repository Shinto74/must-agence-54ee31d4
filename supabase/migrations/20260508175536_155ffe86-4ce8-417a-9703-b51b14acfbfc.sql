CREATE TABLE public.pack_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id uuid,
  pack_name text NOT NULL DEFAULT '',
  pack_price text NOT NULL DEFAULT '',
  action text NOT NULL DEFAULT 'stripe',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.pack_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert pack_clicks" ON public.pack_clicks
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admin read pack_clicks" ON public.pack_clicks
  FOR SELECT TO public USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin delete pack_clicks" ON public.pack_clicks
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_pack_clicks_created ON public.pack_clicks (created_at DESC);
CREATE INDEX idx_pack_clicks_pack ON public.pack_clicks (pack_id);