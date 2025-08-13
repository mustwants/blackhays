// netlify/functions/submissions-create.ts
import type { Handler } from '@netlify/functions'
import { getServiceClient, getUserFromBearer, json } from './_supabase'

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, {})
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' })

  const user = await getUserFromBearer(event)
  if (!user) return json(401, { error: 'Authentication required' })

  let payload: any
  try { payload = JSON.parse(event.body || '{}') } catch { return json(400, { error: 'Invalid JSON' }) }

  const { title, description, attachment_url } = payload
  if (!title || !description) return json(400, { error: 'title and description are required' })

  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('submissions')
    .insert([{
      title,
      description,
      attachment_url: attachment_url ?? null,
      status: 'pending',
      // keep the DB schema flexible: if your table has a user_id column this will populate it,
      // if not, Postgrest will ignore the extra field.
      user_id: user.id,
    }])
    .select('*')
    .single()

  if (error) return json(500, { error: error.message })

  return json(201, { data })
}


