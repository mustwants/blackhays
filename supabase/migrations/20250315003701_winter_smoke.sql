/*
  # Security Settings Documentation
  
  This migration documents the security settings that need to be configured
  in the Supabase dashboard to address security warnings.
  
  1. Auth OTP Expiry
    - Go to Authentication > Email Settings
    - Set OTP expiry to 30 minutes (1800 seconds)
  
  2. Leaked Password Protection
    - Go to Authentication > Policies
    - Enable "Prevent use of compromised passwords"
    - This will check passwords against HaveIBeenPwned.org
  
  3. Password Requirements
    - Minimum length: 8 characters
    - Must contain:
      - Uppercase letters
      - Lowercase letters
      - Numbers
      - Special characters
    
  These settings cannot be configured via SQL migrations and must be set
  manually in the Supabase dashboard.
*/