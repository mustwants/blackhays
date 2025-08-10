import { Handler } from '@netlify/functions';
import { z } from 'zod';
import { json, options } from './lib/response';
import { supabaseAdmin } from './lib/supabase';
import { requireUser } from './lib/auth';

const CreateSchema = z.object({
  title: z.string().min(3).max(140),
  description: z.string().max(4000).optional().default(''),
  category: z.string().max(80).optional().default(''),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().max(240).optional().default(''),
  website: z.string().url().max(240).optional().or(z.literal('')).default(''),
  contact_email: z.string().email().max(240).optional().or(z.literal('')).default(''),
  contact_phone: z.string().max(40).optional().or(z.literal('')).default(''),
  tags: z.array(z.string().max(40)).max(20).optional().default([]),
  images: z.array(z.string().url().max(512)).max(12).optional().default([]),
});

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return options();
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  try {
    const me = await requireUser(event);

    const parsed = CreateSchema.safeParse(JSON.parse(event.body || '{}'));
    if (!parsed.success) {
      return json(400, { error: 'Validation failed', details: parsed.error.issues });
    }

    const payload = parsed.data;

    const insertRow = {
      title: payload.title,
      description: payload.description,
      category: payload.category,
      latitude: payload.latitude,
      longitude: payload.longitude,
      address: payload.address,
      website: payload.website,
      contact_email: payload.contact_email,
      contact_phone: payload.contact_phone,
      tags: payload.tags,
      images: payload.images,
      submitted_by: me.id,
      status: 'pending',
    };

    const { data, error } = await supabaseAdmin
      .from('submissions')
      .insert(insertRow)
      .select('id, status, created_at')
      .single();

    if (error) return json(400, { error: error.message });

    return json(201, { id: data.id, status: data.status, created_at: data.created_at });
  } catch (e: any) {
    return json(401, { error: e.message || 'Unauthorized' });
  }
};

