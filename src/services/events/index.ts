// src/services/events/index.ts
import { supabase, isConnected } from '../../lib/supabaseClient'

export type EventStatus = 'pending' | 'approved' | 'paused' | 'rejected'

export interface EventRecord {
  id: string
  name?: string // "events" table
  title?: string // fallback
  start_date?: string | null
  end_date?: string | null
  location?: string | null
  website?: string | null
  about?: string | null
  status?: EventStatus | null
}

export interface CalendarEvent {
  id: string
  name: string
  start_date: string
  end_date: string
  location?: string
  website?: string
  about?: string
  status: EventStatus
  source: 'events' | 'event_submissions'
}

function toName(r: EventRecord): string {
  return (r.name ?? r.title ?? 'Untitled').trim()
}

function normalize(r: EventRecord, source: CalendarEvent['source']): CalendarEvent | null {
  const start = r.start_date ? new Date(r.start_date) : null
  const end = r.end_date ? new Date(r.end_date) : null
  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) return null

  return {
    id: r.id,
    name: toName(r),
    start_date: start.toISOString(),
    end_date: end.toISOString(),
    location: r.location ?? undefined,
    website: r.website ?? undefined,
    about: r.about ?? undefined,
    status: (r.status ?? 'pending') as EventStatus,
    source
  }
}

export async function getUpcomingEvents(): Promise<CalendarEvent[]> {
  if (!isConnected()) throw new Error('Supabase is not configured')

  const nowIso = new Date().toISOString()

  const [eventsRes, subsRes] = await Promise.all([
    supabase.from('events')
      .select('*')
      .gte('end_date', nowIso),
    supabase.from('event_submissions')
      .select('*')
      .in('status', ['approved', 'pending'])
      .gte('end_date', nowIso)
  ])

  if (eventsRes.error) throw eventsRes.error
  if (subsRes.error) throw subsRes.error

  const normalized = [
    ...(eventsRes.data ?? []).map(r => normalize(r as EventRecord, 'events')),
    ...(subsRes.data ?? []).map(r => normalize(r as EventRecord, 'event_submissions'))
  ].filter(Boolean) as CalendarEvent[]

  // De-dup by (website || name+start_date)
  const seen = new Set<string>()
  const unique: CalendarEvent[] = []
  for (const e of normalized) {
    const key = e.website || `${e.name}|${e.start_date}`
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(e)
    }
  }

  unique.sort((a, b) =>
    new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  )

  return unique
}

export const eventsService = {
  getEvents: getUpcomingEvents,
  getUpcomingEvents
}
