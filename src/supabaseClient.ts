// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// One-time connectivity check (safe under RLS)
(async () => {
  try {
    const { error } = await supabase.from('submissions').select('id').limit(1);
    if (error) {
      console.warn(
        'Supabase reachable; RLS likely restricting select (expected if not logged in):',
        error.message
      );
    } else {
      console.log('Supabase OK (public.submissions reachable).');
    }
  } catch (e: any) {
    console.error('Supabase connectivity error:', e?.message || e);
  }
})();
