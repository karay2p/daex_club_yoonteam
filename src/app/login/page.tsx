'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const { signIn, user } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) {
    router.replace('/dashboard')
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError(error)
      setLoading(false)
    } else {
      router.replace('/dashboard')
    }
  }

  const demoAccounts = [
    { name: '박윤영 (관리자)', email: 'admin@daex.club', role: 'admin' },
    { name: '김아람 (팀원)', email: 'aram@daex.club', role: 'member' },
    { name: '김은진 (옵저버)', email: 'director@daex.club', role: 'observer' },
  ]

  return (
    <div className="min-h-screen bg-navy-900 flex overflow-hidden">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-brand-gradient opacity-90" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-navy-900/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-white/5" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <span className="text-white font-bold">DX</span>
          </div>
          <span className="text-white font-bold text-lg">D.A.E.X. Club</span>
        </div>

        {/* Main Text */}
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white leading-tight mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>
            연결되고<br />실행되는<br />
            <span className="text-white/70">박윤영팀</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            공지, 출석, 미션, 인증, 스케줄을<br />
            하나의 플랫폼에서 관리하세요.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-8">
          {[
            { label: '팀원', value: '9명' },
            { label: '활성 미션', value: '2개' },
            { label: '이번달 출석', value: '87%' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
              <p className="text-white/50 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">DX</span>
            </div>
            <span className="font-bold text-navy-900">D.A.E.X. Club 박윤영팀</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-navy-900 mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
              로그인
            </h2>
            <p className="text-gray-500 text-sm">팀 관리 시스템에 오신 것을 환영합니다.</p>
          </div>

          {/* Demo account shortcuts */}
          <div className="mb-6 p-4 rounded-2xl bg-brand-50 border border-brand-100">
            <p className="text-xs font-semibold text-brand-700 mb-3 uppercase tracking-wider">
              🔑 데모 계정 (비밀번호: daex2024!)
            </p>
            <div className="flex flex-wrap gap-2">
              {demoAccounts.map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => { setEmail(acc.email); setPassword('daex2024!') }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white border border-brand-200 text-brand-700 font-medium hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all"
                >
                  {acc.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">이메일</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">비밀번호</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-gradient text-white font-bold text-sm shadow-lg shadow-brand-200 hover:shadow-xl hover:shadow-brand-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> 로그인 중...</>
              ) : (
                <>로그인 <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            D.A.E.X. Club 박윤영팀 전용 시스템입니다
          </p>
        </div>
      </div>
    </div>
  )
}
