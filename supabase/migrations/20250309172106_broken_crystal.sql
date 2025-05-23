/*
  # Fix RLS Policies for Tables

  1. Security Changes
    - Enable RLS on all tables
    - Drop existing policies to avoid conflicts
    - Add policies for authenticated users to have full access
    - Add policies for public to insert submissions
    - Add policies for public to view approved items

  2. Tables Modified
    - company_submissions
    - consortium_submissions
    - innovation_submissions
    - event_submissions
    - newsletter_subscribers
*/

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Public can view approved companies" ON company_submissions;
DROP POLICY IF EXISTS "Public can submit companies" ON company_submissions;
DROP POLICY IF EXISTS "Authenticated users have full access to company submissions" ON company_submissions;

DROP POLICY IF EXISTS "Public can view approved consortiums" ON consortium_submissions;
DROP POLICY IF EXISTS "Public can submit consortiums" ON consortium_submissions;
DROP POLICY IF EXISTS "Authenticated users have full access to consortium submissions" ON consortium_submissions;

DROP POLICY IF EXISTS "Public can view approved innovations" ON innovation_submissions;
DROP POLICY IF EXISTS "Public can submit innovations" ON innovation_submissions;
DROP POLICY IF EXISTS "Authenticated users have full access to innovation submissions" ON innovation_submissions;

DROP POLICY IF EXISTS "Public can view approved events" ON event_submissions;
DROP POLICY IF EXISTS "Public can submit events" ON event_submissions;
DROP POLICY IF EXISTS "Authenticated users have full access to event submissions" ON event_submissions;

DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users have full access to newsletter subscribers" ON newsletter_subscribers;

-- Enable RLS on all tables
ALTER TABLE company_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consortium_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create new policies for company_submissions
CREATE POLICY "Authenticated users have full access to company submissions"
ON company_submissions FOR ALL TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Public can submit companies"
ON company_submissions FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Public can view approved companies"
ON company_submissions FOR SELECT TO public
USING (status = 'approved');

-- Create new policies for consortium_submissions
CREATE POLICY "Authenticated users have full access to consortium submissions"
ON consortium_submissions FOR ALL TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Public can submit consortiums"
ON consortium_submissions FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Public can view approved consortiums"
ON consortium_submissions FOR SELECT TO public
USING (status = 'approved');

-- Create new policies for innovation_submissions
CREATE POLICY "Authenticated users have full access to innovation submissions"
ON innovation_submissions FOR ALL TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Public can submit innovations"
ON innovation_submissions FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Public can view approved innovations"
ON innovation_submissions FOR SELECT TO public
USING (status = 'approved');

-- Create new policies for event_submissions
CREATE POLICY "Authenticated users have full access to event submissions"
ON event_submissions FOR ALL TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Public can submit events"
ON event_submissions FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Public can view approved events"
ON event_submissions FOR SELECT TO public
USING (status = 'approved');

-- Create new policies for newsletter_subscribers
CREATE POLICY "Authenticated users have full access to newsletter subscribers"
ON newsletter_subscribers FOR ALL TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Public can subscribe to newsletter"
ON newsletter_subscribers FOR INSERT TO public
WITH CHECK (true);