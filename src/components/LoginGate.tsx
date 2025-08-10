import { ReactNode, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function LoginGate({ children, requireAdmin = false }: { children: ReactNode, requireAdmin?: boolean }) {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const run = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData.session?.user
      if (!user) { setAllowed(false); setLoading(false); return }
      if (!requireAdmin) { setAllowed(true); setLoading(false); return }
      const { data, error } = await supabase.from('admins').select('email').eq('email', user.email).maybeSingle()
      if (error) console.error(error)
      setAllowed(!!data); setLoading(false)
    }
    run()
  }, [requireAdmin])

  if (loading) return <div className="card"><p>Loading…</p></div>
  if (!allowed) return <AuthCard />
  return <>{children}</>
}

function AuthCard() {
  const emailLogin = async (e: any) => {
    e.preventDefault()
    const email = e.target.email.value
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/submit' }
    })
    if (error) alert(error.message); else alert('Check your inbox for a login link.')
  }
  return (
    <div className="card">
      <h3>Sign in</h3>
      <form onSubmit={emailLogin} className="row" style={{flexDirection:'column', gap:12}}>
        <input type="email" name="email" placeholder="you@blackhaysgroup.com" required />
        <button type="submit">Send magic link</button>
      </form>
    </div>
  )
}
