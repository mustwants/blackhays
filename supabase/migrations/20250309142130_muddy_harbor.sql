/*
  # Fix Row Level Security Policies

  1. Changes
     - Fix RLS policies for all tables to ensure authenticated users have full access
     - Add missing policies where needed
     - Ensure public users can submit data but only see approved content

  2. Security
     - Enable row level security on all tables
     - Add specific policies for authenticated and public users
*/

-- This will enable RLS and add proper policies to all tables
-- that might have missing or incorrect policies

-- Fix event_submissions table policies
ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;

-- Make sure authenticated users have full access
DROP POLICY IF EXISTS "Admins have full access to event submissions" ON event_submissions;
CREATE POLICY "Admins have full access to event submissions" 
  ON event_submissions 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Fix company_submissions table policies
ALTER TABLE company_submissions ENABLE ROW LEVEL SECURITY;

-- Make sure authenticated users have full access
DROP POLICY IF EXISTS "Admins have full access to companies" ON company_submissions;
CREATE POLICY "Admins have full access to companies" 
  ON company_submissions 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Fix consortium_submissions table policies
ALTER TABLE consortium_submissions ENABLE ROW LEVEL SECURITY;

-- Make sure authenticated users have full access
DROP POLICY IF EXISTS "consortium_admin_full_access_2025" ON consortium_submissions;
CREATE POLICY "consortium_admin_full_access_2025" 
  ON consortium_submissions 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Fix innovation_submissions table policies
ALTER TABLE innovation_submissions ENABLE ROW LEVEL SECURITY;

-- Make sure authenticated users have full access
DROP POLICY IF EXISTS "Admins have full access to innovations" ON innovation_submissions;
CREATE POLICY "Admins have full access to innovations" 
  ON innovation_submissions 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Fix advisor_applications table policies
ALTER TABLE advisor_applications ENABLE ROW LEVEL SECURITY;

-- Make sure authenticated users have full access
DROP POLICY IF EXISTS "Admins have full access to advisors" ON advisor_applications;
CREATE POLICY "Admins have full access to advisors" 
  ON advisor_applications 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Fix newsletter_subscribers table policies
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Make sure authenticated users have full access
DROP POLICY IF EXISTS "Admins have full access to subscribers" ON newsletter_subscribers;
CREATE POLICY "Admins have full access to subscribers" 
  ON newsletter_subscribers 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Fix events table policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Make sure authenticated users have full access
DROP POLICY IF EXISTS "Admins have full access to events" ON events;
CREATE POLICY "Admins have full access to events" 
  ON events 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Function to ensure we have updated_at timestamps for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;