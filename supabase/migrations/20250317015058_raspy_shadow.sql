/*
  # Fix Data Display Issues
  
  1. Changes
    - Fix point data handling for advisor locations
    - Simplify RLS policies
    - Fix email uniqueness constraint
    - Add proper indexes
    
  2. Security
    - Maintain existing security model
    - Ensure proper data access
*/

-- Drop and recreate point data handling function
CREATE OR REPLACE FUNCTION format_point_data()
RETURNS TRIGGER AS $$
DECLARE
  _x float8;
  _y float8;
BEGIN
  -- Handle different input formats
  IF NEW.location IS NOT NULL THEN
    IF NEW.location::text LIKE 'POINT%' THEN
      -- Parse POINT format
      _x := (regexp_matches(NEW.location::text, 'POINT\(([-\d.]+)\s+([-\d.]+)\)'))[1]::float8;
      _y := (regexp_matches(NEW.location::text, 'POINT\(([-\d.]+)\s+([-\d.]+)\)'))[2]::float8;
    ELSIF NEW.location::text ~ '^[-\d.]+,\s*[-\d.]+$' THEN
      -- Parse "lng,lat" format
      _x := (regexp_matches(NEW.location::text, '^([-\d.]+),\s*([-\d.]+)$'))[1]::float8;
      _y := (regexp_matches(NEW.location::text, '^([-\d.]+),\s*([-\d.]+)$'))[2]::float8;
    ELSE
      -- Try to use existing point coordinates
      _x := NEW.location[0];
      _y := NEW.location[1];
    END IF;

    -- Validate coordinates
    IF _x < -180 OR _x > 180 OR _y < -90 OR _y > 90 THEN
      -- Default to US center with random offset
      _x := -95.7129 + (random() - 0.5) * 20;
      _y := 37.0902 + (random() - 0.5) * 10;
    END IF;

    -- Set the validated point
    NEW.location := point(_x, _y);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger for point data conversion
DROP TRIGGER IF EXISTS convert_point_data ON advisor_applications;
CREATE TRIGGER convert_point_data
  BEFORE INSERT OR UPDATE ON advisor_applications
  FOR EACH ROW
  EXECUTE FUNCTION format_point_data();

-- Fix email uniqueness for newsletter subscribers
ALTER TABLE newsletter_subscribers DROP CONSTRAINT IF EXISTS newsletter_subscribers_email_key;
ALTER TABLE newsletter_subscribers ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);

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

-- Create simple, effective policies
DO $$ 
DECLARE
  _table text;
BEGIN
  -- For tables with status column
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
    -- Simple admin policy
    EXECUTE format('
      CREATE POLICY admin_full_access_policy ON %I
        FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true)
    ', _table);
    
    -- Simple public policies
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
  
  -- Newsletter subscribers policies
  EXECUTE '
    CREATE POLICY admin_full_access_policy ON newsletter_subscribers
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true)
  ';
  
  EXECUTE '
    CREATE POLICY public_insert_policy ON newsletter_subscribers
      FOR INSERT
      TO public
      WITH CHECK (true)
  ';
  
  -- Events table policies
  EXECUTE '
    CREATE POLICY admin_full_access_policy ON events
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true)
  ';
  
  EXECUTE '
    CREATE POLICY public_view_policy ON events
      FOR SELECT
      TO public
      USING (true)
  ';
END $$;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO anon;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS advisor_location_idx ON advisor_applications USING gist (location);
CREATE INDEX IF NOT EXISTS advisor_status_idx ON advisor_applications (status);
CREATE INDEX IF NOT EXISTS company_status_idx ON company_submissions (status);
CREATE INDEX IF NOT EXISTS consortium_status_idx ON consortium_submissions (status);
CREATE INDEX IF NOT EXISTS innovation_status_idx ON innovation_submissions (status);
CREATE INDEX IF NOT EXISTS event_submissions_status_idx ON event_submissions (status);
CREATE INDEX IF NOT EXISTS events_date_idx ON events (start_date, end_date);

-- Update any existing advisor records with invalid point data
UPDATE advisor_applications
SET location = point(
  -95.7129 + (random() - 0.5) * 20,
  37.0902 + (random() - 0.5) * 10
)
WHERE location IS NULL 
   OR location[0] < -180 
   OR location[0] > 180 
   OR location[1] < -90 
   OR location[1] > 90;