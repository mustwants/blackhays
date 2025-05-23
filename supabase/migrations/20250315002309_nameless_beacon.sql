/*
  # Fix Remaining Security Issues
  
  1. Changes
     - Handle PostGIS extension and schema properly
     - Fix normalize_coordinates function with proper search path
     - Grant appropriate permissions for spatial_ref_sys access
     
  2. Security
     - Move PostGIS to extensions schema
     - Set proper function search paths
     - Handle permissions securely
*/

-- Create extensions schema and move PostGIS
DO $$ 
BEGIN
  -- Create extensions schema if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'extensions') THEN
    CREATE SCHEMA extensions;
  END IF;

  -- Grant usage to public
  GRANT USAGE ON SCHEMA extensions TO public;

  -- Drop PostGIS if it exists in public schema
  IF EXISTS (
    SELECT 1 FROM pg_extension 
    WHERE extname = 'postgis' 
    AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    DROP EXTENSION IF EXISTS postgis CASCADE;
  END IF;

  -- Create PostGIS in extensions schema
  IF NOT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'postgis'
  ) THEN
    CREATE EXTENSION postgis WITH SCHEMA extensions;
  END IF;
END $$;

-- Grant read access to spatial_ref_sys to public
GRANT SELECT ON extensions.spatial_ref_sys TO public;

-- Drop and recreate normalize_coordinates function with proper search path
DROP FUNCTION IF EXISTS public.normalize_coordinates();

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;