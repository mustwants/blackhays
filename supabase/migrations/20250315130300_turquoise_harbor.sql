/*
  # Add Innovation Test Data
  
  1. Changes
    - Add test data for innovation_submissions table
    - Add approved innovation organizations
    
  2. Security
    - No security changes
*/

-- Add test innovation submissions
INSERT INTO innovation_submissions (
  name,
  website,
  type,
  focus_areas,
  established_year,
  funding_source,
  description,
  contact_name,
  contact_email,
  contact_phone,
  primary_sponsor,
  headquarters,
  status,
  created_at,
  updated_at
)
VALUES
  (
    'Quantum Computing Lab',
    'https://example.com/quantum',
    'Research Laboratory',
    'Quantum Computing, AI',
    '2020',
    'Government',
    'Advanced research in quantum computing applications for defense',
    'Dr. Carol Brown',
    'carol.brown@example.com',
    '555-123-4567',
    'DARPA',
    'Arlington, VA',
    'approved',
    NOW(),
    NOW()
  ),
  (
    'Defense AI Innovation Center',
    'https://example.com/defense-ai',
    'Innovation Center',
    'Artificial Intelligence, Machine Learning',
    '2021',
    'Private Industry',
    'Developing AI solutions for defense applications',
    'Dr. James Wilson',
    'james.wilson@example.com',
    '555-234-5678',
    'Air Force Research Laboratory',
    'Cambridge, MA',
    'approved',
    NOW(),
    NOW()
  ),
  (
    'Advanced Materials Research Lab',
    'https://example.com/materials',
    'Government Lab',
    'Advanced Materials, Nanotechnology',
    '2019',
    'Government',
    'Research in advanced materials for defense applications',
    'Dr. Sarah Chen',
    'sarah.chen@example.com',
    '555-345-6789',
    'Office of Naval Research',
    'San Diego, CA',
    'approved',
    NOW(),
    NOW()
  ),
  (
    'Hypersonics Technology Center',
    'https://example.com/hypersonics',
    'Research Laboratory',
    'Hypersonics, Propulsion',
    '2022',
    'Mixed Funding',
    'Development of hypersonic technologies for defense',
    'Dr. Michael Roberts',
    'michael.roberts@example.com',
    '555-456-7890',
    'DARPA',
    'Huntsville, AL',
    'approved',
    NOW(),
    NOW()
  ),
  (
    'Space Systems Innovation Lab',
    'https://example.com/space-systems',
    'Innovation Center',
    'Space Technology, Satellites',
    '2021',
    'Government',
    'Innovation in space systems and satellite technology',
    'Dr. Lisa Anderson',
    'lisa.anderson@example.com',
    '555-567-8901',
    'Space Force',
    'Colorado Springs, CO',
    'approved',
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;