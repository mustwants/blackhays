/*
  # Fix Indexes and Optimize Performance
  
  1. Changes
    - Drop unused indexes
    - Create optimized indexes for common queries
    - Fix email uniqueness constraint
    
  2. Security
    - Maintain data integrity with constraints
*/

-- Drop unused indexes while preserving constraints
DROP INDEX IF EXISTS newsletter_email_unique_idx;
ALTER TABLE newsletter_subscribers DROP CONSTRAINT IF EXISTS newsletter_subscribers_email_key;
ALTER TABLE newsletter_subscribers ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);

-- Drop unused indexes
DROP INDEX IF EXISTS events_date_status_idx;
DROP INDEX IF EXISTS submissions_status_created_idx;
DROP INDEX IF EXISTS advisor_status_location_idx;
DROP INDEX IF EXISTS company_status_created_idx;
DROP INDEX IF EXISTS consortium_status_created_idx;
DROP INDEX IF EXISTS innovation_status_created_idx;

-- Create optimized indexes for common queries
CREATE INDEX IF NOT EXISTS events_upcoming_idx 
  ON public.events (start_date, end_date);

CREATE INDEX IF NOT EXISTS submissions_pending_idx 
  ON public.event_submissions (created_at DESC)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS advisor_approved_location_idx 
  ON public.advisor_applications USING GIST (location)
  WHERE status = 'approved';

CREATE INDEX IF NOT EXISTS company_pending_idx 
  ON public.company_submissions (created_at DESC)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS consortium_pending_idx 
  ON public.consortium_submissions (created_at DESC)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS innovation_pending_idx 
  ON public.innovation_submissions (created_at DESC)
  WHERE status = 'pending';