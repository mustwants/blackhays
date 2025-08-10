import { createClient, type SupabaseClient } from '@supabase/supabase-js';

declare global {
  interface Window { __bh_supabase?: SupabaseClient }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error('Missing Supabase env. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase: SupabaseClient =
  window.__bh_supabase ??
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'bh-auth',
    },
  });

window.__bh_supabase = supabase;

// quick connectivity check (dev-only)
(async () => {
  try {
    console.log('Validating Supabase connection (once)...');
    const { data, error } = await supabase.from('submissions').select('id').limit(1);
    if (error) console.warn('Supabase reachable but RLS likely restricting select on submissions (expected):', error.message);
    else console.log('Supabase OK, submissions rows:', data?.length ?? 0);
  } catch (err) {
    console.error('Supabase connectivity error:', err);
  }
})();
