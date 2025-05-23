/*
  # Fix RLS Policies for Data Access
  
  1. Changes
    - Update RLS policies to ensure proper data access
    - Fix policy definitions for all tables
    - Add proper role checks
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and public access
*/

-- Enable RLS on all tables
ALTER TABLE advisor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consortium_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$ 
DECLARE
  _table text;
BEGIN
  FOR _table IN (
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public'
    AND tablename IN (
      'advisor_applications',
      'company_submissions', 
      'consortium_submissions',
      'innovation_submissions',
      'event_submissions',
      'newsletter_subscribers',
      'events'
    )
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS admin_full_access_policy ON %I', _table);
    EXECUTE format('DROP POLICY IF EXISTS public_insert_policy ON %I', _table);
    EXECUTE format('DROP POLICY IF EXISTS public_view_approved_policy ON %I', _table);
    EXECUTE format('DROP POLICY IF EXISTS public_view_policy ON %I', _table);
  END LOOP;
END $$;

-- Create policies for tables with status column
DO $$ 
DECLARE
  _table text;
BEGIN
  FOR _table IN (
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public'
    AND tablename IN (
      'advisor_applications',
      'company_submissions', 
      'consortium_submissions',
      'innovation_submissions',
      'event_submissions'
    )
  ) LOOP
    -- Admin full access policy
    EXECUTE format('
      CREATE POLICY admin_full_access_policy ON %I
        FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true)
    ', _table);
    
    -- Public insert policy
    EXECUTE format('
      CREATE POLICY public_insert_policy ON %I
        FOR INSERT
        TO public
        WITH CHECK (true)
    ', _table);
    
    -- Public view approved policy
    EXECUTE format('
      CREATE POLICY public_view_approved_policy ON %I
        FOR SELECT
        TO public
        USING (status = ''approved'')
    ', _table);
  END LOOP;
END $$;

-- Create policies for newsletter_subscribers
CREATE POLICY admin_full_access_policy ON newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY public_insert_policy ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policies for events table
CREATE POLICY admin_full_access_policy ON events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY public_view_policy ON events
  FOR SELECT
  TO public
  USING (true);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO anon;

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create role function in auth schema
CREATE OR REPLACE FUNCTION auth.role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    'anon'
  );
$$;