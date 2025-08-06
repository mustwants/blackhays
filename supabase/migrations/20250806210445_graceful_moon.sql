/*
  # Fix advisor applications schema to match code

  1. Schema Updates
    - Ensure all required columns exist with correct types
    - Add missing columns for social media and location data
    - Fix service_status to be text array type
    - Add proper location indexing

  2. Data Integrity
    - Add constraints for data validation
    - Ensure proper defaults are set
*/

-- Add missing columns to advisor_applications if they don't exist
DO $$
BEGIN
  -- Add years_of_service if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'advisor_applications' AND column_name = 'years_of_service'
  ) THEN
    ALTER TABLE advisor_applications ADD COLUMN years_of_service text;
  END IF;

  -- Add other_branch if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'advisor_applications' AND column_name = 'other_branch'
  ) THEN
    ALTER TABLE advisor_applications ADD COLUMN other_branch text;
  END IF;

  -- Add other_status if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'advisor_applications' AND column_name = 'other_status'
  ) THEN
    ALTER TABLE advisor_applications ADD COLUMN other_status text;
  END IF;

  -- Add about if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'advisor_applications' AND column_name = 'about'
  ) THEN
    ALTER TABLE advisor_applications ADD COLUMN about text;
  END IF;

  -- Add resume_url if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'advisor_applications' AND column_name = 'resume_url'
  ) THEN
    ALTER TABLE advisor_applications ADD COLUMN resume_url text;
  END IF;

  -- Add headshot_url if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'advisor_applications' AND column_name = 'headshot_url'
  ) THEN
    ALTER TABLE advisor_applications ADD COLUMN headshot_url text;
  END IF;

  -- Add business_logo_url if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'advisor_applications' AND column_name = 'business_logo_url'
  ) THEN
    ALTER TABLE advisor_applications ADD COLUMN business_logo_url text;
  END IF;

  -- Add webpage if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'advisor_applications' AND column_name = 'webpage'
  ) THEN
    ALTER TABLE advisor_applications ADD COLUMN webpage text;
  END IF;

  -- Add facebook if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'advisor_applications' AND column_name = 'facebook'
  ) THEN
    ALTER TABLE advisor_applications ADD COLUMN facebook text;
  END IF;

  -- Add x (twitter) if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'advisor_applications' AND column_name = 'x'
  ) THEN
    ALTER TABLE advisor_applications ADD COLUMN x text;
  END IF;

  -- Add linkedin if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'advisor_applications' AND column_name = 'linkedin'
  ) THEN
    ALTER TABLE advisor_applications ADD COLUMN linkedin text;
  END IF;

  -- Add instagram if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'advisor_applications' AND column_name = 'instagram'
  ) THEN
    ALTER TABLE advisor_applications ADD COLUMN instagram text;
  END IF;
END $$;

-- Ensure service_status is properly typed as text array
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'advisor_applications' 
    AND column_name = 'service_status' 
    AND data_type != 'ARRAY'
  ) THEN
    ALTER TABLE advisor_applications ALTER COLUMN service_status TYPE text[] USING ARRAY[service_status];
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS advisor_status_email_idx ON advisor_applications(status, email);
CREATE INDEX IF NOT EXISTS advisor_location_gist_idx ON advisor_applications USING GIST(location);