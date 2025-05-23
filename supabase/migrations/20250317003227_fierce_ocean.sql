/*
  # Fix Newsletter Subscribers RLS Policies
  
  1. Changes
    - Enable RLS on newsletter_subscribers table
    - Drop existing policies to avoid conflicts
    - Create optimized policies for:
      - Public subscription
      - Admin management
    
  2. Security
    - Public can only insert new subscriptions
    - Admins have full access to manage subscribers
    - No public read access to subscriber data
*/

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "admin_full_access_policy" ON newsletter_subscribers;
DROP POLICY IF EXISTS "public_insert_policy" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can manage subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public to subscribe" ON newsletter_subscribers;
DROP POLICY IF EXISTS "authenticated_newsletter_subscribers_policy" ON newsletter_subscribers;
DROP POLICY IF EXISTS "public_insert_newsletter_subscribers_policy" ON newsletter_subscribers;

-- Create policy for admin full access
CREATE POLICY "admin_full_access_policy" ON newsletter_subscribers
  FOR ALL
  TO authenticated
  USING ((SELECT auth.role() = 'authenticated'))
  WITH CHECK ((SELECT auth.role() = 'authenticated'));

-- Create policy for public subscription
CREATE POLICY "public_insert_policy" ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Add unique constraint on email if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'newsletter_subscribers_email_key'
  ) THEN
    ALTER TABLE newsletter_subscribers 
    ADD CONSTRAINT newsletter_subscribers_email_key 
    UNIQUE (email);
  END IF;
END $$;