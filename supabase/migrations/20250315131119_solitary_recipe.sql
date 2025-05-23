/*
  # Fix RLS Policies for All Tables
  
  1. Changes
    - Drop and recreate all RLS policies with correct role checks
    - Ensure authenticated users have full access
    - Allow public to view approved items
    - Allow public submissions
    
  2. Security
    - Enable RLS on all tables
    - Fix policy definitions
*/

-- Enable RLS on all tables
ALTER TABLE advisor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consortium_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$ 
DECLARE
  table_name text;
BEGIN
  FOR table_name IN (
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
    EXECUTE format('DROP POLICY IF EXISTS admin_full_access_policy ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS public_insert_policy ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS public_view_approved_policy ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS public_view_policy ON %I', table_name);
  END LOOP;
END $$;

-- Create new policies for tables with status column
DO $$ 
DECLARE
  table_name text;
BEGIN
  FOR table_name IN (
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
    EXECUTE format(
      'CREATE POLICY admin_full_access_policy ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      table_name
    );
    
    -- Public insert policy
    EXECUTE format(
      'CREATE POLICY public_insert_policy ON %I FOR INSERT TO public WITH CHECK (true)',
      table_name
    );
    
    -- Public view approved policy
    EXECUTE format(
      'CREATE POLICY public_view_approved_policy ON %I FOR SELECT TO public USING (status = ''approved'')',
      table_name
    );
  END LOOP;
END $$;

-- Create policies for newsletter_subscribers
CREATE POLICY admin_full_access_policy ON newsletter_subscribers
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY public_insert_policy ON newsletter_subscribers
  FOR INSERT TO public
  WITH CHECK (true);

-- Create policies for events table
CREATE POLICY admin_full_access_policy ON events
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY public_view_policy ON events
  FOR SELECT TO public
  USING (true);