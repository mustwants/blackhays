import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

// Re-export the normal client
export { supabase };

// TEMP: client-side placeholder so imports compile.
// DO NOT use this for privileged/admin operations in the browser.
// We'll move admin actions to serverless functions with a service-role key.
export const supabaseAdmin: SupabaseClient = supabase;

// No-op connection check to satisfy existing imports.
export const isConnected = async (): Promise<boolean> => true;