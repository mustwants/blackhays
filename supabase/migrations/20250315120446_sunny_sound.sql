/*
  # Add Initial Test Data
  
  1. Changes
    - Add test data for events table
    - Add test data for event_submissions table
    - Add test data for advisor_applications table
    
  2. Security
    - No security changes
*/

-- Add test events
INSERT INTO events (name, start_date, end_date, location, website, about)
VALUES
  ('Defense Innovation Summit 2025', '2025-06-15', '2025-06-17', 'Washington, DC', 'https://example.com/dis2025', 'Annual gathering of defense technology leaders and innovators'),
  ('Cyber Defense Expo', '2025-08-22', '2025-08-24', 'San Diego, CA', 'https://example.com/cde2025', 'Leading cybersecurity and defense technology exhibition'),
  ('Space Force Technology Forum', '2025-07-10', '2025-07-12', 'Colorado Springs, CO', 'https://example.com/sftf2025', 'Exploring emerging space technologies and capabilities')
ON CONFLICT DO NOTHING;

-- Add test event submissions
INSERT INTO event_submissions (name, start_date, end_date, location, website, about, submitter_email, status)
VALUES
  ('Naval Systems Conference', '2025-09-15', '2025-09-17', 'Norfolk, VA', 'https://example.com/nsc2025', 'Latest developments in naval technology and systems', 'organizer@example.com', 'approved'),
  ('AI in Defense Symposium', '2025-10-20', '2025-10-22', 'Arlington, VA', 'https://example.com/aids2025', 'Artificial intelligence applications in defense', 'ai.organizer@example.com', 'pending'),
  ('Defense Robotics Workshop', '2025-11-05', '2025-11-07', 'Boston, MA', 'https://example.com/drw2025', 'Hands-on workshop for defense robotics', 'robotics@example.com', 'pending')
ON CONFLICT DO NOTHING;

-- Add test advisor applications
INSERT INTO advisor_applications (
  name, email, phone, professional_title, military_branch, 
  years_of_service, about, address, zip_code, status, location
)
VALUES
  (
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
    point(-77.0864, 38.8904)
  ),
  (
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
    point(-122.4194, 37.7749)
  ),
  (
    'Maj. Sarah Johnson',
    'sarah.johnson@example.com',
    '555-456-7890',
    'Technology Integration Expert',
    'Space Force',
    '12',
    'Specializing in space technology and satellite systems integration',
    'Colorado Springs, CO',
    '80911',
    'pending',
    point(-104.8214, 38.8339)
  )
ON CONFLICT DO NOTHING;