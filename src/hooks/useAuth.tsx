'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase'
import { Profile } from '@/types'
import { MOCK_PROFILES } from '@/lib/mock-data'

type AuthContextType = {
  user: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co'

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // 데모 모드: 로컬 스토리지에서 사용자 복원
      const saved = localStorage.getItem('daex_demo_user')
      if (saved) {
        try {
          setUser(JSON.parse(saved))
        } catch {}
      }
      setLoading(false)
      return
    }

    const supabase = createClient()

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setUser(data)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setUser(data)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [isSupabaseConfigured])

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      // 데모 모드 로그인
      const found = MOCK_PROFILES.find(p => p.email === email)
      if (found && password === 'daex2024!') {
        setUser(found)
        localStorage.setItem('daex_demo_user', JSON.stringify(found))
        return { error: null }
      }
      return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('daex_demo_user')
      setUser(null)
      return
    }
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
