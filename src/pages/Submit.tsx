// src/pages/Submit.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import LoginGate from '../components/LoginGate';

type SubmissionRow = {
  id: string;
  title: string;
  description: string | null;
  // Make these optional so we don't 400 if the columns don't exist yet
  status?: 'pending' | 'approved' | 'denied' | 'paused';
  created_at?: string;
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

  // --- Session detection on mount + on auth state changes ---
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const hasSession = !!data.session;
      setLoggedIn(hasSession);
      setEmail(data.session?.user.email ?? null);
      setSessionReady(true);
      if (hasSession) {
        await loadMySubmissions();
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, sess) => {
      setLoggedIn(!!sess);
      setEmail(sess?.user.email ?? null);
      if (sess) {
        await loadMySubmissions();
      } else {
        setRows([]);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // --- Load my submissions with safe select + safe ordering ---
  const loadMySubmissions = async () => {
    setLoadErr(null);

    // Start broad to avoid 400 when columns are missing.
    const base = supabase.from('submissions').select('*').limit(50);

    // Try ordering by created_at; if backend 400s on unknown column, fall back to id.
    let { data, error } = await base.order('created_at', { ascending: false });

    if (error && /column .*created_at/i.test(error.message)) {
      ({ data, error } = await base.order('id', { ascending: false }));
    }

    if (error) {
      setLoadErr(error.message);
      setRows([]);
      return;
    }

    setRows((data ?? []) as SubmissionRow[]);
  };

  useEffect(() => {
    if (loggedIn) {
      loadMySubmissions();
    }
  }, [loggedIn]);

  // --- Insert a new submission (only columns guaranteed to exist) ---
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveErr(null);

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle) {
      setSaveErr('Title is required.');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('submissions')
        .insert({
          title: trimmedTitle,
          description: trimmedDesc || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Clear form + refresh list
      setTitle('');
      setDescription('');
      await loadMySubmissions();
    } catch (err: any) {
      setSaveErr(err?.message || 'Failed to create submission.');
    } finally {
      setSaving(false);
    }
  };

  // --- UI ---

  // Before session detection finishes
  if (!sessionReady) {
    return <div className="p-4">Checking session…</div>;
  }

  // If not logged in, show login gate
  if (!loggedIn) {
    return (
      <div className="p-6">
        <LoginGate />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-3">Submit</h1>
      <p className="text-sm text-gray-600 mb-6">
        Signed in as: <b>{email}</b>
      </p>

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
                    <div className="font-medium">{r.title}</div>
                    {r.description && (
                      <div className="text-sm text-gray-700">{r.description}</div>
                    )}
                  </div>
                  <span className={`badge ${r.status ?? 'pending'}`}>
                    {r.status ?? 'pending'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {r.created_at ? new Date(r.created_at).toLocaleString() : '—'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

