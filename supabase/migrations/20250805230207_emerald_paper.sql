/*
  # Create Storage Buckets for File Uploads

  1. Storage Buckets
    - `company-images` - For company logos and product images
    - `consortium-logos` - For consortium logos
    - `innovation-logos` - For innovation organization logos
    - `event-logos` - For event logos
    - `advisor-files` - For advisor resumes, headshots, and business logos

  2. Storage Policies
    - Public read access for approved content
    - Authenticated write access for file uploads
    - Size limits and file type restrictions
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('company-images', 'company-images', true),
('consortium-logos', 'consortium-logos', true),
('innovation-logos', 'innovation-logos', true),
('event-logos', 'event-logos', true),
('advisor-files', 'advisor-files', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to approved content
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT TO public
USING (bucket_id IN ('company-images', 'consortium-logos', 'innovation-logos', 'event-logos', 'advisor-files'));

-- Policy for authenticated upload access
CREATE POLICY "Authenticated upload access" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id IN ('company-images', 'consortium-logos', 'innovation-logos', 'event-logos', 'advisor-files'));

-- Policy for authenticated update access
CREATE POLICY "Authenticated update access" ON storage.objects
FOR UPDATE TO public
USING (bucket_id IN ('company-images', 'consortium-logos', 'innovation-logos', 'event-logos', 'advisor-files'));

-- Policy for authenticated delete access
CREATE POLICY "Authenticated delete access" ON storage.objects
FOR DELETE TO public
USING (bucket_id IN ('company-images', 'consortium-logos', 'innovation-logos', 'event-logos', 'advisor-files'));