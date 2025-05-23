/*
  # Auth Settings Documentation
  
  IMPORTANT: The following settings must be configured manually in the Supabase Dashboard:
  
  1. Auth OTP Expiry
    - Go to Authentication > Providers > Email
    - Set "OTP expiry" to 1800 seconds (30 minutes)
    - This addresses the "Auth OTP long expiry" warning
  
  2. Password Protection
    - Go to Authentication > Policies
    - Enable "Prevent use of compromised passwords"
    - This addresses the "Leaked Password Protection Disabled" warning
  
  These settings cannot be configured through SQL migrations and must be set
  through the Supabase Dashboard interface.
  
  After applying these changes:
  1. OTP tokens will expire after 30 minutes (improved security)
  2. Users will be prevented from using known compromised passwords
  3. Overall authentication security will be enhanced
*/

-- This migration is for documentation purposes only
-- No SQL changes are needed as these are dashboard settings