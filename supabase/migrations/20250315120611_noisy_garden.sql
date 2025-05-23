/*
  # Add Newsletter Test Data
  
  1. Changes
    - Add test data for newsletter_subscribers table
    - Add sample subscribers with varied profiles
    
  2. Security
    - No security changes
*/

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