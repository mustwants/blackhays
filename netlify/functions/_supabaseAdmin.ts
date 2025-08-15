// netlify/functions/_supabaseAdmin.ts  (SERVER-ONLY)
import { createClient } from '@supabase/supabase-js'

export function getAdminClient() {
  const url = process.env.SUPABASE_URL
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !service) {
    throw new Error(
      '[supabaseAdmin] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
      'Set them in your Netlify/Vercel env (or .env when running functions locally).'
    )
  }

  return createClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
