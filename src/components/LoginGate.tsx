// src/components/LoginGate.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

type Props = {
  children?: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
};

export default function LoginGate({
  children,
  requireAdmin = false,
  fallback,
  redirectTo = '/submit',
}: Props) {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Magic link form state (kept simple)
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const refresh = async () => {
    setErr(null);
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      setSignedIn(false);
      setIsAdmin(false);
      setReady(true);
      return;
    }
    const session = data.session;
    const isSignedIn = !!session;
    setSignedIn(isSignedIn);

    if (isSignedIn && requireAdmin) {
      const { data: adminVal, error: adminErr } = await supabase.rpc('me_is_admin');
      if (adminErr) {
        setIsAdmin(false);
      } else {
        setIsAdmin(!!adminVal);
      }
    } else {
      setIsAdmin(false);
    }
    setReady(true);
  };

  useEffect(() => {
    let unsub: (() => void) | undefined;
    (async () => {
      await refresh();
      const { data: listener } = supabase.auth.onAuthStateChange(() => {
        refresh();
      });
      unsub = () => listener.subscription.unsubscribe();
    })();
    return () => { if (unsub) unsub(); };
  }, [requireAdmin]);

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
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
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

  if (!ready) return <div>Loading…</div>;

  if (!signedIn) {
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
        {fallback && <div className="mt-3">{fallback}</div>}
      </form>
    );
  }

  if (requireAdmin && !isAdmin) {
    return fallback ?? (
      <div className="p-4 border rounded bg-white">
        Not authorized. Admin access required.
      </div>
    );
  }

  return <>{children ?? fallback ?? null}</>;
}
