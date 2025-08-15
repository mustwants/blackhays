// src/lib/supabaseClient.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url!, anon!, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Simple health check the app can call before querying
export const isConnected = () => Boolean(url && anon);

/**
 * DO NOT use service-role in the browser.
 * This stub exists ONLY so legacy imports don't break bundling.
 * Any call on it will throw at runtime.
 */
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get() {
    throw new Error('supabaseAdmin is server-only. Call a Netlify Function instead.');
  },
}) as unknown as SupabaseClient;
