-- Supabase Schema for Minimalist Designer Portfolio CMS

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  client text,
  year integer,
  category text,
  description text,
  thumbnail text,
  mockups text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 2. Create RLS Policies for public access (Read Only)
CREATE POLICY "Allow public read access on projects" 
  ON public.projects FOR SELECT 
  USING (true);

-- 3. Create RLS Policies for authenticated admin (CRUD)
CREATE POLICY "Allow authenticated full access on projects" 
  ON public.projects FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Setup Storage Bucket (Execute this via Supabase Dashboard or API if bucket doesn't exist)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true);

-- Enable RLS on storage.objects
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public access to view images
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');

-- Allow authenticated users to upload/update/delete images
-- CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-images');
-- CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-images');
-- CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-images');

-- 5. Helper Function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_project_updated
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();
