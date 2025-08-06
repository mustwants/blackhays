/*
  # Add city column to advisor_applications table

  1. Schema Changes
    - Add `city` column to `advisor_applications` table
    - Column type: text (optional field)
    - Allows null values since it's an optional field in the form

  2. Notes
    - This resolves the insertion error where the application tries to insert city data
    - The column is optional to maintain compatibility with existing records
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'advisor_applications' AND column_name = 'city'
  ) THEN
    ALTER TABLE advisor_applications ADD COLUMN city text;
  END IF;
END $$;