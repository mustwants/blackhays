// src/services/advisors/index.ts
import { supabase, isConnected } from '../../lib/supabaseClient'

export type AdvisorStatus = 'pending' | 'approved' | 'rejected' | 'paused'

export interface Advisor {
  id: string
  name: string
  email: string
  state: string
  zip_code: string
  phone?: string
  address?: string
  city?: string
  webpage?: string
  facebook?: string
  x?: string
  linkedin?: string
  bluesky?: string
  instagram?: string
  professional_title?: string
  military_branch?: string
  other_branch?: string
  years_of_service?: string
  service_status?: string[]
  other_status?: string
  about?: string
  resume_url?: string
  headshot_url?: string
  business_logo_url?: string
  status: AdvisorStatus
  // coordinates can be stored in multiple ways:
  lat?: number | null
  lng?: number | null
  location?: unknown
  // optional legacy fields we’ll map from if present:
  full_name?: string
  first_name?: string
  last_name?: string
}

export interface MapAdvisor {
  id: string
  name: string
  professional_title?: string
  military_branch?: string
  about?: string
  // [lng, lat]
  location: [number, number]
}

function pickName(r: Partial<Advisor>): string {
  const parts = [
    r.name,
    r.full_name,
    [r.first_name, r.last_name].filter(Boolean).join(' ').trim(),
    r.email
  ].filter(v => typeof v === 'string' && v.trim().length > 0) as string[]
  return parts[0] ?? 'Unnamed'
}

/** Accepts various shapes of "location" and returns [lng, lat] or null */
function toLngLat(r: Partial<Advisor>): [number, number] | null {
  // 1) explicit numeric columns
  if (typeof r.lng === 'number' && typeof r.lat === 'number') {
    return [r.lng, r.lat]
  }
  // 2) GeoJSON: { type: 'Point', coordinates: [lng,lat] }
  const loc: any = r.location
  if (loc && typeof loc === 'object') {
    if (loc.type === 'Point' && Array.isArray(loc.coordinates) && loc.coordinates.length >= 2) {
      const [lng, lat] = loc.coordinates
      if (Number.isFinite(lng) && Number.isFinite(lat)) return [lng, lat]
    }
    // 3) array [lng,lat]
    if (Array.isArray(loc) && loc.length >= 2) {
      const [lng, lat] = loc
      if (Number.isFinite(lng) && Number.isFinite(lat)) return [lng as number, lat as number]
    }
    // 4) object with {lng,lat}
    if (typeof loc.lng === 'number' && typeof loc.lat === 'number') {
      return [loc.lng, loc.lat]
    }
  }
  return null
}

async function fetchRows(): Promise<Advisor[]> {
  if (!isConnected()) throw new Error('Supabase is not configured')

  // Select a superset of columns we know how to map from.
  const { data, error } = await supabase
    .from('advisor_applications')
    .select(`
      id,
      name, full_name, first_name, last_name,
      email, phone,
      address, city, state, zip_code,
      webpage, facebook, x, linkedin, bluesky, instagram,
      professional_title, military_branch, other_branch,
      years_of_service, service_status, other_status,
      about, resume_url, headshot_url, business_logo_url,
      status, lat, lng, location
    `)
    .eq('status', 'approved')

  if (error) throw error
  return (data ?? []) as Advisor[]
}

export async function getApprovedAdvisors(): Promise<MapAdvisor[]> {
  const rows = await fetchRows()
  const mapped: MapAdvisor[] = []
  for (const r of rows) {
    const point = toLngLat(r)
    if (!point) continue // cannot plot without coords
    mapped.push({
      id: r.id,
      name: pickName(r),
      professional_title: r.professional_title ?? undefined,
      military_branch: r.military_branch ?? undefined,
      about: r.about ?? undefined,
      location: point
    })
  }
  return mapped
}

export const advisorMapService = {
  getApprovedAdvisors
}
