// src/components/LoginGate.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

type Props = {
  children?: React.ReactNode;
  requireAdmin?: boolean;          // when true, user must be admin to see children
  fallback?: React.ReactNode;      // optional UI when blocked (not signed in / not admin)
  redirectTo?: string;             // where magic-link sends the user after login
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

  // Existing form state (preserved)
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Load session + (optionally) admin status
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
      const { data: listener } = supabase.auth.onAuthStateChange((_evt, _sess) => {
        refresh();
      });
      unsub = () => listener.subscription.unsubscribe();
    })();
    return () => { if (unsub) unsub(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requireAdmin]);

  // === Existing magic-link flow (unchanged UI & behavior) ===
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

  // === Render logic ===
  if (!ready) return <div>Loading…</div>;

  // Signed out → show your existing email form (preserves design)
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

  // Signed in but admin required and caller is NOT admin
  if (requireAdmin && !isAdmin) {
    return fallback ?? (
      <div className="p-4 border rounded bg-white">
        Not authorized. Admin access required.
      </div>
    );
  }

  // Signed in (and admin if required) → render children normally
  return <>{children ?? fallback ?? null}</>;
}
