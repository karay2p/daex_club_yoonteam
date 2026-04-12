'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useAttendance, useMembers } from '@/hooks/useData'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, Button, LoadingSpinner, Badge } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { CheckSquare, Check, X, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { MOCK_ATTENDANCE } from '@/lib/mock-data'

export default function AttendancePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const { attendance, loading, refetch } = useAttendance(selectedDate)
  const { members } = useMembers()
  const [checking, setChecking] = useState(false)
  const [localAttendance, setLocalAttendance] = useState<string[]>([])

  const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project-id.supabase.co'

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (isDemo) {
      setLocalAttendance(MOCK_ATTENDANCE.filter(a => a.date === selectedDate).map(a => a.member_id))
    }
  }, [selectedDate, isDemo])

  if (authLoading || !user) return null

  const teamMembers = members.filter(m => m.role === 'member')

  const checkedIds = isDemo
    ? localAttendance
    : attendance.map(a => a.member_id)

  const isChecked = checkedIds.includes(user.id)

  const handleCheckIn = async () => {
    if (isChecked || user.role === 'observer') return
    setChecking(true)

    if (isDemo) {
      setLocalAttendance(prev => [...prev, user.id])
      setChecking(false)
      return
    }

    const supabase = createClient()
    await supabase.from('attendance').insert({
      member_id: user.id,
      date: today,
      checked_at: new Date().toISOString(),
    })
    refetch()
    setChecking(false)
  }

  const checkedCount = checkedIds.length
  const totalCount = teamMembers.length
  const rate = totalCount === 0 ? 0 : Math.round((checkedCount / totalCount) * 100)

  // Generate past week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  }).reverse()

  return (
    <DashboardLayout title="출석 체크">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy-900">출석 체크</h2>
        <p className="text-gray-500 text-sm mt-1">{formatDate(selectedDate)} 출석 현황</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Check-in + Stats */}
        <div className="space-y-5">
          {/* My Check-in */}
          {user.role === 'member' && (
            <Card className="p-6 text-center">
              <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl transition-all duration-500 ${
                isChecked ? 'bg-brand-gradient shadow-lg shadow-brand-200' : 'bg-gray-100'
              }`}>
                {isChecked ? '✓' : '?'}
              </div>
              <h3 className="font-bold text-navy-900 mb-1">{user.name}</h3>
              <p className="text-sm text-gray-500 mb-4">
                {isChecked ? '오늘 출석 완료!' : '아직 출석하지 않았습니다'}
              </p>
              <Button
                onClick={handleCheckIn}
                disabled={isChecked || checking || selectedDate !== today}
                className="w-full"
                variant={isChecked ? 'secondary' : 'primary'}
              >
                {isChecked ? (
                  <><Check size={16} /> 출석 완료</>
                ) : checking ? (
                  '처리 중...'
                ) : selectedDate !== today ? (
                  '오늘만 체크 가능'
                ) : (
                  <><CheckSquare size={16} /> 출석 체크하기</>
                )}
              </Button>
            </Card>
          )}

          {/* Stats Card */}
          <Card className="p-5">
            <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
              <CheckSquare size={16} className="text-brand-600" />
              출석 통계
            </h3>
            <div className="text-center mb-4">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="url(#grad)" strokeWidth="3"
                    strokeDasharray={`${rate} ${100 - rate}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-navy-900">{rate}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">{checkedCount}/{totalCount}명 출석</p>
            </div>
          </Card>

          {/* Date Selector */}
          <Card className="p-4">
            <h3 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-2">
              <Calendar size={15} className="text-brand-500" />날짜 선택
            </h3>
            <div className="grid grid-cols-7 gap-1">
              {weekDates.map(d => {
                const dayLabel = new Date(d).toLocaleDateString('ko-KR', { weekday: 'narrow' })
                const dayNum = new Date(d).getDate()
                const isToday = d === today
                const isSelected = d === selectedDate
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`flex flex-col items-center py-2 rounded-xl text-xs transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : isToday
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <span className="text-[10px] mb-0.5">{dayLabel}</span>
                    <span className="font-bold">{dayNum}</span>
                  </button>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Right: Member list */}
        <div className="lg:col-span-2">
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-navy-900">팀원 출석 현황</h3>
              <span className="text-sm text-gray-400">{formatDate(selectedDate)}</span>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? <LoadingSpinner /> : teamMembers.map(member => {
                const checked = checkedIds.includes(member.id)
                return (
                  <div key={member.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/70 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      checked ? 'bg-brand-gradient text-white shadow-sm' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {member.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.email}</p>
                    </div>
                    <div>
                      {checked ? (
                        <Badge variant="success">
                          <Check size={11} className="inline mr-1" />출석
                        </Badge>
                      ) : (
                        <Badge variant="default">
                          <X size={11} className="inline mr-1" />미출석
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
