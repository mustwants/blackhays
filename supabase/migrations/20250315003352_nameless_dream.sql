/*
  # Optimize RLS Policies
  
  1. Changes
    - Fix auth.role() initialization plan issues
    - Remove duplicate policies
    - Optimize policy performance
    
  2. Security
    - Maintain existing security model
    - Use proper policy evaluation
*/

-- Drop all existing policies to avoid conflicts
DO $$ 
DECLARE
  table_name text;
BEGIN
  FOR table_name IN (
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public'
    AND tablename IN (
      'advisor_applications',
      'company_submissions', 
      'consortium_submissions',
      'innovation_submissions',
      'event_submissions',
      'newsletter_subscribers',
      'events'
    )
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS admin_full_access_policy ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS public_insert_policy ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS public_view_approved_policy ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS public_view_policy ON %I', table_name);
  END LOOP;
END $$;

-- Create optimized policies for tables with status column
DO $$ 
DECLARE
  table_name text;
  is_admin text := '(SELECT auth.role() = ''authenticated'')';
BEGIN
  FOR table_name IN (
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public'
    AND tablename IN (
      'advisor_applications',
      'company_submissions', 
      'consortium_submissions',
      'innovation_submissions',
      'event_submissions'
    )
  ) LOOP
    -- Admin full access policy
    EXECUTE format(
      'CREATE POLICY admin_full_access_policy ON %I FOR ALL TO authenticated USING (%s) WITH CHECK (%s)',
      table_name,
      is_admin,
      is_admin
    );
    
    -- Public insert policy
    EXECUTE format(
      'CREATE POLICY public_insert_policy ON %I FOR INSERT TO public WITH CHECK (true)',
      table_name
    );
    
    -- Public view approved policy
    EXECUTE format(
      'CREATE POLICY public_view_approved_policy ON %I FOR SELECT TO public USING (status = ''approved'')',
      table_name
    );
  END LOOP;
END $$;

-- Create optimized policies for newsletter_subscribers (no status column)
DO $$ 
DECLARE
  is_admin text := '(SELECT auth.role() = ''authenticated'')';
BEGIN
  -- Admin full access policy
  EXECUTE format(
    'CREATE POLICY admin_full_access_policy ON newsletter_subscribers FOR ALL TO authenticated USING (%s) WITH CHECK (%s)',
    is_admin,
    is_admin
  );
  
  -- Public insert policy
  EXECUTE 'CREATE POLICY public_insert_policy ON newsletter_subscribers FOR INSERT TO public WITH CHECK (true)';
END $$;

-- Create optimized policies for events table (public read, admin write)
DO $$ 
DECLARE
  is_admin text := '(SELECT auth.role() = ''authenticated'')';
BEGIN
  -- Admin full access policy
  EXECUTE format(
    'CREATE POLICY admin_full_access_policy ON events FOR ALL TO authenticated USING (%s) WITH CHECK (%s)',
    is_admin,
    is_admin
  );
  
  -- Public view policy
  EXECUTE 'CREATE POLICY public_view_policy ON events FOR SELECT TO public USING (true)';
END $$;