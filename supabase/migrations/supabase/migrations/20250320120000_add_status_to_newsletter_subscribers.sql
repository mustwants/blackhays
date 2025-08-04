-- Add status column to newsletter_subscribers table
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS status TEXT;

-- Ensure default value
ALTER TABLE newsletter_subscribers
  ALTER COLUMN status SET DEFAULT 'pending';

-- Populate existing rows
UPDATE newsletter_subscribers
  SET status = 'approved'
  WHERE status IS NULL;

-- Restrict status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'newsletter_subscribers_status_check'
  ) THEN
    ALTER TABLE newsletter_subscribers
      ADD CONSTRAINT newsletter_subscribers_status_check
      CHECK (status IN ('pending','approved','paused','denied'));
  END IF;
END $$;
