/*
  # Fix Event Submissions RLS Policies
  
  1. Changes
     - Update RLS policies for event submissions table
     - Enable public submissions without authentication
     - Fix policy definitions and naming
     
  2. Security
     - Enable RLS on event_submissions table
     - Add policies for public submission and viewing
     - Add admin access policy
*/

-- First ensure RLS is enabled
ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can submit events" ON event_submissions;
DROP POLICY IF EXISTS "Public can view approved events" ON event_submissions;
DROP POLICY IF EXISTS "Admins have full access to event submissions" ON event_submissions;
DROP POLICY IF EXISTS "enable_insert_for_all" ON event_submissions;
DROP POLICY IF EXISTS "enable_select_for_approved" ON event_submissions;
DROP POLICY IF EXISTS "enable_all_for_authenticated" ON event_submissions;

-- Create new policies with unique names

-- Allow public to submit events without authentication
CREATE POLICY "event_submissions_insert_policy"
ON event_submissions
FOR INSERT
TO public
WITH CHECK (true);

-- Allow public to view approved events
CREATE POLICY "event_submissions_select_policy"
ON event_submissions
FOR SELECT
TO public
USING (status = 'approved');

-- Allow authenticated users (admins) full access
CREATE POLICY "event_submissions_admin_policy"
ON event_submissions
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);