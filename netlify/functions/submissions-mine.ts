import { Handler } from '@netlify/functions';
import { json, options } from './lib/response';
import { supabaseAdmin } from './lib/supabase';
import { requireUser } from './lib/auth';

// Authenticated: list current user's submissions
export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return options();
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });

  try {
    const me = await requireUser(event);

    const { data, error } = await supabaseAdmin
      .from('submissions')
      .select(
        'id, title, description, category, status, latitude, longitude, address, website, contact_email, contact_phone, tags, images, created_at, updated_at'
      )
      .eq('submitted_by', me.id)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) return json(400, { error: error.message });

    return json(200, { items: data });
  } catch (e: any) {
    return json(401, { error: e.message || 'Unauthorized' });
  }
};

