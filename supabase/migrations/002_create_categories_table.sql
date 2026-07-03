-- ============================================================
-- 002: Create categories table + seed default data
-- Run this in the Supabase SQL Editor (https://app.supabase.com)
-- ============================================================

-- 1. Create the categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL UNIQUE,
  slug       text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. Public can read categories (needed for filter bar on homepage)
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories"
  ON public.categories FOR SELECT
  USING (true);

-- 4. Only authenticated users can INSERT / UPDATE / DELETE
DROP POLICY IF EXISTS "Auth write categories" ON public.categories;
CREATE POLICY "Auth write categories"
  ON public.categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Seed default categories
INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('LIVERY MOBIL', 'livery-mobil', 1),
  ('DESAIN KAOS',  'desain-kaos',  2),
  ('DESAIN LOGO',  'desain-logo',  3),
  ('BRANDING',     'branding',     4)
ON CONFLICT (slug) DO NOTHING;
