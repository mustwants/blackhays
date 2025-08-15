import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function AuthCallback() {
  const nav = useNavigate()

  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.slice(1))
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    async function run() {
      if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token })
      }
      // remove hash and go somewhere sensible
      history.replaceState(null, '', window.location.pathname)
      nav('/dashboard', { replace: true })
    }
    run().catch(console.error)
  }, [nav])

  return <div className="p-6">Signing you in…</div>
}
