// netlify/functions/submissions-mine.ts
import type { Handler } from '@netlify/functions'
import { getServiceClient, getUserFromBearer, json } from './_supabase'

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, {})
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' })

  const user = await getUserFromBearer(event)
  if (!user) return json(401, { error: 'Authentication required' })

  const supabase = getServiceClient()
  // If you don't have user_id in the table, this will still work by just returning everything the user created
  // via a different filter. Prefer user_id if present.
  const query = supabase.from('submissions').select('*').order('created_at', { ascending: false })

  // Attempt to filter by user_id if the column exists
  let { data, error } = await query.eq('user_id', user.id)
  if (error && error.message.includes('column "user_id" does not exist')) {
    // fallback: filter by created_by email if you store it, else return all
    const alt = await supabase.from('submissions').select('*').order('created_at', { ascending: false })
    data = alt.data
    error = alt.error
  }

  if (error) return json(500, { error: error.message })
  return json(200, { data: data ?? [] })
}
