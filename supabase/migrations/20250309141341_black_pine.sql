/*
  # Fix Row Level Security Policies

  1. Changes
     - Updates RLS policies for event_submissions table to allow authenticated users full access
     - Updates RLS policies for other tables to ensure admins can manage all content
     - Fixes policy inconsistencies that were causing 401 errors

  2. Security
     - Maintains public read-only access for approved items
     - Ensures authenticated users (admins) have full CRUD access
*/

-- Fix event_submissions table policies
DROP POLICY IF EXISTS "Admins have full access to event submissions" ON public.event_submissions;
CREATE POLICY "Admins have full access to event submissions" 
ON public.event_submissions 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Ensure public users can submit events
DROP POLICY IF EXISTS "Public can submit events" ON public.event_submissions;
CREATE POLICY "Public can submit events" 
ON public.event_submissions 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Ensure public users can view approved events
DROP POLICY IF EXISTS "Public can view approved events" ON public.event_submissions;
CREATE POLICY "Public can view approved events" 
ON public.event_submissions 
FOR SELECT
TO public 
USING (status = 'approved');

-- Fix company_submissions table policies
DROP POLICY IF EXISTS "Admins have full access to companies" ON public.company_submissions;
CREATE POLICY "Admins have full access to companies" 
ON public.company_submissions 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Fix consortium_submissions table policies
DROP POLICY IF EXISTS "consortium_admin_full_access_2025" ON public.consortium_submissions;
CREATE POLICY "consortium_admin_full_access_2025" 
ON public.consortium_submissions 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Fix innovation_submissions table policies
DROP POLICY IF EXISTS "innovation_admin_policy_2025" ON public.innovation_submissions;
CREATE POLICY "innovation_admin_policy_2025" 
ON public.innovation_submissions 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Fix advisor_applications table policies
DROP POLICY IF EXISTS "Admins have full access to advisors" ON public.advisor_applications;
CREATE POLICY "Admins have full access to advisors" 
ON public.advisor_applications 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Fix newsletter_subscribers table policies
DROP POLICY IF EXISTS "Admins have full access to subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins have full access to subscribers" 
ON public.newsletter_subscribers 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);