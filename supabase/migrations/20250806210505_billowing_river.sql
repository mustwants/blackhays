/*
  # Fix consortium submissions schema

  1. Schema Updates
    - Add missing address fields
    - Ensure all required contact fields exist

  2. Data Integrity
    - Add proper constraints for required fields
*/

-- Add missing fields to consortium_submissions
DO $$
BEGIN
  -- Add street_address if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consortium_submissions' AND column_name = 'street_address'
  ) THEN
    ALTER TABLE consortium_submissions ADD COLUMN street_address text;
  END IF;

  -- Add city if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consortium_submissions' AND column_name = 'city'
  ) THEN
    ALTER TABLE consortium_submissions ADD COLUMN city text;
  END IF;

  -- Add state if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consortium_submissions' AND column_name = 'state'
  ) THEN
    ALTER TABLE consortium_submissions ADD COLUMN state text;
  END IF;

  -- Add zip_code if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consortium_submissions' AND column_name = 'zip_code'
  ) THEN
    ALTER TABLE consortium_submissions ADD COLUMN zip_code text;
  END IF;

  -- Add first_name if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consortium_submissions' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE consortium_submissions ADD COLUMN first_name text;
  END IF;

  -- Add last_name if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consortium_submissions' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE consortium_submissions ADD COLUMN last_name text;
  END IF;
END $$;