import { Handler } from '@netlify/functions';
import { json, options } from './lib/response';
import { supabaseAdmin } from './lib/supabase';

// Public: list approved for map/cards (no auth required)
export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return options();
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });

  // Optional bounding box filter for Mapbox viewport
  const { swlat, swlng, nelat, nelng } = event.queryStringParameters || {};
  const bbox =
    swlat && swlng && nelat && nelng
      ? {
          swlat: Number(swlat),
          swlng: Number(swlng),
          nelat: Number(nelat),
          nelng: Number(nelng),
        }
      : null;

  try {
    let query = supabaseAdmin.from('approved_submissions').select(
      'id, title, description, category, latitude, longitude, address, website, contact_email, contact_phone, tags, images, created_at, updated_at'
    );

    if (bbox) {
      if (
        Number.isFinite(bbox.swlat) &&
        Number.isFinite(bbox.swlng) &&
        Number.isFinite(bbox.nelat) &&
        Number.isFinite(bbox.nelng)
      ) {
        query = query
          .gte('latitude', bbox.swlat)
          .lte('latitude', bbox.nelat)
          .gte('longitude', bbox.swlng)
          .lte('longitude', bbox.nelng);
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(500);
    if (error) return json(400, { error: error.message });

    return json(200, { items: data });
  } catch (e: any) {
    return json(500, { error: e.message || 'Server error' });
  }
};

