/*
  # Create Events Table and Policies
  
  1. Changes
    - Create events table
    - Enable RLS
    - Add policies for admin and public access
    
  2. Security
    - Enable RLS on events table
    - Add policies for authenticated and public access
*/

-- Create events table if it doesn't exist
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  location text NOT NULL,
  website text,
  about text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "admin_full_access_policy" ON events;
DROP POLICY IF EXISTS "public_view_policy" ON events;

-- Create policy for admin full access
CREATE POLICY "admin_full_access_policy" ON events
  FOR ALL
  TO authenticated
  USING ((SELECT auth.role() = 'authenticated'))
  WITH CHECK ((SELECT auth.role() = 'authenticated'));

-- Create policy for public viewing
CREATE POLICY "public_view_policy" ON events
  FOR SELECT
  TO public
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add index for date range queries
CREATE INDEX IF NOT EXISTS events_date_range_idx ON events (start_date, end_date);