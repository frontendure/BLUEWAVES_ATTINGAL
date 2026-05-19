-- Hero Slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  is_active BOOLEAN DEFAULT true,
  order_val INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  time_range TEXT NOT NULL,
  label TEXT NOT NULL,
  badge_type TEXT DEFAULT 'default',
  order_val INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Membership Fees table
CREATE TABLE IF NOT EXISTS membership_fees (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  note TEXT,
  order_val INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add category column to gallery if missing
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

-- RLS Policies
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read hero_slides" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Auth write hero_slides" ON hero_slides FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Auth write programs" ON programs FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read membership_fees" ON membership_fees FOR SELECT USING (true);
CREATE POLICY "Auth write membership_fees" ON membership_fees FOR ALL USING (auth.role() = 'authenticated');

-- Home Banners table
CREATE TABLE IF NOT EXISTS home_banners (
  id BIGSERIAL PRIMARY KEY,
  heading TEXT NOT NULL,
  subheading TEXT,
  content TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE home_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read home_banners" ON home_banners FOR SELECT USING (true);
CREATE POLICY "Auth write home_banners" ON home_banners FOR ALL USING (auth.role() = 'authenticated');
