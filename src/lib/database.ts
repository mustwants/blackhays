// src/lib/database.ts
import { supabase, isConnected } from './supabaseClient';

// Re-export a stable surface the rest of the app can rely on
export { supabase as db, isConnected };

// Simple helpers used by services/*
export function fetchSubmissions<T>(table: string) {
  return supabase.from(table).select('*');
}

export function fetchApprovedSubmissions<T>(table: string) {
  return supabase.from(table).select('*').eq('status', 'approved');
}

export function createSubmission<T>(table: string, payload: Partial<T>) {
  return supabase.from(table).insert(payload).select().single();
}

export function updateSubmissionStatus(table: string, id: string, status: string) {
  return supabase.from(table).update({ status }).eq('id', id).select().single();
}

export function deleteSubmission(table: string, id: string) {
  return supabase.from(table).delete().eq('id', id);
}
