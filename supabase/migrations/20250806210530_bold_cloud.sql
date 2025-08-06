/*
  # Add performance indexes

  1. Indexes
    - Add indexes for common query patterns
    - Improve performance for admin dashboard
    - Optimize map queries

  2. Performance
    - Status-based queries
    - Date-based queries
    - Location-based queries
*/

-- Add performance indexes for all tables
CREATE INDEX IF NOT EXISTS advisor_email_idx ON advisor_applications(email);
CREATE INDEX IF NOT EXISTS advisor_status_created_idx ON advisor_applications(status, created_at DESC);
CREATE INDEX IF NOT EXISTS advisor_state_idx ON advisor_applications(state);

CREATE INDEX IF NOT EXISTS company_status_created_idx ON company_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS company_industry_idx ON company_submissions(industry);
CREATE INDEX IF NOT EXISTS company_email_idx ON company_submissions(contact_email);

CREATE INDEX IF NOT EXISTS consortium_status_created_idx ON consortium_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS consortium_focus_idx ON consortium_submissions(focus_area);
CREATE INDEX IF NOT EXISTS consortium_email_idx ON consortium_submissions(contact_email);

CREATE INDEX IF NOT EXISTS innovation_status_created_idx ON innovation_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS innovation_type_idx ON innovation_submissions(type);
CREATE INDEX IF NOT EXISTS innovation_email_idx ON innovation_submissions(contact_email);

CREATE INDEX IF NOT EXISTS event_submissions_status_date_idx ON event_submissions(status, start_date);
CREATE INDEX IF NOT EXISTS event_submissions_email_idx ON event_submissions(submitter_email);

CREATE INDEX IF NOT EXISTS newsletter_email_unique_idx ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS newsletter_status_idx ON newsletter_subscribers(status);