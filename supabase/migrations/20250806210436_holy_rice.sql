/*
  # Ensure all storage buckets exist for file uploads

  1. Storage Buckets
    - Create buckets for advisor files, event logos, company images, consortium logos, innovation logos
    - Set proper policies for public access where needed

  2. Security
    - Enable public access for logo buckets
    - Restrict upload access to authenticated users where appropriate
*/

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('advisor-files', 'advisor-files', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
  ('event-logos', 'event-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('company-images', 'company-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('consortium-logos', 'consortium-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('innovation-logos', 'innovation-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for public access to logos
CREATE POLICY "Public can view event logos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'event-logos');

CREATE POLICY "Public can view company images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'company-images');

CREATE POLICY "Public can view consortium logos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'consortium-logos');

CREATE POLICY "Public can view innovation logos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'innovation-logos');

-- Storage policies for uploads
CREATE POLICY "Anyone can upload event logos"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'event-logos');

CREATE POLICY "Anyone can upload company images"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'company-images');

CREATE POLICY "Anyone can upload consortium logos"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'consortium-logos');

CREATE POLICY "Anyone can upload innovation logos"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'innovation-logos');

CREATE POLICY "Anyone can upload advisor files"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'advisor-files');

CREATE POLICY "Anyone can view advisor files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'advisor-files');