// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// ---- Browser client (safe in React) ----
const PUBLIC_URL  = import.meta.env.VITE_SUPABASE_URL as string
const PUBLIC_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(PUBLIC_URL, PUBLIC_ANON)

// ---- Server/admin client (never runs in the browser) ----
// Only create this when a Node env exists (e.g., Netlify/Vercel function).
let _admin: ReturnType<typeof createClient> | null = null
// @ts-ignore - process is only defined in server environments
if (typeof process !== 'undefined' && process?.env?.SUPABASE_SERVICE_ROLE_KEY && process?.env?.SUPABASE_URL) {
  // @ts-ignore - process is only defined in server environments
  _admin = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}
export const supabaseAdmin = _admin

export const isConnected = Boolean(PUBLIC_URL && PUBLIC_ANON)
