// netlify/functions/_supabase.ts
import type { HandlerEvent } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

export function getServiceClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL!
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })
}

export function getBearerToken(event: HandlerEvent) {
  const auth = event.headers.authorization || event.headers.Authorization
  if (!auth) return null
  const [, token] = auth.split(' ')
  return token || null
}

export async function getUserFromBearer(event: HandlerEvent) {
  const token = getBearerToken(event)
  if (!token) return null
  const supabase = getServiceClient()
  const { data, error } = await supabase.auth.getUser(token)
  if (error) return null
  return data.user ?? null
}

export function isAdminEmail(email?: string | null) {
  return !!email && email.toLowerCase().endsWith('@blackhaysgroup.com')
}

export function json(status: number, body: unknown) {
  return {
    statusCode: status,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }
}
