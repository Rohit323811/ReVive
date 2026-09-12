/**
 * Auth context on top of Supabase. Fully optional: when Supabase env vars are
 * missing, `mode` is 'unconfigured' and the UI shows a friendly setup panel
 * instead of crashing.
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type AuthMode = 'unconfigured' | 'loading' | 'signedOut' | 'signedIn'

interface AuthContextValue {
  mode: AuthMode
  user: User | null
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string; needsConfirmation?: boolean }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthMode>(supabase ? 'loading' : 'unconfigured')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!supabase) return

    void supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setMode(data.session ? 'signedIn' : 'signedOut')
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
      setUser(session?.user ?? null)
      setMode(session ? 'signedIn' : 'signedOut')
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      mode,
      user,
      async signIn(email, password) {
        if (!supabase) return { error: 'Supabase is not configured.' }
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        return error ? { error: error.message } : {}
      },
      async signUp(email, password) {
        if (!supabase) return { error: 'Supabase is not configured.' }
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) return { error: error.message }
        return { needsConfirmation: !data.session }
      },
      async signOut() {
        if (!supabase) return
        await supabase.auth.signOut()
      },
    }),
    [mode, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
