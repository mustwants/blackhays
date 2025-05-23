/*
  # Fix RLS Policies and Performance Issues
  
  1. Changes
     - Remove duplicate RLS policies
     - Fix auth function calls in RLS policies
     - Consolidate policies for better performance
     
  2. Security
     - Maintain same security rules
     - Improve performance without compromising security
*/

-- First, drop all duplicate policies
DO $$ 
DECLARE
  table_name text;
  policy_name text;
BEGIN
  -- Drop duplicate policies for advisor_applications
  FOR policy_name IN (
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'advisor_applications' 
    AND schemaname = 'public'
    AND policyname NOT IN ('admin_full_access_policy', 'public_insert_policy', 'public_view_approved_policy')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON advisor_applications', policy_name);
  END LOOP;

  -- Drop duplicate policies for company_submissions
  FOR policy_name IN (
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'company_submissions' 
    AND schemaname = 'public'
    AND policyname NOT IN ('admin_full_access_policy', 'public_insert_policy', 'public_view_approved_policy')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON company_submissions', policy_name);
  END LOOP;

  -- Drop duplicate policies for consortium_submissions
  FOR policy_name IN (
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'consortium_submissions' 
    AND schemaname = 'public'
    AND policyname NOT IN ('admin_full_access_policy', 'public_insert_policy', 'public_view_approved_policy')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON consortium_submissions', policy_name);
  END LOOP;

  -- Drop duplicate policies for innovation_submissions
  FOR policy_name IN (
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'innovation_submissions' 
    AND schemaname = 'public'
    AND policyname NOT IN ('admin_full_access_policy', 'public_insert_policy', 'public_view_approved_policy')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON innovation_submissions', policy_name);
  END LOOP;

  -- Drop duplicate policies for event_submissions
  FOR policy_name IN (
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'event_submissions' 
    AND schemaname = 'public'
    AND policyname NOT IN ('admin_full_access_policy', 'public_insert_policy', 'public_view_approved_policy')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON event_submissions', policy_name);
  END LOOP;

  -- Drop duplicate policies for newsletter_subscribers
  FOR policy_name IN (
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'newsletter_subscribers' 
    AND schemaname = 'public'
    AND policyname NOT IN ('admin_full_access_policy', 'public_insert_policy')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON newsletter_subscribers', policy_name);
  END LOOP;

  -- Drop duplicate policies for events
  FOR policy_name IN (
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'events' 
    AND schemaname = 'public'
    AND policyname NOT IN ('admin_full_access_policy', 'public_view_policy')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON events', policy_name);
  END LOOP;
END $$;

-- Create optimized policies for advisor_applications
CREATE POLICY admin_full_access_policy ON advisor_applications
  FOR ALL TO authenticated
  USING ((SELECT auth.role() = 'authenticated'))
  WITH CHECK ((SELECT auth.role() = 'authenticated'));

CREATE POLICY public_insert_policy ON advisor_applications
  FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY public_view_approved_policy ON advisor_applications
  FOR SELECT TO public
  USING (status = 'approved');

-- Create optimized policies for company_submissions
CREATE POLICY admin_full_access_policy ON company_submissions
  FOR ALL TO authenticated
  USING ((SELECT auth.role() = 'authenticated'))
  WITH CHECK ((SELECT auth.role() = 'authenticated'));

CREATE POLICY public_insert_policy ON company_submissions
  FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY public_view_approved_policy ON company_submissions
  FOR SELECT TO public
  USING (status = 'approved');

-- Create optimized policies for consortium_submissions
CREATE POLICY admin_full_access_policy ON consortium_submissions
  FOR ALL TO authenticated
  USING ((SELECT auth.role() = 'authenticated'))
  WITH CHECK ((SELECT auth.role() = 'authenticated'));

CREATE POLICY public_insert_policy ON consortium_submissions
  FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY public_view_approved_policy ON consortium_submissions
  FOR SELECT TO public
  USING (status = 'approved');

-- Create optimized policies for innovation_submissions
CREATE POLICY admin_full_access_policy ON innovation_submissions
  FOR ALL TO authenticated
  USING ((SELECT auth.role() = 'authenticated'))
  WITH CHECK ((SELECT auth.role() = 'authenticated'));

CREATE POLICY public_insert_policy ON innovation_submissions
  FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY public_view_approved_policy ON innovation_submissions
  FOR SELECT TO public
  USING (status = 'approved');

-- Create optimized policies for event_submissions
CREATE POLICY admin_full_access_policy ON event_submissions
  FOR ALL TO authenticated
  USING ((SELECT auth.role() = 'authenticated'))
  WITH CHECK ((SELECT auth.role() = 'authenticated'));

CREATE POLICY public_insert_policy ON event_submissions
  FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY public_view_approved_policy ON event_submissions
  FOR SELECT TO public
  USING (status = 'approved');

-- Create optimized policies for newsletter_subscribers
CREATE POLICY admin_full_access_policy ON newsletter_subscribers
  FOR ALL TO authenticated
  USING ((SELECT auth.role() = 'authenticated'))
  WITH CHECK ((SELECT auth.role() = 'authenticated'));

CREATE POLICY public_insert_policy ON newsletter_subscribers
  FOR INSERT TO public
  WITH CHECK (true);

-- Create optimized policies for events
CREATE POLICY admin_full_access_policy ON events
  FOR ALL TO authenticated
  USING ((SELECT auth.role() = 'authenticated'))
  WITH CHECK ((SELECT auth.role() = 'authenticated'));

CREATE POLICY public_view_policy ON events
  FOR SELECT TO public
  USING (true);