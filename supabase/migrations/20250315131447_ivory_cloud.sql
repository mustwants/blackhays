/*
  # Fix Test Data Consistency
  
  1. Changes
    - Clear existing test data
    - Add consistent test data across all tables
    - Ensure data matches mock generators
    
  2. Security
    - No security changes
*/

-- Clear existing test data first
TRUNCATE TABLE company_submissions, consortium_submissions, innovation_submissions, 
         event_submissions, advisor_applications, newsletter_subscribers CASCADE;

-- Add test company submissions
INSERT INTO company_submissions (
  name, website, industry, focus_areas, location, description,
  contact_name, contact_email, contact_phone, employee_count,
  founded_year, status, created_at, updated_at
)
VALUES
  (
    'Tech Defense Solutions',
    'https://example.com',
    'Cybersecurity',
    'AI, Machine Learning',
    'Arlington, VA',
    'Leading provider of cybersecurity solutions for defense applications',
    'Alice Johnson',
    'alice@example.com',
    '555-123-4567',
    '1-10',
    '2020',
    'approved',
    NOW(),
    NOW()
  ),
  (
    'Aerospace Dynamics',
    'https://example.com/aerospace',
    'Aerospace',
    'UAVs, Propulsion Systems',
    'San Diego, CA',
    'Innovative aerospace solutions for defense applications',
    'Bob Wilson',
    'bob@example.com',
    '555-234-5678',
    '11-50',
    '2019',
    'approved',
    NOW(),
    NOW()
  ),
  (
    'Quantum Defense Labs',
    'https://example.com/quantum',
    'Defense Technology',
    'Quantum Computing, Cryptography',
    'Boston, MA',
    'Quantum technology solutions for defense and security',
    'Carol Brown',
    'carol@example.com',
    '555-345-6789',
    '51-200',
    '2021',
    'pending',
    NOW(),
    NOW()
  );

-- Add test consortium submissions
INSERT INTO consortium_submissions (
  name, website, focus_area, government_partner, established_year,
  eligibility_criteria, description, contact_name, contact_email,
  contact_phone, membership_fee, headquarters, status, created_at, updated_at
)
VALUES
  (
    'Space Defense Consortium',
    'https://example.com',
    'Space Technology',
    'Space Force',
    '2021',
    'US-based companies in space tech',
    'Consortium focused on space defense technologies',
    'Bob Williams',
    'bob@example.com',
    '555-123-4567',
    '$5000/year',
    'Colorado Springs, CO',
    'approved',
    NOW(),
    NOW()
  ),
  (
    'Cyber Innovation Alliance',
    'https://example.com/cyber',
    'Cybersecurity',
    'NSA',
    '2020',
    'Cybersecurity companies',
    'Alliance for cybersecurity innovation',
    'Diana Clark',
    'diana@example.com',
    '555-234-5678',
    '$7500/year',
    'Fort Meade, MD',
    'approved',
    NOW(),
    NOW()
  ),
  (
    'AI Defense Network',
    'https://example.com/ai',
    'Artificial Intelligence',
    'DARPA',
    '2022',
    'AI/ML focused companies',
    'Network for AI in defense applications',
    'Eric Davis',
    'eric@example.com',
    '555-345-6789',
    '$10000/year',
    'Arlington, VA',
    'pending',
    NOW(),
    NOW()
  );

-- Add test innovation submissions
INSERT INTO innovation_submissions (
  name, website, type, focus_areas, established_year, funding_source,
  description, contact_name, contact_email, contact_phone, primary_sponsor,
  headquarters, status, created_at, updated_at, location
)
VALUES
  (
    'Quantum Computing Lab',
    'https://example.com/quantum',
    'Research Laboratory',
    'Quantum Computing',
    '2020',
    'Government',
    'Advanced quantum computing research for defense',
    'Carol Brown',
    'carol@example.com',
    '555-123-4567',
    'DARPA',
    'Arlington, VA',
    'approved',
    NOW(),
    NOW(),
    point(-77.1067, 38.8799)
  ),
  (
    'Defense AI Center',
    'https://example.com/ai',
    'Innovation Center',
    'Artificial Intelligence',
    '2021',
    'Mixed',
    'AI research and development for defense applications',
    'David Smith',
    'david@example.com',
    '555-234-5678',
    'Air Force',
    'Cambridge, MA',
    'approved',
    NOW(),
    NOW(),
    point(-71.1056, 42.3751)
  ),
  (
    'Advanced Materials Lab',
    'https://example.com/materials',
    'Research Laboratory',
    'Materials Science',
    '2019',
    'Private',
    'Advanced materials research for defense',
    'Emma White',
    'emma@example.com',
    '555-345-6789',
    'Navy',
    'San Diego, CA',
    'pending',
    NOW(),
    NOW(),
    point(-117.1611, 32.7157)
  );

-- Add test advisor applications
INSERT INTO advisor_applications (
  name, email, phone, professional_title, military_branch,
  years_of_service, about, address, zip_code, status, location,
  created_at, updated_at
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
    point(-77.0864, 38.8904),
    NOW(),
    NOW()
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
    point(-122.4194, 37.7749),
    NOW(),
    NOW()
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
    'approved',
    point(-104.8214, 38.8339),
    NOW(),
    NOW()
  );

-- Add test newsletter subscribers
INSERT INTO newsletter_subscribers (
  first_name, last_name, email, notify_ceo, created_at, updated_at
)
VALUES
  (
    'John',
    'Smith',
    'john.smith@example.com',
    true,
    NOW(),
    NOW()
  ),
  (
    'Jane',
    'Adams',
    'jane.adams@example.com',
    true,
    NOW(),
    NOW()
  ),
  (
    'Sarah',
    'Johnson',
    'sarah.johnson@example.com',
    true,
    NOW(),
    NOW()
  ),
  (
    'Bob',
    'Williams',
    'bob.williams@example.com',
    true,
    NOW(),
    NOW()
  ),
  (
    'Carol',
    'Brown',
    'carol.brown@example.com',
    true,
    NOW(),
    NOW()
  );

-- Add test events
INSERT INTO events (
  name, start_date, end_date, location, website, about,
  created_at, updated_at
)
VALUES
  (
    'Defense Innovation Summit 2025',
    '2025-06-15',
    '2025-06-17',
    'Washington, DC',
    'https://example.com/dis2025',
    'Annual gathering of defense technology leaders and innovators',
    NOW(),
    NOW()
  ),
  (
    'Cyber Defense Expo',
    '2025-08-22',
    '2025-08-24',
    'San Diego, CA',
    'https://example.com/cde2025',
    'Leading cybersecurity and defense technology exhibition',
    NOW(),
    NOW()
  ),
  (
    'Space Force Technology Forum',
    '2025-07-10',
    '2025-07-12',
    'Colorado Springs, CO',
    'https://example.com/sftf2025',
    'Exploring emerging space technologies and capabilities',
    NOW(),
    NOW()
  );

-- Add test event submissions
INSERT INTO event_submissions (
  name, start_date, end_date, location, website, about,
  submitter_email, status, created_at, updated_at
)
VALUES
  (
    'Naval Systems Conference',
    '2025-09-15',
    '2025-09-17',
    'Norfolk, VA',
    'https://example.com/nsc2025',
    'Latest developments in naval technology and systems',
    'organizer@example.com',
    'approved',
    NOW(),
    NOW()
  ),
  (
    'AI in Defense Symposium',
    '2025-10-20',
    '2025-10-22',
    'Arlington, VA',
    'https://example.com/aids2025',
    'Artificial intelligence applications in defense',
    'ai.organizer@example.com',
    'pending',
    NOW(),
    NOW()
  ),
  (
    'Defense Robotics Workshop',
    '2025-11-05',
    '2025-11-07',
    'Boston, MA',
    'https://example.com/drw2025',
    'Hands-on workshop for defense robotics',
    'robotics@example.com',
    'pending',
    NOW(),
    NOW()
  );