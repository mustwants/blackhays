/*
  # Fix Row Level Security Policies

  1. Changes
     - Adds missing RLS policies for admin access
     - Ensures public insertion permissions are properly set
     - Fixes anonymous access permissions
*/

-- First ensure RLS is enabled on all tables
ALTER TABLE IF EXISTS event_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS advisor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS company_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS consortium_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS innovation_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Clear duplicated policies
DROP POLICY IF EXISTS enable_auth_all_events_sub ON event_submissions;
DROP POLICY IF EXISTS enable_public_insert_events_sub ON event_submissions;
DROP POLICY IF EXISTS enable_public_view_approved_events_sub ON event_submissions;

DROP POLICY IF EXISTS event_admin_access ON event_submissions;
DROP POLICY IF EXISTS event_admin_policy_2025 ON event_submissions;
DROP POLICY IF EXISTS event_insert_policy_2025 ON event_submissions;
DROP POLICY IF EXISTS event_public_insert ON event_submissions;
DROP POLICY IF EXISTS event_public_view_approved ON event_submissions;
DROP POLICY IF EXISTS event_submissions_admin_policy ON event_submissions;
DROP POLICY IF EXISTS event_submissions_insert_policy ON event_submissions;
DROP POLICY IF EXISTS event_submissions_select_policy ON event_submissions;

-- Create clear, simplified policies for event submissions
CREATE POLICY "Admin full access to event submissions" 
  ON event_submissions 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Public can insert event submissions" 
  ON event_submissions 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Public can view approved event submissions" 
  ON event_submissions 
  FOR SELECT 
  TO anon 
  USING (status = 'approved');

-- Similarly fix innovation_submissions policies
DROP POLICY IF EXISTS "Admins have full access to innovation submissions" ON innovation_submissions;
DROP POLICY IF EXISTS "Admins have full access to innovations" ON innovation_submissions;
DROP POLICY IF EXISTS "Public can submit innovations" ON innovation_submissions;
DROP POLICY IF EXISTS "Public can view approved innovations" ON innovation_submissions;
DROP POLICY IF EXISTS enable_auth_all_innovations ON innovation_submissions;
DROP POLICY IF EXISTS enable_public_insert_innovations ON innovation_submissions;
DROP POLICY IF EXISTS enable_public_view_approved_innovations ON innovation_submissions;
DROP POLICY IF EXISTS innovation_admin_access ON innovation_submissions;
DROP POLICY IF EXISTS innovation_admin_policy_2025 ON innovation_submissions;
DROP POLICY IF EXISTS innovation_insert_policy_2025 ON innovation_submissions;
DROP POLICY IF EXISTS innovation_public_insert ON innovation_submissions;
DROP POLICY IF EXISTS innovation_public_view_approved ON innovation_submissions;
DROP POLICY IF EXISTS innovation_submissions_admin_policy ON innovation_submissions;
DROP POLICY IF EXISTS innovation_submissions_insert_policy ON innovation_submissions;
DROP POLICY IF EXISTS innovation_submissions_select_policy ON innovation_submissions;
DROP POLICY IF EXISTS innovation_view_approved_policy_2025 ON innovation_submissions;

-- Create simplified policies for innovation submissions
CREATE POLICY "Admin full access to innovation submissions" 
  ON innovation_submissions 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Public can insert innovation submissions" 
  ON innovation_submissions 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Public can view approved innovation submissions" 
  ON innovation_submissions 
  FOR SELECT 
  TO anon 
  USING (status = 'approved');

-- Apply similar policy simplification to other tables
-- For advisor_applications
DROP POLICY IF EXISTS "Only admins can delete applications" ON advisor_applications;
DROP POLICY IF EXISTS "Only admins can update applications" ON advisor_applications;
DROP POLICY IF EXISTS "Only admins can view applications" ON advisor_applications;
DROP POLICY IF EXISTS "Public can submit advisor applications" ON advisor_applications;
DROP POLICY IF EXISTS "Public can view approved advisors" ON advisor_applications;
DROP POLICY IF EXISTS advisor_admin_access ON advisor_applications;
DROP POLICY IF EXISTS advisor_admin_policy_2025 ON advisor_applications;
DROP POLICY IF EXISTS advisor_insert_policy_2025 ON advisor_applications;
DROP POLICY IF EXISTS advisor_public_insert ON advisor_applications;
DROP POLICY IF EXISTS advisor_public_view_approved ON advisor_applications;
DROP POLICY IF EXISTS advisor_view_approved_policy_2025 ON advisor_applications;
DROP POLICY IF EXISTS enable_auth_all_advisors ON advisor_applications;
DROP POLICY IF EXISTS enable_public_insert_advisors ON advisor_applications;
DROP POLICY IF EXISTS enable_public_view_approved_advisors ON advisor_applications;

CREATE POLICY "Admin full access to advisor applications" 
  ON advisor_applications 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Public can insert advisor applications" 
  ON advisor_applications 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Public can view approved advisors" 
  ON advisor_applications 
  FOR SELECT 
  TO anon 
  USING (status = 'approved');

-- For company_submissions
DROP POLICY IF EXISTS "Admins have full access to companies" ON company_submissions;
DROP POLICY IF EXISTS "Public can submit companies" ON company_submissions;
DROP POLICY IF EXISTS "Public can view approved companies" ON company_submissions;

CREATE POLICY "Admin full access to company submissions" 
  ON company_submissions 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Public can insert company submissions" 
  ON company_submissions 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Public can view approved companies" 
  ON company_submissions 
  FOR SELECT 
  TO anon 
  USING (status = 'approved');

-- For consortium_submissions
DROP POLICY IF EXISTS consortium_admin_full_access_2025 ON consortium_submissions;
DROP POLICY IF EXISTS consortium_public_submit_2025 ON consortium_submissions;
DROP POLICY IF EXISTS consortium_public_view_approved_2025 ON consortium_submissions;

CREATE POLICY "Admin full access to consortium submissions" 
  ON consortium_submissions 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Public can insert consortium submissions" 
  ON consortium_submissions 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Public can view approved consortiums" 
  ON consortium_submissions 
  FOR SELECT 
  TO anon 
  USING (status = 'approved');

-- For newsletter_subscribers
DROP POLICY IF EXISTS "Admins can manage subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admins have full access to subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public to subscribe" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Only admins can delete subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Only admins can update subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Only admins can view subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Public can subscribe" ON newsletter_subscribers;
DROP POLICY IF EXISTS enable_auth_all_newsletter ON newsletter_subscribers;
DROP POLICY IF EXISTS enable_public_insert_newsletter ON newsletter_subscribers;
DROP POLICY IF EXISTS newsletter_admin_access ON newsletter_subscribers;
DROP POLICY IF EXISTS newsletter_admin_policy_2025 ON newsletter_subscribers;
DROP POLICY IF EXISTS newsletter_insert_policy_2025 ON newsletter_subscribers;
DROP POLICY IF EXISTS newsletter_public_insert ON newsletter_subscribers;
DROP POLICY IF EXISTS newsletter_subscribers_admin_policy ON newsletter_subscribers;
DROP POLICY IF EXISTS newsletter_subscribers_insert_policy ON newsletter_subscribers;

CREATE POLICY "Admin full access to newsletter subscribers" 
  ON newsletter_subscribers 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Public can subscribe to newsletter" 
  ON newsletter_subscribers 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);