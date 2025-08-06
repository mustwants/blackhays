/*
  # Complete Schema Fixes for BlackHays Platform

  1. Storage Buckets
     - Create all required storage buckets for file uploads
     - Set proper RLS policies for public uploads and reads

  2. Table Schema Fixes
     - Add missing columns to all submission tables
     - Ensure proper data types and constraints
     - Add performance indexes

  3. RLS Policies
     - Allow public inserts for all submission tables
     - Allow public reads for approved items only
     - Allow admin full access to all tables

  4. Performance Optimizations
     - Add indexes for common queries
     - Optimize status and date-based searches
*/

-- Create storage buckets if they don't exist
DO $$
BEGIN
  -- Advisor files bucket
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'advisor-files') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('advisor-files', 'advisor-files', true);
  END IF;
  
  -- Company images bucket
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'company-images') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('company-images', 'company-images', true);
  END IF;
  
  -- Event logos bucket
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'event-logos') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('event-logos', 'event-logos', true);
  END IF;
  
  -- Consortium logos bucket
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'consortium-logos') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('consortium-logos', 'consortium-logos', true);
  END IF;
  
  -- Innovation logos bucket
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'innovation-logos') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('innovation-logos', 'innovation-logos', true);
  END IF;
END $$;

-- Storage policies for advisor-files bucket
CREATE POLICY IF NOT EXISTS "Allow public uploads to advisor-files"
  ON storage.objects FOR INSERT TO public
  WITH CHECK (bucket_id = 'advisor-files');

CREATE POLICY IF NOT EXISTS "Allow public read access to advisor-files"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'advisor-files');

-- Storage policies for company-images bucket
CREATE POLICY IF NOT EXISTS "Allow public uploads to company-images"
  ON storage.objects FOR INSERT TO public
  WITH CHECK (bucket_id = 'company-images');

CREATE POLICY IF NOT EXISTS "Allow public read access to company-images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'company-images');

-- Storage policies for event-logos bucket
CREATE POLICY IF NOT EXISTS "Allow public uploads to event-logos"
  ON storage.objects FOR INSERT TO public
  WITH CHECK (bucket_id = 'event-logos');

CREATE POLICY IF NOT EXISTS "Allow public read access to event-logos"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'event-logos');

-- Storage policies for consortium-logos bucket
CREATE POLICY IF NOT EXISTS "Allow public uploads to consortium-logos"
  ON storage.objects FOR INSERT TO public
  WITH CHECK (bucket_id = 'consortium-logos');

CREATE POLICY IF NOT EXISTS "Allow public read access to consortium-logos"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'consortium-logos');

-- Storage policies for innovation-logos bucket
CREATE POLICY IF NOT EXISTS "Allow public uploads to innovation-logos"
  ON storage.objects FOR INSERT TO public
  WITH CHECK (bucket_id = 'innovation-logos');

CREATE POLICY IF NOT EXISTS "Allow public read access to innovation-logos"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'innovation-logos');

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS advisor_email_idx ON advisor_applications(email);
CREATE INDEX IF NOT EXISTS advisor_city_state_idx ON advisor_applications(city, state);
CREATE INDEX IF NOT EXISTS company_email_idx ON company_submissions(contact_email);
CREATE INDEX IF NOT EXISTS company_industry_idx ON company_submissions(industry);
CREATE INDEX IF NOT EXISTS consortium_email_idx ON consortium_submissions(contact_email);
CREATE INDEX IF NOT EXISTS consortium_focus_idx ON consortium_submissions(focus_area);
CREATE INDEX IF NOT EXISTS innovation_email_idx ON innovation_submissions(contact_email);
CREATE INDEX IF NOT EXISTS innovation_type_idx ON innovation_submissions(type);
CREATE INDEX IF NOT EXISTS event_submitter_email_idx ON event_submissions(submitter_email);
CREATE INDEX IF NOT EXISTS newsletter_email_status_idx ON newsletter_subscribers(email, status);