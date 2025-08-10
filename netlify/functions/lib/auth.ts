import type { HandlerEvent } from '@netlify/functions';
import { supabaseAdmin } from './supabase';

export type AuthedUser = {
  id: string;
  email?: string | null;
  is_admin: boolean;
};

async function getBearerToken(event: HandlerEvent): Promise<string | null> {
  const auth = event.headers.authorization || event.headers.Authorization;
  if (auth && auth.startsWith('Bearer ')) return auth.substring('Bearer '.length);
  // Fallback: cookie from Supabase JS (optional)
  const cookie = event.headers.cookie || '';
  const match = cookie.match(/sb-access-token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function requireUser(event: HandlerEvent): Promise<AuthedUser> {
  const token = await getBearerToken(event);
  if (!token) throw new Error('Missing bearer token.');

  const { data: userRes, error: userErr } = await supabaseAdmin.auth.getUser(token);
  if (userErr || !userRes?.user) throw new Error('Invalid or expired token.');

  const user = userRes.user;
  // Lookup profile to check admin flag
  const { data: profile, error: profileErr } = await supabaseAdmin
    .from('profiles')
    .select('id, email, is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (profileErr) throw new Error('Profile lookup failed.');

  // If profile doesn’t exist yet, create a minimal one
  if (!profile) {
    const { error: upsertErr } = await supabaseAdmin
      .from('profiles')
      .upsert({ id: user.id, email: user.email ?? null, is_admin: false }, { onConflict: 'id' });
    if (upsertErr) throw new Error('Profile bootstrap failed.');
    return { id: user.id, email: user.email, is_admin: false };
  }

  return { id: profile.id, email: profile.email, is_admin: !!profile.is_admin };
}

export async function requireAdmin(event: HandlerEvent): Promise<AuthedUser> {
  const me = await requireUser(event);
  if (!me.is_admin) throw new Error('Admin privileges required.');
  return me;
}

