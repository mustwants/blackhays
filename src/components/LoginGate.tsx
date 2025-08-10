// src/components/LoginGate.tsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function LoginGate() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAllowedDomain = (addr: string) =>
    addr.toLowerCase().endsWith('@blackhaysgroup.com');

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAllowedDomain(email)) {
      setError('Use your @blackhaysgroup.com email.');
      return;
    }

    setSending(true);
    try {
const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `${window.location.protocol}//localhost:5191/submit`,
  },
});

      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to send magic link.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-md mx-auto p-4 border rounded-lg bg-white">
        <h2 className="text-lg font-semibold mb-2">Check your email</h2>
        <p>We sent a magic link to <b>{email}</b>. Click it, and you’ll come back to this page.</p>
      </div>
    );
  }

  return (
    <form onSubmit={sendMagicLink} className="max-w-md mx-auto p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-semibold mb-4">Sign in</h2>
      <label className="block text-sm mb-1">Company Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-3"
        placeholder="you@blackhaysgroup.com"
        required
      />
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
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
