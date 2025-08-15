import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

type Props = {
  /**
   * If your NavBar is ~64px tall, this keeps the card perfectly centered
   * in the remaining viewport height. Adjust if your header is taller.
   */
  headerHeightPx?: number;
  /** Where to send users after they click the magic link */
  redirectPath?: string;
  /** Placeholder & validation hint */
  companyDomainHint?: string; // e.g. "you@blackhaysgroup.com"
  title?: string;
  subtitle?: string;
};

export default function LoginGate({
  headerHeightPx = 128,
  redirectPath = '/submit',
  companyDomainHint = 'you@blackhaysgroup.com',
  title = 'Sign in',
  subtitle = 'Use your work email and we’ll email you a secure sign-in link.',
}: Props) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Small nicety: if already signed in, show a friendly note
  const [isAuthed, setIsAuthed] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(!!data.session);
    });
  }, []);

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setErr('Email is required.');
      return;
    }
    // basic format check (does not block valid edge cases)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErr('Enter a valid email address.');
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectPath}`,
        },
      });
      if (error) throw error;
      setMsg('Check your inbox for a sign-in link. It expires shortly.');
    } catch (e: any) {
      setErr(e?.message || 'Failed to send sign-in link.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      className="bg-gray-50"
      style={{
        minHeight: `calc(100vh - ${headerHeightPx}px)`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid place-items-center h-full py-8">
          <div className="w-full max-w-md">
            {/* Brand / Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
              <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
            </div>

            {/* Card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
              {isAuthed && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                  You’re already signed in. You can continue using the app.
                </div>
              )}

              <form onSubmit={sendMagicLink} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Work email
                  </label>
                  <input
                    id="email"
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-bhred focus:ring-2 focus:ring-bhred"
                    type="email"
                    placeholder={companyDomainHint}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                {err && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {err}
                  </div>
                )}
                {msg && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                    {msg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-bhred px-4 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
                >
                  {sending ? 'Sending…' : 'Email me a magic link'}
                </button>
              </form>

              {/* Fine print */}
              <p className="mt-4 text-xs text-gray-500 text-center">
                By continuing you agree to the Terms and acknowledge the Privacy Policy.
              </p>
            </div>

            {/* Footer note */}
            <p className="mt-6 text-center text-xs text-gray-400">
              Powered by Supabase · Problems signing in? <span className="text-gray-600">contact support</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
