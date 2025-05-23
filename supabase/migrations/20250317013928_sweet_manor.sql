/*
  # Fix RLS Policies and Data Handling
  
  1. Changes
    - Update RLS policies for all tables
    - Fix point data handling
    - Ensure consistent access patterns
    
  2. Security
    - Maintain existing security model
*/

-- Create or replace point data conversion function
CREATE OR REPLACE FUNCTION format_point_data()
RETURNS TRIGGER AS $$
BEGIN
  -- If location is provided as text, convert it to point
  IF NEW.location IS NOT NULL THEN
    IF NEW.location::text LIKE 'POINT%' THEN
      -- Extract coordinates from POINT text format
      NEW.location := point(
        (regexp_matches(NEW.location::text, 'POINT\(([-\d.]+)\s+([-\d.]+)\)'))[1]::float8,
        (regexp_matches(NEW.location::text, 'POINT\(([-\d.]+)\s+([-\d.]+)\)'))[2]::float8
      );
    END IF;
    
    -- Validate coordinates are within valid ranges
    IF NEW.location[0] < -180 OR NEW.location[0] > 180 OR 
       NEW.location[1] < -90 OR NEW.location[1] > 90 THEN
      -- Default to US center with random offset
      NEW.location := point(
        -95.7129 + (random() - 0.5) * 20,
        37.0902 + (random() - 0.5) * 10
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace trigger for point data conversion
DROP TRIGGER IF EXISTS convert_point_data ON advisor_applications;
CREATE TRIGGER convert_point_data
  BEFORE INSERT OR UPDATE ON advisor_applications
  FOR EACH ROW
  EXECUTE FUNCTION format_point_data();

-- Handle email uniqueness for newsletter subscribers
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