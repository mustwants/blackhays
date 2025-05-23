/*
  # Add Row Level Security Policies

  1. Changes
    - Enable RLS on all tables
    - Add policies for authenticated and public access
    - Fix duplicate policy issues
    
  2. Security
    - Authenticated users get full access to all tables
    - Public users can:
      - Submit new entries
      - View only approved items
      - Cannot modify or delete data
*/

-- Company Submissions
ALTER TABLE company_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_company_submissions_policy" 
ON company_submissions 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "public_insert_company_submissions_policy" 
ON company_submissions 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "public_select_company_submissions_policy" 
ON company_submissions 
FOR SELECT 
TO public 
USING (status = 'approved');

-- Consortium Submissions
ALTER TABLE consortium_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_consortium_submissions_policy" 
ON consortium_submissions 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "public_insert_consortium_submissions_policy" 
ON consortium_submissions 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "public_select_consortium_submissions_policy" 
ON consortium_submissions 
FOR SELECT 
TO public 
USING (status = 'approved');

-- Innovation Submissions
ALTER TABLE innovation_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_innovation_submissions_policy" 
ON innovation_submissions 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "public_insert_innovation_submissions_policy" 
ON innovation_submissions 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "public_select_innovation_submissions_policy" 
ON innovation_submissions 
FOR SELECT 
TO public 
USING (status = 'approved');

-- Event Submissions
ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_event_submissions_policy" 
ON event_submissions 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "public_insert_event_submissions_policy" 
ON event_submissions 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "public_select_event_submissions_policy" 
ON event_submissions 
FOR SELECT 
TO public 
USING (status = 'approved');

-- Newsletter Subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_newsletter_subscribers_policy" 
ON newsletter_subscribers 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "public_insert_newsletter_subscribers_policy" 
ON newsletter_subscribers 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Events Table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_events_policy" 
ON events 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "public_select_events_policy" 
ON events 
FOR SELECT 
TO public 
USING (true);

-- Advisor Applications
ALTER TABLE advisor_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_advisor_applications_policy" 
ON advisor_applications 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "public_insert_advisor_applications_policy" 
ON advisor_applications 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "public_select_advisor_applications_policy" 
ON advisor_applications 
FOR SELECT 
TO public 
USING (status = 'approved');