-- Add logo_url column to innovation_submissions table
ALTER TABLE innovation_submissions
ADD COLUMN IF NOT EXISTS logo_url TEXT;

COMMENT ON COLUMN innovation_submissions.logo_url IS 'Public URL of the organization logo';
