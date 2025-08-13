import { useState, useMemo } from 'react';
import { supabase } from '../supabaseClient';

export default function SubmitPage() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const redirectTo = useMemo(() => {
    return `${window.location.origin}/submit`;
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setErr('Please enter your work email.');
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) {
        if ((error as any)?.status === 422) {
          setErr(
            'Sign-in link blocked: this site URL is not allowed in Supabase Auth redirect URLs. Add your domain and Netlify preview hosts under “Additional Redirect URLs”.'
          );
        } else {
          setErr(error.message || 'Failed to send the magic link.');
        }
        return;
      }

      setMsg('Check your inbox—your secure sign-in link is on the way.');
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to send the magic link.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white flex items-start md:items-center justify-center">
      <div className="w-full max-w-md mx-4 my-10 md:my-0">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-1">Sign in</h1>
          <p className="text-gray-600 mb-6">
            Use your work email and we’ll email you a secure sign-in link.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Work email
              </label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-bhred focus:ring-bhred"
                placeholder="you@blackhaysgroup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {err && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                {err}
              </div>
            )}
            {msg && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-bhred text-white font-semibold rounded-md hover:bg-red-700 disabled:opacity-60"
            >
              {sending ? 'Sending…' : 'Email me a magic link'}
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-500">
            By continuing you agree to the Terms and acknowledge the Privacy Policy.
          </p>

          <div className="mt-4 text-[11px] text-gray-400">
            Powered by Supabase · Problems signing in? contact support
          </div>
        </div>
      </div>
    </div>
  );
}

