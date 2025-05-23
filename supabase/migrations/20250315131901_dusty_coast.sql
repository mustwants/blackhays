/*
  # Fix Admin Access Policies
  
  1. Changes
    - Update RLS policies to ensure proper admin access
    - Fix policy definitions for all tables
    - Ensure authenticated users can access all data
    
  2. Security
    - Maintain security while fixing access issues
*/

-- Enable RLS on all tables
ALTER TABLE advisor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consortium_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$ 
DECLARE
  table_name text;
BEGIN
  FOR table_name IN (
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS admin_full_access_policy ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS public_insert_policy ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS public_view_approved_policy ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS public_view_policy ON %I', table_name);
  END LOOP;
END $$;

-- Create policies for all tables
DO $$ 
DECLARE
  table_name text;
BEGIN
  FOR table_name IN (
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public'
  ) LOOP
    -- Admin full access policy
    EXECUTE format(
      'CREATE POLICY admin_full_access_policy ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      table_name
    );
  END LOOP;
END $$;

-- Add public policies for submission tables
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

-- Add public view policy for events table
CREATE POLICY public_view_policy ON events
  FOR SELECT TO public
  USING (true);

-- Add public insert policy for newsletter subscribers
CREATE POLICY public_insert_policy ON newsletter_subscribers
  FOR INSERT TO public
  WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO anon;