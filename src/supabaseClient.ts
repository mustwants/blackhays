// src/supabaseClient.ts  (BROWSER-ONLY)
import { createClient } from '@supabase/supabase-js'

const url  = import.meta.env.VITE_SUPABASE_URL as string
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !anon) {
  console.error(
    '[supabaseClient] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'Set them in your .env and restart Vite.'
  )
}

// Public/browser client (uses anon key)
export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Some files expect this import
export const isConnected = Boolean(url && anon)

export default supabase
