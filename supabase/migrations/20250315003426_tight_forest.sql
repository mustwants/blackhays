/*
  # Optimize Database Indexes
  
  1. Changes
    - Remove unused indexes
    - Create optimized indexes for common queries
    - Fix immutability issues with index predicates
    
  2. Performance
    - Focus on most frequently accessed columns
    - Add composite indexes for common query patterns
*/

-- Drop unused indexes
DROP INDEX IF EXISTS public.company_submissions_created_at_idx;
DROP INDEX IF EXISTS public.newsletter_subscribers_created_at_idx;
DROP INDEX IF EXISTS public.advisor_applications_created_at_idx;
DROP INDEX IF EXISTS public.advisor_applications_location_idx;
DROP INDEX IF EXISTS public.event_submissions_created_at_idx;
DROP INDEX IF EXISTS public.newsletter_subscribers_email_idx;
DROP INDEX IF EXISTS public.advisor_applications_address_idx;
DROP INDEX IF EXISTS public.advisor_applications_zip_code_idx;

-- Create more focused indexes for common queries
CREATE INDEX IF NOT EXISTS events_date_status_idx ON public.events (start_date, end_date);

CREATE INDEX IF NOT EXISTS submissions_status_created_idx ON public.event_submissions (status, created_at DESC);

CREATE INDEX IF NOT EXISTS advisor_status_location_idx ON public.advisor_applications 
  USING GIST (location)
  WHERE status = 'approved';

-- Create composite indexes for common filtering patterns
CREATE INDEX IF NOT EXISTS company_status_created_idx ON public.company_submissions (status, created_at DESC);

CREATE INDEX IF NOT EXISTS consortium_status_created_idx ON public.consortium_submissions (status, created_at DESC);

CREATE INDEX IF NOT EXISTS innovation_status_created_idx ON public.innovation_submissions (status, created_at DESC);

-- Create index for email uniqueness checks
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_email_unique_idx ON public.newsletter_subscribers (email);