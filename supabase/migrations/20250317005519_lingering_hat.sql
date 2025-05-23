/*
  # Fix Advisor Applications RLS
  
  1. Changes
    - Update RLS policies for advisor_applications
    - Ensure proper access control
    
  2. Security
    - Enable RLS
    - Add policies for admin and public access
*/

-- Enable RLS
ALTER TABLE advisor_applications ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "admin_full_access_policy" ON advisor_applications;
DROP POLICY IF EXISTS "public_insert_policy" ON advisor_applications;
DROP POLICY IF EXISTS "public_view_approved_policy" ON advisor_applications;

-- Create policy for admin full access
CREATE POLICY "admin_full_access_policy" ON advisor_applications
  FOR ALL
  TO authenticated
  USING ((SELECT auth.role() = 'authenticated'))
  WITH CHECK ((SELECT auth.role() = 'authenticated'));

-- Create policy for public submission
CREATE POLICY "public_insert_policy" ON advisor_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for viewing approved advisors
CREATE POLICY "public_view_approved_policy" ON advisor_applications
  FOR SELECT
  TO public
  USING (status = 'approved');