/*
  # Fix Advisor Applications Policies and Data
  
  1. Changes
    - Update RLS policies for advisor_applications
    - Add test advisor data without unique constraint
    - Ensure proper status and location data
    
  2. Security
    - Maintain existing security model
    - Fix policy definitions
*/

-- First ensure RLS is enabled
ALTER TABLE advisor_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "admin_full_access_policy" ON advisor_applications;
DROP POLICY IF EXISTS "public_insert_policy" ON advisor_applications;
DROP POLICY IF EXISTS "public_view_approved_policy" ON advisor_applications;

-- Create new policies
CREATE POLICY "admin_full_access_policy" ON advisor_applications
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "public_insert_policy" ON advisor_applications
  FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "public_view_approved_policy" ON advisor_applications
  FOR SELECT TO public
  USING (status = 'approved');

-- Add test advisor data without ON CONFLICT clause
INSERT INTO advisor_applications (
  name,
  email,
  phone,
  professional_title,
  military_branch,
  years_of_service,
  about,
  address,
  zip_code,
  status,
  location,
  created_at,
  updated_at
)
SELECT
  'Col. John Smith (Ret.)',
  'john.smith@example.com',
  '555-123-4567',
  'Defense Consultant',
  'Army',
  '25',
  'Former Special Operations Command with extensive experience in defense acquisition',
  'Arlington, VA',
  '22201',
  'approved',
  point(-77.0864, 38.8904),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM advisor_applications 
  WHERE email = 'john.smith@example.com'
);

INSERT INTO advisor_applications (
  name,
  email,
  phone,
  professional_title,
  military_branch,
  years_of_service,
  about,
  address,
  zip_code,
  status,
  location,
  created_at,
  updated_at
)
SELECT
  'Dr. Jane Adams',
  'jane.adams@example.com',
  '555-987-6543',
  'Intelligence Specialist',
  'Air Force',
  '18',
  'Intelligence specialist with expertise in cybersecurity and emerging technologies',
  'San Francisco, CA',
  '94107',
  'approved',
  point(-122.4194, 37.7749),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM advisor_applications 
  WHERE email = 'jane.adams@example.com'
);

INSERT INTO advisor_applications (
  name,
  email,
  phone,
  professional_title,
  military_branch,
  years_of_service,
  about,
  address,
  zip_code,
  status,
  location,
  created_at,
  updated_at
)
SELECT
  'Maj. Sarah Johnson',
  'sarah.johnson@example.com',
  '555-456-7890',
  'Technology Integration Expert',
  'Space Force',
  '12',
  'Specializing in space technology and satellite systems integration',
  'Colorado Springs, CO',
  '80911',
  'approved',
  point(-104.8214, 38.8339),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM advisor_applications 
  WHERE email = 'sarah.johnson@example.com'
);

-- Update any existing records without location
UPDATE advisor_applications
SET location = point(
  -- Random offset around US center (-95.7129, 37.0902)
  -95.7129 + (random() - 0.5) * 20,
  37.0902 + (random() - 0.5) * 10
)
WHERE location IS NULL;