/*
  # Enhance Auth Security Settings
  
  1. Changes
     - Set proper OTP expiry duration
     - Enable leaked password protection
     
  2. Security
     - Reduce OTP expiry to recommended values
     - Check passwords against HaveIBeenPwned.org
*/

-- NOTE: These settings typically need to be configured in the Supabase dashboard
-- as they are not directly manageable through SQL migrations.
-- This migration serves as documentation for manual steps needed.

/*
To fix the "Auth OTP long expiry" warning:
1. Go to the Supabase dashboard
2. Navigate to Authentication > Providers > Email
3. Set "OTP expiry" to a value less than 3600 seconds (1 hour)
   Recommended: 1800 seconds (30 minutes)

To fix the "Leaked Password Protection Disabled" warning:
1. Go to the Supabase dashboard
2. Navigate to Authentication > Policies
3. Enable the "Prevent use of compromised passwords" option

These changes will enhance the security of your authentication system.
*/