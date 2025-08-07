/*
  # Add missing state column to advisor_applications table

  1. Schema Changes
    - Add `state` column to `advisor_applications` table (text, nullable)
    
  2. Purpose
    - Fix schema mismatch where application code expects a `state` column
    - Allows advisor applications to store state information for complete addresses
    
  3. Notes
    - Column is nullable to maintain compatibility with existing data
    - No data migration needed as this is adding a new optional field
*/

-- Add the missing state column to advisor_applications table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'advisor_applications' 
    AND column_name = 'state'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.advisor_applications ADD COLUMN state text;
  END IF;
END $$;