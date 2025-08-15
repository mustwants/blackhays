// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Browser client (for user-facing code)
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

// Admin client (serverless functions or secure code only)
// Will fallback to anon key if service key is not present (browser-safe)
export const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Quick connection check
export const isConnected = () => {
  return Boolean(
    (import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL) &&
    (import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)
  );
};
