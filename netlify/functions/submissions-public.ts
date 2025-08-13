// netlify/functions/submissions-public.ts
import type { Handler } from '@netlify/functions'
import { getServiceClient, json } from './_supabase'

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, {})
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' })

  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) return json(500, { error: error.message })
  return json(200, { data: data ?? [] })
}

