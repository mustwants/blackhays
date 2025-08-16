// src/services/advisors/index.ts
import { supabase } from '../../lib/supabaseClient';

export type AdvisorStatus = 'pending' | 'approved' | 'rejected' | 'paused';

export interface Advisor {
  id: string;
  name: string;
  email: string;
  state: string;
  zip_code: string;
  phone?: string;
  address?: string;
  city?: string;
  webpage?: string;
  facebook?: string;
  x?: string;
  linkedin?: string;
  bluesky?: string;
  instagram?: string;
  professional_title?: string;
  military_branch?: string;
  other_branch?: string;
  years_of_service?: string;
  service_status?: string[];
  other_status?: string;
  about?: string;
  resume_url?: string;
  headshot_url?: string;
  business_logo_url?: string;
  status: AdvisorStatus;
  // Flexible — can be GeoJSON Point, [lng,lat], [lat,lng], {lat,lng}, or null
  location?: any;
}

/** Normalize various location shapes to [lng, lat] when possible. */
function normalizeLocation(row: any): [number, number] | null {
  // GeoJSON { type:"Point", coordinates:[lng,lat] }
  if (row?.location?.type === 'Point' && Array.isArray(row.location.coordinates)) {
    const [lng, lat] = row.location.coordinates;
    if (isFinite(lng) && isFinite(lat)) return [Number(lng), Number(lat)];
  }

  // Raw array (assume [lng, lat] if plausible, else try [lat, lng])
  if (Array.isArray(row?.location) && row.location.length === 2) {
    const a = Number(row.location[0]);
    const b = Number(row.location[1]);
    if (isFinite(a) && isFinite(b)) {
      // Determine if [lng, lat] vs [lat, lng]
      const looksLikeLngLat = a >= -180 && a <= 180 && b >= -90 && b <= 90;
      return looksLikeLngLat ? [a, b] : [b, a];
    }
  }

  // Object { lng, lat } or { latitude, longitude }
  if (row?.location && typeof row.location === 'object') {
    const lng = Number(row.location.lng ?? row.location.longitude);
    const lat = Number(row.location.lat ?? row.location.latitude);
    if (isFinite(lng) && isFinite(lat)) return [lng, lat];
  }

  // Separate columns: lng/lat or lon/lat
  const lng = Number(row?.lng ?? row?.lon ?? row?.longitude);
  const lat = Number(row?.lat ?? row?.latitude);
  if (isFinite(lng) && isFinite(lat)) return [lng, lat];

  return null;
}

/** Map raw DB row to our Advisor interface (keeps legacy columns compatible). */
function mapAdvisorRow(row: any): Advisor {
  const fullName =
    row?.name ??
    [row?.first_name, row?.last_name].filter(Boolean).join(' ') ??
    '';

  return {
    id: row.id,
    name: fullName,
    email: row.email ?? '',
    state: row.state ?? '',
    zip_code: row.zip_code ?? '',
    phone: row.phone ?? row.phone_number ?? undefined,
    address: row.address ?? row.street_address ?? undefined,
    city: row.city ?? undefined,
    webpage: row.webpage ?? row.website ?? undefined,
    facebook: row.facebook ?? undefined,
    x: row.x ?? row.twitter ?? undefined,
    linkedin: row.linkedin ?? undefined,
    bluesky: row.bluesky ?? undefined,
    instagram: row.instagram ?? undefined,
    professional_title: row.professional_title ?? undefined,
    military_branch: row.military_branch ?? undefined,
    other_branch: row.other_branch ?? undefined,
    years_of_service: row.years_of_service ?? undefined,
    service_status: row.service_status ?? undefined,
    other_status: row.other_status ?? undefined,
    about: row.about ?? row.bio ?? undefined,
    resume_url: row.resume_url ?? undefined,
    headshot_url: row.headshot_url ?? row.photo_url ?? undefined,
    business_logo_url: row.business_logo_url ?? undefined,
    status: (row.status ?? 'pending') as AdvisorStatus,
    location: normalizeLocation(row)
  };
}

export const advisorService = {
  /** All approved advisors for public display (map/cards). */
  async getApproved(): Promise<Advisor[]> {
    const { data, error } = await supabase
      .from('advisor_applications')
      .select('*')
      .eq('status', 'approved');

    if (error) throw new Error(error.message || 'Failed to fetch advisors');
    return (data ?? []).map(mapAdvisorRow);
  },

  /** All advisors (admin view). Optional filters for status/search. */
  async getAll(
    opts?: { status?: AdvisorStatus; search?: string }
  ): Promise<Advisor[]> {
    let query = supabase.from('advisor_applications').select('*');

    if (opts?.status) query = query.eq('status', opts.status);
    if (opts?.search) {
      const s = `%${opts.search}%`;
      query = query.or(
        `name.ilike.${s},email.ilike.${s},city.ilike.${s},state.ilike.${s}`
      );
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new Error(error.message || 'Failed to fetch advisors');
    return (data ?? []).map(mapAdvisorRow);
  },

  /** Create a new advisor application (public form). */
  async create(payload: Partial<Advisor>): Promise<Advisor> {
    const insert = {
      ...payload,
      status: (payload.status ?? 'pending') as AdvisorStatus
    };
    const { data, error } = await supabase
      .from('advisor_applications')
      .insert(insert)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to create advisor');
    return mapAdvisorRow(data);
  },

  /** Update status (approve/pause/reject). */
  async updateStatus(id: string, status: AdvisorStatus): Promise<void> {
    const { error } = await supabase
      .from('advisor_applications')
      .update({ status })
      .eq('id', id);

    if (error) throw new Error(error.message || 'Failed to update status');
  },

  /** Edit an advisor (admin). */
  async update(id: string, patch: Partial<Advisor>): Promise<Advisor> {
    const { data, error } = await supabase
      .from('advisor_applications')
      .update(patch)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to update advisor');
    return mapAdvisorRow(data);
  },

  /** Delete an advisor (admin). */
  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('advisor_applications')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message || 'Failed to delete advisor');
  }
};

export default advisorService;
