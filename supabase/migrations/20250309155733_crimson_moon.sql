/*
  # Fix Event Submissions Policies
  
  1. Changes
     - Update RLS policies for event submissions
     - Enable public submissions without authentication
     - Fix policy definitions
     
  2. Security
     - Enable RLS on event_submissions table
     - Add policies for public submission and viewing
*/

-- First ensure RLS is enabled
ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can submit events" ON event_submissions;
DROP POLICY IF EXISTS "Public can view approved events" ON event_submissions;
DROP POLICY IF EXISTS "Admins have full access to event submissions" ON event_submissions;

-- Create new policies

-- Allow anyone to submit events without authentication
CREATE POLICY "Public can submit events"
ON event_submissions
FOR INSERT
TO public
WITH CHECK (true);

-- Allow public to view approved events
CREATE POLICY "Public can view approved events"
ON event_submissions
FOR SELECT
TO public
USING (status = 'approved');

-- Allow admins full access
CREATE POLICY "Admins have full access to event submissions"
ON event_submissions
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);