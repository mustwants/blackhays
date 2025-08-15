// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Public client (for normal browser interactions)
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

// Admin client (server-side or secure Netlify functions)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
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
