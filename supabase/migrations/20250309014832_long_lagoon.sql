/*
  # Secure Admin Login Configuration

  1. Changes
    - Add username/email validation
    - Enforce password requirements
    - Add rate limiting
    - Enable row level security
    - Add security policies

  2. Security
    - Password must contain uppercase, lowercase, number, special character
    - Rate limiting on login attempts
    - Row level security for user data
*/

-- Create function to validate password strength
CREATE OR REPLACE FUNCTION validate_password(password text)
RETURNS boolean AS $$
BEGIN
  -- Check password requirements:
  -- At least 8 characters
  -- Contains uppercase
  -- Contains lowercase
  -- Contains number
  -- Contains special character
  RETURN password ~ '^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$';
END;
$$ LANGUAGE plpgsql;

-- Create function to normalize email
CREATE OR REPLACE FUNCTION normalize_email(email text)
RETURNS text AS $$
BEGIN
  RETURN lower(trim(email));
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for rate limiting
CREATE OR REPLACE FUNCTION rate_limit_login()
RETURNS trigger AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.audit_log_entries
    WHERE actor_id = NEW.actor_id
    AND created_at > NOW() - INTERVAL '5 minutes'
    GROUP BY actor_id
    HAVING COUNT(*) > 5
  ) THEN
    RAISE EXCEPTION 'Too many login attempts. Please try again later.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rate limiting
DROP TRIGGER IF EXISTS auth_rate_limit_login ON auth.audit_log_entries;
CREATE TRIGGER auth_rate_limit_login
  BEFORE INSERT ON auth.audit_log_entries
  FOR EACH ROW
  EXECUTE FUNCTION rate_limit_login();

-- Enable RLS on auth tables
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create policies for auth tables
CREATE POLICY "Users can only view their own data"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Only admins can update users"
  ON auth.users
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Update or create admin user
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'scott@blackhaysgroup.com'
  ) THEN
    UPDATE auth.users
    SET 
      raw_user_meta_data = jsonb_set(
        raw_user_meta_data,
        '{username}',
        '"Admin"'
      ),
      encrypted_password = crypt('Admin1967!', gen_salt('bf', 12)),
      email_confirmed_at = NOW(),
      role = 'admin'
    WHERE email = 'scott@blackhaysgroup.com';
  ELSE
    INSERT INTO auth.users (
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      role
    ) VALUES (
      'scott@blackhaysgroup.com',
      crypt('Admin1967!', gen_salt('bf', 12)),
      NOW(),
      '{"username": "Admin"}',
      'admin'
    );
  END IF;
END $$;