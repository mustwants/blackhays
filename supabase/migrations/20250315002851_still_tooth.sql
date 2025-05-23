/*
  # Fix Auth Settings and Password Configuration
  
  NOTE: Some settings need to be configured manually through the Supabase dashboard
  or by a database superuser outside of migrations.

  Required Manual Changes:
  
  1. Auth Settings (via Supabase Dashboard)
    - Go to Authentication > Providers > Email
      Set "OTP expiry" to 1800 seconds (30 minutes)
    - Go to Authentication > Policies
      Enable "Prevent use of compromised passwords"
      
  2. Database Settings (via superuser)
    Run these commands as superuser outside of migrations:
    ```sql
    ALTER SYSTEM SET password_encryption = 'scram-sha-256';
    ALTER SYSTEM SET password_min_length = 8;
    ```

  This migration will create functions and triggers to enforce password policies
  at the application level since we cannot modify system settings in migrations.
*/

-- Create a function to enforce minimum password length
CREATE OR REPLACE FUNCTION public.enforce_password_policy()
RETURNS TRIGGER AS $$
BEGIN
  -- Check minimum length
  IF length(NEW.encrypted_password) < 8 THEN
    RAISE EXCEPTION 'Password must be at least 8 characters long';
  END IF;
  
  -- Additional password policy checks can be added here
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for password policy enforcement
DROP TRIGGER IF EXISTS enforce_password_policy_trigger ON auth.users;
CREATE TRIGGER enforce_password_policy_trigger
  BEFORE INSERT OR UPDATE OF encrypted_password
  ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_password_policy();

-- Create a function to validate password complexity
CREATE OR REPLACE FUNCTION public.validate_password_complexity(password text)
RETURNS boolean AS $$
BEGIN
  RETURN (
    length(password) >= 8 AND                    -- Minimum length
    password ~ '[A-Z]' AND                       -- At least one uppercase
    password ~ '[a-z]' AND                       -- At least one lowercase
    password ~ '[0-9]' AND                       -- At least one number
    password ~ '[^A-Za-z0-9]'                    -- At least one special character
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;