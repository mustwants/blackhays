/*
  # Fix Function Search Path and Security Settings
  
  1. Changes
    - Set immutable search paths for functions
    - Add security definer settings
    - Update function definitions for better security
*/

-- Update create_admin_user function with fixed search path
CREATE OR REPLACE FUNCTION public.create_admin_user(
  admin_email text,
  admin_password text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Validate inputs
  IF NOT public.validate_password(admin_password) THEN
    RAISE EXCEPTION 'Password does not meet requirements';
  END IF;
  
  -- Normalize email
  admin_email := public.normalize_email(admin_email);
  
  -- Create admin user
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    role
  ) VALUES (
    admin_email,
    crypt(admin_password, gen_salt('bf', 12)),
    NOW(),
    jsonb_build_object('role', 'admin'),
    'authenticated'
  )
  ON CONFLICT (email) DO NOTHING;
END;
$$;

-- Update create_admin_user_if_needed function with fixed search path
CREATE OR REPLACE FUNCTION public.create_admin_user_if_needed()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE raw_user_meta_data->>'role' = 'admin'
  ) THEN
    PERFORM public.create_admin_user(
      'admin@example.com',
      'Admin1967'
    );
  END IF;
END;
$$;

-- Update update_admin_profile function with fixed search path
CREATE OR REPLACE FUNCTION public.update_admin_profile(
  admin_id uuid,
  new_email text DEFAULT NULL,
  new_password text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Validate inputs if provided
  IF new_password IS NOT NULL THEN
    IF NOT public.validate_password(new_password) THEN
      RAISE EXCEPTION 'Password does not meet requirements';
    END IF;
  END IF;
  
  -- Normalize email if provided
  IF new_email IS NOT NULL THEN
    new_email := public.normalize_email(new_email);
  END IF;
  
  -- Update user
  UPDATE auth.users
  SET
    email = COALESCE(new_email, email),
    encrypted_password = CASE 
      WHEN new_password IS NOT NULL 
      THEN crypt(new_password, gen_salt('bf', 12))
      ELSE encrypted_password
    END,
    updated_at = NOW()
  WHERE id = admin_id
  AND raw_user_meta_data->>'role' = 'admin';
END;
$$;