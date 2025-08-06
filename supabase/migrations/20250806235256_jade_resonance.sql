/*
  # Fix Admin Access Policies

  1. Security Updates
    - Update RLS policies to ensure authenticated users can see ALL data
    - Fix admin access to view, edit, and manage all submissions
    - Ensure proper authentication checks for admin operations

  2. Policy Changes
    - Remove restrictive policies that prevent admins from seeing pending/rejected items
    - Add comprehensive admin access policies
    - Maintain public read access for approved items only
*/

-- Drop existing restrictive policies and recreate with proper admin access

-- Fix advisor_applications policies
DROP POLICY IF EXISTS "Allow admin full access" ON advisor_applications;
DROP POLICY IF EXISTS "Allow public to view approved" ON advisor_applications;
DROP POLICY IF EXISTS "Allow public inserts" ON advisor_applications;

CREATE POLICY "Allow authenticated full access to advisor_applications"
  ON advisor_applications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public inserts to advisor_applications"
  ON advisor_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to view approved advisor_applications"
  ON advisor_applications
  FOR SELECT
  TO anon
  USING (status = 'approved');

-- Fix company_submissions policies
DROP POLICY IF EXISTS "Allow admin full access" ON company_submissions;
DROP POLICY IF EXISTS "Allow public to view approved" ON company_submissions;
DROP POLICY IF EXISTS "Allow public inserts" ON company_submissions;

CREATE POLICY "Allow authenticated full access to company_submissions"
  ON company_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public inserts to company_submissions"
  ON company_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to view approved company_submissions"
  ON company_submissions
  FOR SELECT
  TO anon
  USING (status = 'approved');

-- Fix consortium_submissions policies
DROP POLICY IF EXISTS "Allow admin full access" ON consortium_submissions;
DROP POLICY IF EXISTS "Allow public to view approved" ON consortium_submissions;
DROP POLICY IF EXISTS "Allow public inserts" ON consortium_submissions;

CREATE POLICY "Allow authenticated full access to consortium_submissions"
  ON consortium_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public inserts to consortium_submissions"
  ON consortium_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to view approved consortium_submissions"
  ON consortium_submissions
  FOR SELECT
  TO anon
  USING (status = 'approved');

-- Fix innovation_submissions policies
DROP POLICY IF EXISTS "Allow admin full access" ON innovation_submissions;
DROP POLICY IF EXISTS "Allow public to view approved" ON innovation_submissions;
DROP POLICY IF EXISTS "Allow public inserts" ON innovation_submissions;

CREATE POLICY "Allow authenticated full access to innovation_submissions"
  ON innovation_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public inserts to innovation_submissions"
  ON innovation_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to view approved innovation_submissions"
  ON innovation_submissions
  FOR SELECT
  TO anon
  USING (status = 'approved');

-- Fix event_submissions policies
DROP POLICY IF EXISTS "Allow admin full access" ON event_submissions;
DROP POLICY IF EXISTS "Allow public to view approved" ON event_submissions;
DROP POLICY IF EXISTS "Allow public inserts" ON event_submissions;

CREATE POLICY "Allow authenticated full access to event_submissions"
  ON event_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public inserts to event_submissions"
  ON event_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to view approved event_submissions"
  ON event_submissions
  FOR SELECT
  TO anon
  USING (status = 'approved');

-- Fix newsletter_subscribers policies
DROP POLICY IF EXISTS "Allow admin full access" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public inserts" ON newsletter_subscribers;

CREATE POLICY "Allow authenticated full access to newsletter_subscribers"
  ON newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public inserts to newsletter_subscribers"
  ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Fix events table policies (if needed)
DROP POLICY IF EXISTS "Allow admin full access" ON events;
DROP POLICY IF EXISTS "Allow public to view all events" ON events;

CREATE POLICY "Allow authenticated full access to events"
  ON events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public to view all events"
  ON events
  FOR SELECT
  TO anon
  USING (true);