// src/services/events/index.ts
import { supabase } from '../../lib/supabaseClient';

export type EventStatus = 'pending' | 'approved' | 'rejected' | 'paused';

export interface EventItem {
  id: string;
  name: string;
  start_date: string; // ISO
  end_date: string;   // ISO
  location?: string | null;
  website?: string | null;
  about?: string | null;
  source: 'events' | 'event_submissions';
  status?: EventStatus; // submissions only
}

function mapEventRow(row: any): EventItem {
  return {
    id: row.id,
    name: row.name ?? '',
    start_date: row.start_date,
    end_date: row.end_date,
    location: row.location ?? null,
    website: row.website ?? null,
    about: row.about ?? row.description ?? null,
    source: 'events'
  };
}

function mapSubmissionRow(row: any): EventItem {
  return {
    id: row.id,
    name: row.name ?? '',
    start_date: row.start_date,
    end_date: row.end_date,
    location: row.location ?? null,
    website: row.website ?? null,
    about: row.about ?? row.description ?? null,
    source: 'event_submissions',
    status: row.status as EventStatus
  };
}

export const eventsService = {
  /** Public feed: upcoming approved submissions + curated events, deduped & sorted. */
  async getUpcoming(): Promise<EventItem[]> {
    const nowIso = new Date().toISOString();

    const [eventsRes, subsRes] = await Promise.all([
      supabase.from('events').select('*').gte('end_date', nowIso),
      supabase
        .from('event_submissions')
        .select('*')
        .in('status', ['approved', 'pending']) // pending can be shown in admin; hide from public in your UI if needed
        .gte('end_date', nowIso)
    ]);

    if (eventsRes.error) throw new Error(eventsRes.error.message || 'Failed to fetch events');
    if (subsRes.error) throw new Error(subsRes.error.message || 'Failed to fetch submissions');

    const events = (eventsRes.data ?? []).map(mapEventRow);
    const subs = (subsRes.data ?? []).map(mapSubmissionRow);

    // Dedupe by (name + start_date)
    const seen = new Set<string>();
    const combined: EventItem[] = [];
    [...events, ...subs].forEach((e) => {
      const key = `${(e.name || '').toLowerCase()}|${e.start_date}`;
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(e);
      }
    });

    combined.sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );

    return combined;
  },

  /** Admin: update submission status (approve/pause/reject). */
  async updateSubmissionStatus(id: string, status: EventStatus): Promise<void> {
    const { error } = await supabase
      .from('event_submissions')
      .update({ status })
      .eq('id', id);

    if (error) throw new Error(error.message || 'Failed to update status');
  },

  /** Admin: delete a submission. */
  async deleteSubmission(id: string): Promise<void> {
    const { error } = await supabase
      .from('event_submissions')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message || 'Failed to delete submission');
  },

  /** Public submit: create a new event submission (defaults to pending). */
  async createSubmission(payload: Partial<EventItem>): Promise<EventItem> {
    const insert = {
      ...payload,
      status: (payload.status ?? 'pending') as EventStatus
    };
    const { data, error } = await supabase
      .from('event_submissions')
      .insert(insert)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to create submission');
    return mapSubmissionRow(data);
  },

  /** Admin curated: insert directly into events table. */
  async createEvent(payload: Partial<EventItem>): Promise<EventItem> {
    const { data, error } = await supabase
      .from('events')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to create event');
    return mapEventRow(data);
  }
};

export default eventsService;
