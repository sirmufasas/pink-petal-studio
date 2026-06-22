
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX bookings_date_idx ON public.bookings(date);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete bookings" ON public.bookings FOR DELETE USING (true);

CREATE TABLE public.blocked_days (
  date DATE PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_days TO anon, authenticated;
GRANT ALL ON public.blocked_days TO service_role;
ALTER TABLE public.blocked_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read blocked days" ON public.blocked_days FOR SELECT USING (true);
CREATE POLICY "Anyone can insert blocked days" ON public.blocked_days FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete blocked days" ON public.blocked_days FOR DELETE USING (true);

CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO anon, authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read gallery" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert gallery" ON public.gallery_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete gallery" ON public.gallery_items FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blocked_days;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_items;
