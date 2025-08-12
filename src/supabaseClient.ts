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

// (optional) pre-auth detector: leave OFF in prod by default
const DEBUG_PREAUTH = import.meta.env.VITE_DEBUG_PREAUTH === '1';
if (DEBUG_PREAUTH) {
  const anyClient = supabase as any;
  if (!('__wrapped_pre_auth__' in anyClient)) {
    anyClient.__wrapped_pre_auth__ = true;

    const wrap = (fnName: 'from' | 'rpc') => {
      const orig = anyClient[fnName].bind(supabase);
      anyClient[fnName] = (...args: any[]) => {
        supabase.auth.getSession().then(({ data }) => {
          if (!data?.session) {
            const target = args[0];
            const e = new Error(`[PRE-AUTH ${fnName.toUpperCase()}] ${target}`);
            console.warn(e.stack?.split('\n').slice(0, 6).join('\n'));
          }
        });
        return orig(...args);
      };
    };

    wrap('from');
    wrap('rpc');
  }
}


