/*
  # Fix RLS Policies and Add Test Data
  
  1. Changes
    - Fix RLS policies for all tables
    - Add test data for advisors and newsletter subscribers
    - Ensure proper access control
*/

-- Enable RLS on all tables
ALTER TABLE advisor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "admin_full_access_policy" ON advisor_applications;
DROP POLICY IF EXISTS "public_insert_policy" ON advisor_applications;
DROP POLICY IF EXISTS "public_view_approved_policy" ON advisor_applications;

DROP POLICY IF EXISTS "admin_full_access_policy" ON newsletter_subscribers;
DROP POLICY IF EXISTS "public_insert_policy" ON newsletter_subscribers;

-- Create policies for advisor_applications
CREATE POLICY "admin_full_access_policy" ON advisor_applications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "public_insert_policy" ON advisor_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "public_view_approved_policy" ON advisor_applications
  FOR SELECT
  TO public
  USING (status = 'approved');

-- Create policies for newsletter_subscribers
CREATE POLICY "admin_full_access_policy" ON newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "public_insert_policy" ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Add test advisor data
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

-- Add test newsletter subscribers
INSERT INTO newsletter_subscribers (
  first_name,
  last_name,
  email,
  notify_ceo,
  created_at,
  updated_at
)
VALUES
  (
    'Michael',
    'Anderson',
    'michael.anderson@example.com',
    true,
    NOW(),
    NOW()
  ),
  (
    'Emily',
    'Roberts',
    'emily.roberts@example.com',
    true,
    NOW(),
    NOW()
  ),
  (
    'David',
    'Thompson',
    'david.thompson@example.com',
    true,
    NOW(),
    NOW()
  ),
  (
    'Jennifer',
    'Martinez',
    'jennifer.martinez@example.com',
    true,
    NOW(),
    NOW()
  ),
  (
    'William',
    'Parker',
    'william.parker@example.com',
    true,
    NOW(),
    NOW()
  )
ON CONFLICT (email) DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO anon;