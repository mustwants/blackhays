// src/pages/Submit.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import LoginGate from '../components/LoginGate';

type SubmissionRow = {
  id: string;
  created_at: string;
  status: 'pending' | 'approved' | 'denied' | 'paused';
  payload: { title?: string; description?: string | null };
};

export default function SubmitPage() {
  const [sessionReady, setSessionReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  // Detect session
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const sess = data.session;
      setLoggedIn(!!sess);
      setEmail(sess?.user.email ?? null);
      setSessionReady(true);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, sess) => {
      setLoggedIn(!!sess);
      setEmail(sess?.user.email ?? null);
      if (sess) await loadMySubmissions();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Load my submissions (RLS filters by user_id)
  const loadMySubmissions = async () => {
    setLoadErr(null);
    const { data, error } = await supabase
      .from('submissions')
      .select('id,created_at,status,payload')
      .order('created_at', { ascending: false });

    if (error) {
      setLoadErr(error.message);
      setRows([]);
      return;
    }
    setRows((data ?? []) as SubmissionRow[]);
  };

  useEffect(() => {
    if (loggedIn) loadMySubmissions();
  }, [loggedIn]);

  // Create a submission
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveErr(null);

    if (!title.trim()) {
      setSaveErr('Title is required.');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('submissions')
        .insert({
          status: 'pending',
          payload: {
            title: title.trim(),
            description: description.trim() || null,
          },
        })
        .select()
        .single();

      if (error) throw error;

      setTitle('');
      setDescription('');
      await loadMySubmissions();
    } catch (err: any) {
      setSaveErr(err?.message || 'Failed to create submission.');
    } finally {
      setSaving(false);
    }
  };

  if (!sessionReady) return <div className="p-4">Checking session…</div>;

  if (!loggedIn) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-16">
        <LoginGate />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-16">
      <h1 className="text-2xl font-bold mb-3">Submit</h1>
      <p className="text-sm text-gray-600 mb-6">Signed in as: <b>{email}</b></p>

      <form onSubmit={handleCreate} className="p-4 border rounded-lg bg-white mb-6">
        <label className="block text-sm mb-1">Title</label>
        <input
          className="w-full border rounded px-3 py-2 mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Short, descriptive title"
          required
        />

        <label className="block text-sm mb-1">Description (optional)</label>
        <textarea
          className="w-full border rounded px-3 py-2 mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details"
          rows={4}
        />

        {saveErr && <p className="text-red-600 text-sm mb-2">{saveErr}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-bhred text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Create submission'}
        </button>
      </form>

      <div className="p-4 border rounded-lg bg-white">
        <h2 className="text-lg font-semibold mb-3">My submissions</h2>
        {loadErr && <p className="text-red-600 text-sm mb-3">{loadErr}</p>}
        {rows.length === 0 ? (
          <p className="text-sm text-gray-600">No submissions yet.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((r) => (
              <li key={r.id} className="p-3 border rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{r.payload?.title || '(untitled)'}</div>
                    {r.payload?.description && (
                      <div className="text-sm text-gray-700">{r.payload.description}</div>
                    )}
                  </div>
                  <span className="text-xs uppercase tracking-wide">{r.status}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(r.created_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
