import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { insertSubmission, listMySubmissions } from '../lib/submissions';

type SRow = {
  id: string;
  title: string;
  description?: string | null;
  status: 'pending' | 'approved' | 'denied' | 'paused';
  created_at?: string;
};

export default function SubmitPage() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const [rows, setRows] = useState<SRow[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Watch session
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      setUserEmail(session?.user?.email ?? null);
      setSessionReady(true);
    })();

    const { data: authSub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => { authSub.subscription.unsubscribe(); mounted = false; };
  }, []);

  // load my rows if logged in
  useEffect(() => {
    if (!userEmail) return;
    (async () => {
      try {
        const data = await listMySubmissions();
        setRows(data as any);
      } catch (err: any) {
        setErrorMsg(err?.message || 'Failed to load submissions');
      }
    })();
  }, [userEmail]);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    try {
      setSending(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: window.location.origin + '/submit' },
      });
      if (error) throw error;
      alert('Check your email for the login link.');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send magic link');
    } finally {
      setSending(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    if (!title.trim()) {
      setErrorMsg('Title is required');
      return;
    }
    try {
      setSaving(true);
      await insertSubmission({ title, description });
      setTitle('');
      setDescription('');
      const data = await listMySubmissions();
      setRows(data as any);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Insert failed');
    } finally {
      setSaving(false);
    }
  }

  if (!sessionReady) {
    return <div className="p-6">Loading…</div>;
  }

  if (!userEmail) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Sign in to submit</h1>
        {errorMsg && <div className="mb-3 text-red-600">{errorMsg}</div>}
        <form onSubmit={sendMagicLink} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@blackhaysgroup.com"
            className="w-full border rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={sending}
            className="bg-bhred text-white px-4 py-2 rounded"
          >
            {sending ? 'Sending…' : 'Send Magic Link'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">New Submission</h1>
        <p className="text-sm text-gray-600">Signed in as {userEmail}</p>
      </div>

      {errorMsg && <div className="text-red-600">{errorMsg}</div>}

      <form onSubmit={handleCreate} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Short title"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Optional details"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-bhred text-white px-4 py-2 rounded"
        >
          {saving ? 'Saving…' : 'Create Submission'}
        </button>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-2">My submissions</h2>
        {rows.length === 0 && <div className="text-gray-600">No submissions yet.</div>}
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.id} className="border rounded p-3">
              <div className="font-medium">{r.title}</div>
              <div className="text-sm text-gray-600">{r.description}</div>
              <div className="text-xs mt-1">Status: <span className="badge pending">{r.status}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
