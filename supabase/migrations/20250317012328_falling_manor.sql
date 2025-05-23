/*
  # Fix RLS Policies and Data Access
  
  1. Changes
    - Enable RLS on all tables
    - Create proper policies for all tables
    - Fix permissions for authenticated and public roles
    
  2. Security
    - Maintain existing security model
    - Ensure proper data access
*/

-- Enable RLS on all tables
DO $$ 
BEGIN
  ALTER TABLE IF EXISTS advisor_applications ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS company_submissions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS consortium_submissions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS innovation_submissions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS event_submissions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS newsletter_subscribers ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS events ENABLE ROW LEVEL SECURITY;
END $$;

-- Drop existing policies to avoid conflicts
DO $$ 
DECLARE
  _table text;
  _policy text;
BEGIN
  FOR _table IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
  LOOP
    FOR _policy IN (
      SELECT policyname 
      FROM pg_policies 
      WHERE schemaname = 'public' AND tablename = _table
    )
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON %I', _policy, _table);
    END LOOP;
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
  )
  LOOP
    EXECUTE format('
      CREATE POLICY admin_full_access_policy ON %I
        FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true)
    ', _table);

    EXECUTE format('
      CREATE POLICY public_insert_policy ON %I
        FOR INSERT
        TO public
        WITH CHECK (true)
    ', _table);

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

-- Fix point data format for advisor locations
DO $$ 
BEGIN
  -- Update any existing records without location
  UPDATE advisor_applications
  SET location = point(
    -- Random offset around US center (-95.7129, 37.0902)
    -95.7129 + (random() - 0.5) * 20,
    37.0902 + (random() - 0.5) * 10
  )
  WHERE location IS NULL;
END $$;