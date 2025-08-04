-- Add logo_url column to event tables
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS logo_url TEXT;
