/*
  # Fix Point Data Format
  
  1. Changes
    - Update point data format for advisor_applications
    - Fix location column type
    - Update existing data
    
  2. Security
    - No security changes
*/

-- First ensure the point type is properly defined
DO $$ 
BEGIN
  -- Drop the location column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'advisor_applications' 
    AND column_name = 'location'
  ) THEN
    ALTER TABLE advisor_applications DROP COLUMN location;
  END IF;

  -- Add the location column with proper point type
  ALTER TABLE advisor_applications ADD COLUMN location point;
END $$;

-- Update existing advisor data with proper point format
UPDATE advisor_applications 
SET location = point(-77.0864, 38.8904)
WHERE email = 'john.smith@example.com';

-- Create function to handle point data conversion
CREATE OR REPLACE FUNCTION format_point_data()
RETURNS TRIGGER AS $$
BEGIN
  -- If location is provided as text, convert it to point
  IF NEW.location IS NOT NULL AND NEW.location::text LIKE 'POINT%' THEN
    -- Extract coordinates from POINT text format
    NEW.location := point(
      (regexp_matches(NEW.location::text, 'POINT\(([-\d.]+)\s+([-\d.]+)\)'))[1]::float8,
      (regexp_matches(NEW.location::text, 'POINT\(([-\d.]+)\s+([-\d.]+)\)'))[2]::float8
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to handle point data conversion
DROP TRIGGER IF EXISTS convert_point_data ON advisor_applications;
CREATE TRIGGER convert_point_data
  BEFORE INSERT OR UPDATE ON advisor_applications
  FOR EACH ROW
  EXECUTE FUNCTION format_point_data();