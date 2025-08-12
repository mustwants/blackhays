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
// DEV: detect pre-auth queries and show where they come from
if (import.meta.env.DEV) {
  const clientAny = supabase as any;

  const wrap = (fnName: 'from' | 'rpc') => {
    const orig = clientAny[fnName].bind(supabase);
    clientAny[fnName] = async (...args: any[]) => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data?.session) {
          const tblOrFn = args[0];
          const err = new Error(`[PRE-AUTH ${fnName.toUpperCase()}] ${tblOrFn}`);
          // Trim the stack a bit for readability
          console.warn(err.stack?.split('\n').slice(0, 6).join('\n'));
        }
      } catch {}
      return orig(...args);
    };
  };

  wrap('from');
  wrap('rpc');
}


