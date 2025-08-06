/*
  # Ensure all tables have proper RLS policies

  1. Policies
    - Public can insert submissions
    - Public can view approved items
    - Authenticated users (admins) have full access

  2. Security
    - Ensure RLS is enabled on all tables
    - Add proper select/insert policies
*/

-- Ensure RLS is enabled on all tables
ALTER TABLE advisor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consortium_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "public_insert_policy" ON advisor_applications;
DROP POLICY IF EXISTS "public_view_approved_policy" ON advisor_applications;
DROP POLICY IF EXISTS "admin_full_access_policy" ON advisor_applications;

DROP POLICY IF EXISTS "public_insert_policy" ON company_submissions;
DROP POLICY IF EXISTS "public_view_approved_policy" ON company_submissions;
DROP POLICY IF EXISTS "admin_full_access_policy" ON company_submissions;

DROP POLICY IF EXISTS "public_insert_policy" ON consortium_submissions;
DROP POLICY IF EXISTS "public_view_approved_policy" ON consortium_submissions;
DROP POLICY IF EXISTS "admin_full_access_policy" ON consortium_submissions;

DROP POLICY IF EXISTS "public_insert_policy" ON innovation_submissions;
DROP POLICY IF EXISTS "public_view_approved_policy" ON innovation_submissions;
DROP POLICY IF EXISTS "admin_full_access_policy" ON innovation_submissions;

DROP POLICY IF EXISTS "public_insert_policy" ON event_submissions;
DROP POLICY IF EXISTS "public_view_approved_policy" ON event_submissions;
DROP POLICY IF EXISTS "admin_full_access_policy" ON event_submissions;

DROP POLICY IF EXISTS "public_view_policy" ON events;
DROP POLICY IF EXISTS "admin_full_access_policy" ON events;

DROP POLICY IF EXISTS "public_insert_policy" ON newsletter_subscribers;
DROP POLICY IF EXISTS "admin_full_access_policy" ON newsletter_subscribers;

-- Create consistent policies for all submission tables
CREATE POLICY "Allow public inserts"
  ON advisor_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to view approved"
  ON advisor_applications
  FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Allow admin full access"
  ON advisor_applications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public inserts"
  ON company_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to view approved"
  ON company_submissions
  FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Allow admin full access"
  ON company_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public inserts"
  ON consortium_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to view approved"
  ON consortium_submissions
  FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Allow admin full access"
  ON consortium_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public inserts"
  ON innovation_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to view approved"
  ON innovation_submissions
  FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Allow admin full access"
  ON innovation_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public inserts"
  ON event_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to view approved"
  ON event_submissions
  FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Allow admin full access"
  ON event_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public to view all events"
  ON events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin full access"
  ON events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public inserts"
  ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow admin full access"
  ON newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);