-- ============================================================
-- 001: Create projects table + RLS policies
-- Run this in the Supabase SQL Editor (https://app.supabase.com)
-- ============================================================

-- 1. Create the projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  slug        text NOT NULL UNIQUE,
  client      text,
  year        integer,
  category    text NOT NULL DEFAULT 'UNCATEGORIZED',
  description text,
  thumbnail   text,
  mockups     text[] NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. Auto-update `updated_at` on every row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 4. Public can SELECT (read) all projects (for the portfolio page)
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects"
  ON public.projects FOR SELECT
  USING (true);

-- 5. Only authenticated users can INSERT / UPDATE / DELETE
DROP POLICY IF EXISTS "Auth insert projects" ON public.projects;
CREATE POLICY "Auth insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Auth update projects" ON public.projects;
CREATE POLICY "Auth update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Auth delete projects" ON public.projects;
CREATE POLICY "Auth delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Storage bucket: portfolio-images
-- (The API auto-creates this too, but running here is safer)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public to read files
DROP POLICY IF EXISTS "Public read portfolio images" ON storage.objects;
CREATE POLICY "Public read portfolio images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

-- Allow authenticated users to upload
DROP POLICY IF EXISTS "Auth upload portfolio images" ON storage.objects;
CREATE POLICY "Auth upload portfolio images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-images');

-- Allow authenticated users to delete
DROP POLICY IF EXISTS "Auth delete portfolio images" ON storage.objects;
CREATE POLICY "Auth delete portfolio images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-images');
