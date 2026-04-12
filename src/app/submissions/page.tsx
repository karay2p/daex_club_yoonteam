'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useSubmissions, useMissions } from '@/hooks/useData'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, Badge, Button, Modal, Textarea, LoadingSpinner, EmptyState } from '@/components/ui'
import { formatDateTime } from '@/lib/utils'
import { Upload, Plus, CheckCircle, User } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function SubmissionsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { submissions, loading, refetch } = useSubmissions()
  const { missions } = useMissions()
  const [showModal, setShowModal] = useState(false)
  const [selectedMission, setSelectedMission] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [filterMission, setFilterMission] = useState('all')

  const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project-id.supabase.co'

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  if (authLoading || !user) return null

  // Show all subs to admin/observer, only own to member
  const visibleSubs = user.role === 'member'
    ? submissions.filter(s => s.member_id === user.id)
    : submissions

  const filteredSubs = filterMission === 'all'
    ? visibleSubs
    : visibleSubs.filter(s => s.mission_id === filterMission)

  const activeMissions = missions.filter(m => m.status === 'active')

  const mySubmittedMissionIds = submissions
    .filter(s => s.member_id === user.id)
    .map(s => s.mission_id)

  const handleSubmit = async () => {
    if (!selectedMission || !content.trim()) return
    setSaving(true)
    if (!isDemo) {
      const supabase = createClient()
      await supabase.from('submissions').insert({
        mission_id: selectedMission,
        member_id: user.id,
        content,
      })
      refetch()
    }
    setSaving(false)
    setShowModal(false)
    setContent('')
    setSelectedMission('')
  }

  return (
    <DashboardLayout title="미션 인증">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">미션 인증</h2>
          <p className="text-gray-500 text-sm mt-1">
            {user.role === 'member' ? '내 인증 현황' : `전체 인증 ${submissions.length}건`}
          </p>
        </div>
        {user.role === 'member' && (
          <Button onClick={() => setShowModal(true)}><Plus size={16} /> 인증 제출</Button>
        )}
      </div>

      {/* Mission Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilterMission('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            filterMission === 'all' ? 'bg-brand-600 text-white' : 'bg-white text-gray-500 border border-gray-200'
          }`}
        >
          전체
        </button>
        {missions.map(m => (
          <button
            key={m.id}
            onClick={() => setFilterMission(m.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all truncate max-w-[180px] ${
              filterMission === m.id ? 'bg-brand-600 text-white' : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {m.title}
          </button>
        ))}
      </div>

      {/* Mission Completion Overview (admin/observer) */}
      {user.role !== 'member' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {activeMissions.map(mission => {
            const mSubs = submissions.filter(s => s.mission_id === mission.id)
            return (
              <Card key={mission.id} className="p-4">
                <h4 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-1">{mission.title}</h4>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>제출 현황</span>
                  <span className="font-bold text-brand-600">{mSubs.length}/9</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-gradient rounded-full" style={{ width: `${(mSubs.length / 9) * 100}%` }} />
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Submissions List */}
      {loading ? <LoadingSpinner /> : filteredSubs.length === 0 ? (
        <EmptyState
          icon={Upload}
          title="제출된 인증이 없습니다"
          description={user.role === 'member' ? '미션 인증을 제출해 보세요.' : '아직 제출된 인증이 없습니다.'}
          action={user.role === 'member' ? <Button onClick={() => setShowModal(true)}>인증 제출하기</Button> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSubs.map(sub => (
            <Card key={sub.id} className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {sub.member_name?.[0] || <User size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800 text-sm">{sub.member_name}</span>
                    <Badge variant="success"><CheckCircle size={10} className="inline mr-1" />제출 완료</Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {sub.mission_title && <span className="text-brand-600 font-medium">{sub.mission_title}</span>}
                    {' · '}{formatDateTime(sub.submitted_at)}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">{sub.content}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Submit Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="미션 인증 제출">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">미션 선택 <span className="text-red-400">*</span></label>
            <select
              value={selectedMission}
              onChange={e => setSelectedMission(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">미션을 선택하세요</option>
              {activeMissions.map(m => {
                const alreadySubmitted = mySubmittedMissionIds.includes(m.id)
                return (
                  <option key={m.id} value={m.id} disabled={alreadySubmitted}>
                    {m.title} {alreadySubmitted ? '(이미 제출됨)' : ''}
                  </option>
                )
              })}
            </select>
          </div>
          <Textarea
            label="인증 내용"
            value={content}
            onChange={setContent}
            placeholder="미션 수행 내용을 작성하세요. 구체적으로 어떤 활동을 했는지 설명해 주세요."
            rows={5}
            required
          />
          <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-600">
            💡 이미지 업로드는 Supabase Storage 연결 후 사용 가능합니다.
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={() => setShowModal(false)} variant="secondary" className="flex-1">취소</Button>
            <Button onClick={handleSubmit} disabled={saving || !selectedMission || !content.trim()} className="flex-1">
              {saving ? '제출 중...' : '인증 제출'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
