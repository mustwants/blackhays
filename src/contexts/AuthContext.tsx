// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

type Ctx = {
  user: User | null
  session: Session | null
  isLoading: boolean
  sendMagicLink: (email: string, redirectPath?: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<Ctx | undefined>(undefined)

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
      setUser(data.session?.user ?? null)
      setIsLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, ses) => {
      setSession(ses)
      setUser(ses?.user ?? null)
      setIsLoading(false)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const sendMagicLink: Ctx['sendMagicLink'] = async (email, redirectPath = '/submit') => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}${redirectPath}` },
      })
      return error ? { error: error.message } : {}
    } catch (e: any) {
      return { error: e?.message ?? 'Failed to send magic link' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, sendMagicLink, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

