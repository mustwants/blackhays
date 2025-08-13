// src/pages/Submit.tsx
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function SubmitPage() {
  const { user, sendMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null); setMsg(null)
    if (!email.trim()) { setErr('Enter your work email.'); return }
    setSending(true)
    const { error } = await sendMagicLink(email, '/submit')
    setSending(false)
    if (error) setErr(error)
    else setMsg('Check your inbox for a sign-in link.')
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-2">Sign in</h1>
        <p className="text-gray-600 mb-6">Use your work email and we’ll email you a secure sign-in link.</p>

        {!user && (
          <form onSubmit={onSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@blackhaysgroup.com"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bhred"
              />
            </div>

            {err && <div className="text-sm text-red-600">{err}</div>}
            {msg && <div className="text-sm text-green-700">{msg}</div>}

            <button
              type="submit"
              disabled={sending}
              className="w-full py-2 rounded-lg bg-bhred text-white font-semibold disabled:opacity-60"
            >
              {sending ? 'Sending…' : 'Email me a magic link'}
            </button>

            <p className="text-xs text-gray-500 mt-2">
              By continuing you agree to the Terms and acknowledge the Privacy Policy.
            </p>
            <p className="text-[11px] text-gray-400 mt-2">Powered by Supabase · Problems signing in? contact support</p>
          </form>
        )}

        {user && (
          <div className="text-green-700">
            You’re signed in as <strong>{user.email}</strong>. You can submit and manage your items now.
          </div>
        )}
      </div>
    </div>
  )
}


