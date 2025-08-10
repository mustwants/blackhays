import { Handler } from '@netlify/functions';
import { z } from 'zod';
import { json, options } from './lib/response';
import { supabaseAdmin } from './lib/supabase';
import { requireAdmin } from './lib/auth';

/**
 * Admin-only endpoint to:
 * - update status: 'approved' | 'paused' | 'denied' | 'deleted'
 * - optionally edit fields (title, description, category, location, contacts, tags, images)
 *
 * Request: PATCH
 * Body: { id: string, status?: string, fields?: { ...editable fields... } }
 */
const StatusEnum = z.enum(['approved', 'paused', 'denied', 'deleted', 'pending']);

const EditableFields = z.object({
  title: z.string().min(3).max(140).optional(),
  description: z.string().max(4000).optional(),
  category: z.string().max(80).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  address: z.string().max(240).optional(),
  website: z.string().url().max(240).optional(),
  contact_email: z.string().email().max(240).optional(),
  contact_phone: z.string().max(40).optional(),
  tags: z.array(z.string().max(40)).max(20).optional(),
  images: z.array(z.string().url().max(512)).max(12).optional(),
});

const AdminUpdateSchema = z.object({
  id: z.string().uuid(),
  status: StatusEnum.optional(),
  fields: EditableFields.optional(),
});

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return options();
  if (event.httpMethod !== 'PATCH') return json(405, { error: 'Method not allowed' });

  try {
    const admin = await requireAdmin(event);

    const parsed = AdminUpdateSchema.safeParse(JSON.parse(event.body || '{}'));
    if (!parsed.success) return json(400, { error: 'Validation failed', details: parsed.error.issues });

    const { id, status, fields } = parsed.data;

    const update: Record<string, any> = { ...(fields || {}) };

    if (status) {
      update.status = status;
      if (status === 'approved') {
        update.approved_by = admin.id;
        update.approved_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabaseAdmin
      .from('submissions')
      .update(update)
      .eq('id', id)
      .select(
        'id, title, description, category, status, latitude, longitude, address, website, contact_email, contact_phone, tags, images, submitted_by, approved_by, approved_at, updated_at'
      )
      .single();

    if (error) return json(400, { error: error.message });
    return json(200, { item: data });
  } catch (e: any) {
    return json(401, { error: e.message || 'Unauthorized' });
  }
};


