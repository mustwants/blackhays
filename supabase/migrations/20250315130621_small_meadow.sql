/*
  # Add Location Column to Innovation Submissions
  
  1. Changes
    - Add location column to innovation_submissions table
    - Update existing test data with location coordinates
    
  2. Security
    - No security changes
*/

-- Add location column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'innovation_submissions' 
    AND column_name = 'location'
  ) THEN
    ALTER TABLE innovation_submissions ADD COLUMN location point;
  END IF;
END $$;

-- Update existing test data with location coordinates
UPDATE innovation_submissions 
SET location = point(-77.1067, 38.8799)
WHERE name = 'Quantum Computing Lab' AND location IS NULL;

UPDATE innovation_submissions 
SET location = point(-71.1056, 42.3751)
WHERE name = 'Defense AI Innovation Center' AND location IS NULL;

UPDATE innovation_submissions 
SET location = point(-117.1611, 32.7157)
WHERE name = 'Advanced Materials Research Lab' AND location IS NULL;

UPDATE innovation_submissions 
SET location = point(-86.5861, 34.7304)
WHERE name = 'Hypersonics Technology Center' AND location IS NULL;

UPDATE innovation_submissions 
SET location = point(-104.8214, 38.8339)
WHERE name = 'Space Systems Innovation Lab' AND location IS NULL;