
CREATE TABLE public.page_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  user_email TEXT,
  page TEXT NOT NULL,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_analytics_page ON public.page_analytics(page);
CREATE INDEX idx_page_analytics_visited_at ON public.page_analytics(visited_at DESC);

GRANT INSERT ON public.page_analytics TO anon, authenticated;
GRANT SELECT ON public.page_analytics TO authenticated;
GRANT ALL ON public.page_analytics TO service_role;

ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;

-- Anyone can log a page view (including anonymous visitors)
CREATE POLICY "anyone_can_insert_pageview"
  ON public.page_analytics FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins (profiles.role = 'admin') can read aggregate analytics
CREATE OR REPLACE FUNCTION public.is_admin(_uid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _uid AND lower(role) = 'admin'
  );
$$;

CREATE POLICY "admins_can_read_pageviews"
  ON public.page_analytics FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));
