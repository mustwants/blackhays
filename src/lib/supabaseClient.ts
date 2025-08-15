// src/lib/supabaseClient.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Read-only public browser client
const url  = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Create the client once per browser tab (prevents duplicate GoTrue warnings)
const getClient = (): SupabaseClient | null => {
  if (!url || !anon) return null;

  // cache on globalThis to avoid re-creating
  const g = globalThis as any;
  if (!g.__SUPABASE__) {
    g.__SUPABASE__ = createClient(url, anon, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    });
  }
  return g.__SUPABASE__ as SupabaseClient;
};

export const supabase = getClient();

/** Small helper the app can call before making requests */
export function isConnected(): boolean {
  return !!supabase;
}
