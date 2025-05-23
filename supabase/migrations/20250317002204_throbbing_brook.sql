/*
  # Add Newsletter Test Data
  
  1. Changes
    - Add test data for newsletter_subscribers table
    - Add varied subscriber profiles
    - Ensure proper timestamps and notifications
    
  2. Security
    - No security changes
*/

-- Clear existing test data first
TRUNCATE TABLE newsletter_subscribers CASCADE;

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
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '30 days'
  ),
  (
    'Emily',
    'Roberts',
    'emily.roberts@example.com',
    true,
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '25 days'
  ),
  (
    'David',
    'Thompson',
    'david.thompson@example.com',
    true,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days'
  ),
  (
    'Jennifer',
    'Martinez',
    'jennifer.martinez@example.com',
    true,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days'
  ),
  (
    'William',
    'Parker',
    'william.parker@example.com',
    true,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
  ),
  (
    'Sarah',
    'Johnson',
    'sarah.johnson@example.com',
    true,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
  ),
  (
    'James',
    'Wilson',
    'james.wilson@example.com',
    true,
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '4 days'
  ),
  (
    'Elizabeth',
    'Brown',
    'elizabeth.brown@example.com',
    true,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  ),
  (
    'Robert',
    'Taylor',
    'robert.taylor@example.com',
    true,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    'Patricia',
    'Davis',
    'patricia.davis@example.com',
    true,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  ),
  (
    'John',
    'Miller',
    'john.miller@example.com',
    true,
    NOW(),
    NOW()
  ),
  (
    'Lisa',
    'Garcia',
    'lisa.garcia@example.com',
    true,
    NOW(),
    NOW()
  ),
  (
    'Thomas',
    'Rodriguez',
    'thomas.rodriguez@example.com',
    true,
    NOW(),
    NOW()
  ),
  (
    'Margaret',
    'Lee',
    'margaret.lee@example.com',
    true,
    NOW(),
    NOW()
  ),
  (
    'Christopher',
    'Walker',
    'christopher.walker@example.com',
    true,
    NOW(),
    NOW()
  )
ON CONFLICT (email) DO NOTHING;