// netlify/functions/submissions-admin-update.ts
import type { Handler } from '@netlify/functions'
import { getServiceClient, getUserFromBearer, isAdminEmail, json } from './_supabase'

type Action = 'approve' | 'deny' | 'pause' | 'resume' | 'delete' | 'edit'

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, {})
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' })

  const user = await getUserFromBearer(event)
  if (!user) return json(401, { error: 'Authentication required' })
  if (!isAdminEmail(user.email)) return json(403, { error: 'Admins only' })

  let payload: any
  try { payload = JSON.parse(event.body || '{}') } catch { return json(400, { error: 'Invalid JSON' }) }

  const { id, action, title, description } = payload as { id: string; action: Action; title?: string; description?: string }
  if (!id || !action) return json(400, { error: 'id and action are required' })

  const supabase = getServiceClient()

  if (action === 'delete') {
    const { error } = await supabase.from('submissions').delete().eq('id', id)
    if (error) return json(500, { error: error.message })
    return json(200, { ok: true })
  }

  if (action === 'edit') {
    const fields: any = {}
    if (typeof title === 'string') fields.title = title
    if (typeof description === 'string') fields.description = description
    if (Object.keys(fields).length === 0) return json(400, { error: 'no fields to update' })
    const { data, error } = await supabase.from('submissions').update(fields).eq('id', id).select('*').single()
    if (error) return json(500, { error: error.message })
    return json(200, { data })
  }

  const statusMap: Record<Exclude<Action, 'delete' | 'edit'>, string> = {
    approve: 'approved',
    deny: 'denied',
    pause: 'paused',
    resume: 'pending',
  }

  const newStatus = statusMap[action]
  const { data, error } = await supabase.from('submissions').update({ status: newStatus }).eq('id', id).select('*').single()
  if (error) return json(500, { error: error.message })

  return json(200, { data })
}



