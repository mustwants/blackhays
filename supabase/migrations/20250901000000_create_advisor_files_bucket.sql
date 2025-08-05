-- Create storage bucket for advisor application files
INSERT INTO storage.buckets (id, name, public)
VALUES ('advisor-files', 'advisor-files', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to advisor-files bucket
CREATE POLICY "public_upload_advisor_files"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'advisor-files');

CREATE POLICY "public_read_advisor_files"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'advisor-files');

CREATE POLICY "public_update_advisor_files"
ON storage.objects FOR UPDATE TO public
USING (bucket_id = 'advisor-files')
WITH CHECK (bucket_id = 'advisor-files');
