/*
  # Fix Admin Functions and Extensions Schema
  
  1. Changes
     - Drop and recreate admin functions with proper signatures
     - Set proper search paths for security
     - Handle extensions schema creation
     
  2. Security
     - Add SECURITY DEFINER to sensitive functions
     - Set explicit search paths
     - Proper permission handling
*/

-- Drop existing functions first to avoid signature conflicts
DROP FUNCTION IF EXISTS public.update_admin_profile(uuid, text, text);
DROP FUNCTION IF EXISTS public.create_admin_user(text, text);
DROP FUNCTION IF EXISTS public.create_admin_user_if_needed();

-- Create admin user function with fixed search path
CREATE FUNCTION public.create_admin_user(
  admin_email text,
  admin_password text
)
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Create admin user if needed function with fixed search path
CREATE FUNCTION public.create_admin_user_if_needed()
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Update admin profile function with fixed search path
CREATE FUNCTION public.update_admin_profile(
  admin_id uuid,
  new_email text DEFAULT NULL,
  new_password text DEFAULT NULL
)
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Create extensions schema if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'extensions') THEN
    CREATE SCHEMA extensions;
    
    -- Grant usage to public
    GRANT USAGE ON SCHEMA extensions TO public;
    
    -- Create PostGIS in extensions schema
    CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;
  END IF;
END $$;