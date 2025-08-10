import { supabase } from '../supabaseClient';

export type SubmissionStatus = 'pending' | 'approved' | 'denied' | 'paused';

export type SubmissionInsert = {
  title: string;
  description?: string;
  url?: string;
  category?: string;
};

export async function insertSubmission(input: SubmissionInsert) {
  // Ensure user is signed in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  const payload = {
    title: input.title.trim(),
    description: input.description?.trim() ?? null,
    url: input.url?.trim() ?? null,
    category: input.category?.trim() ?? null,
    status: 'pending' as SubmissionStatus,
    // IF your RLS expects owner_email, store it too (optional based on your policy):
    owner_email: user.email,
  };

  const { data, error } = await supabase.from('submissions').insert(payload).select('*').single();
  if (error) throw error;
  return data;
}

export async function listMySubmissions() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('owner_email', user.email)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
