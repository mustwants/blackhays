// src/components/LoginGate.tsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function LoginGate() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (!email.trim()) {
      setErr('Email is required.');
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/submit`,
        },
      });
      if (error) throw error;
      setMsg('Check your email for a magic link.');
    } catch (e: any) {
      setErr(e?.message || 'Failed to send magic link.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={sendMagicLink} className="p-4 border rounded bg-white">
      <h2 className="text-lg font-semibold mb-3">Company Email</h2>
      <input
        className="w-full border rounded px-3 py-2 mb-3"
        type="email"
        placeholder="you@blackhaysgroup.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {err && <p className="text-red-600 text-sm mb-2">{err}</p>}
      {msg && <p className="text-green-600 text-sm mb-2">{msg}</p>}
      <button
        type="submit"
        disabled={sending}
        className="bg-bhred text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {sending ? 'Sending…' : 'Send magic link'}
      </button>
    </form>
  );
}
