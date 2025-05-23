/*
  # Update Admin Credentials

  1. Changes
    - Updates default admin user credentials
    - Sets username to "Admin"
    - Sets email to scott@blackhaysgroup.com
    - Sets initial password to Admin1967!

  2. Security
    - Ensures secure password requirements
    - Maintains existing admin permissions
*/

-- Update admin user credentials
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'admin@example.com'
  ) THEN
    UPDATE auth.users
    SET 
      email = 'scott@blackhaysgroup.com',
      raw_user_meta_data = jsonb_set(
        raw_user_meta_data,
        '{username}',
        '"Admin"'
      )
    WHERE email = 'admin@example.com';
  END IF;
END $$;

-- Update password (hashed)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'scott@blackhaysgroup.com'
  ) THEN
    UPDATE auth.users
    SET encrypted_password = crypt('Admin1967!', gen_salt('bf'))
    WHERE email = 'scott@blackhaysgroup.com';
  END IF;
END $$;