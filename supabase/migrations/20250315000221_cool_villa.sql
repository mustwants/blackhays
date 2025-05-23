/*
  # Fix Database Security Functions
  
  1. Changes
     - Add security enhancements for functions
     - Set proper search paths
     - Improve function security
     
  2. Security
     - Set proper search paths for all functions
     - Add SECURITY DEFINER to sensitive functions
     - Enhance function security
*/

-- Update function normalize_subscriber_email to have fixed search path
CREATE OR REPLACE FUNCTION public.normalize_subscriber_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Normalize email address (make lowercase and trim)
  NEW.email := lower(trim(NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update function update_updated_at_column to have fixed search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update function update_advisor_location to have fixed search path
CREATE OR REPLACE FUNCTION public.update_advisor_location()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update location if address or zip_code changed and location is null
  IF (
    (NEW.address IS DISTINCT FROM OLD.address OR NEW.zip_code IS DISTINCT FROM OLD.zip_code OR NEW.location IS NULL)
  ) THEN
    -- Simple point generation based on address
    -- In production, this would call a geocoding service
    NEW.location := point(
      -- Random offset around US center (-95.7129, 37.0902)
      -95.7129 + (random() - 0.5) * 20,
      37.0902 + (random() - 0.5) * 10
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update function normalize_email to have fixed search path
CREATE OR REPLACE FUNCTION public.normalize_email(email text)
RETURNS text AS $$
BEGIN
  RETURN lower(trim(email));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update function rate_limit_login to have fixed search path
CREATE OR REPLACE FUNCTION public.rate_limit_login()
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Update function validate_password to have fixed search path
CREATE OR REPLACE FUNCTION public.validate_password(password text)
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create or replace function normalize_coordinates with fixed search path
CREATE OR REPLACE FUNCTION public.normalize_coordinates()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure coordinates are within valid ranges
  IF NEW.location IS NOT NULL THEN
    -- Ensure longitude is between -180 and 180
    IF ST_X(NEW.location) < -180 OR ST_X(NEW.location) > 180 THEN
      NEW.location := point(0, ST_Y(NEW.location));
    END IF;
    
    -- Ensure latitude is between -90 and 90
    IF ST_Y(NEW.location) < -90 OR ST_Y(NEW.location) > 90 THEN
      NEW.location := point(ST_X(NEW.location), 0);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;