-- /home/project/supabase/migrations/20250309012345_add_location_indexes.sql
/*
  # Add Location Indexes and Functions
  
  1. Changes
    - Add GiST index for location column
    - Add indexes for address and zip_code
    - Add location update trigger function
    
  2. Security
    - No security changes
*/

-- Create location update function if it doesn't exist
CREATE OR REPLACE FUNCTION update_advisor_location()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update location if address or zip_code changed and location is null
  IF (
    (NEW.address IS DISTINCT FROM OLD.address OR NEW.zip_code IS DISTINCT FROM OLD.zip_code)
    AND (NEW.location IS NULL)
  ) THEN
    -- Simple point generation based on address
    -- In production, this would call a geocoding service
    NEW.location := point(
      -- Random offset around US center (-95.7129, 37.0902)
      -95.7129 + (random() - 0.5) * 20,
      37.0902 + (random() - 0.5) * 10
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add GiST index for location column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'advisor_applications' 
    AND indexname = 'advisor_applications_location_idx'
  ) THEN
    CREATE INDEX advisor_applications_location_idx ON advisor_applications USING gist(location);
  END IF;
END $$;

-- Add btree indexes for address and zip_code if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'advisor_applications' 
    AND indexname = 'advisor_applications_address_idx'
  ) THEN
    CREATE INDEX advisor_applications_address_idx ON advisor_applications(address);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'advisor_applications' 
    AND indexname = 'advisor_applications_zip_code_idx'
  ) THEN
    CREATE INDEX advisor_applications_zip_code_idx ON advisor_applications(zip_code);
  END IF;
END $$;

-- Create or replace the location update trigger
DROP TRIGGER IF EXISTS advisor_location_update ON advisor_applications;
CREATE TRIGGER advisor_location_update
  BEFORE INSERT OR UPDATE ON advisor_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_advisor_location();
