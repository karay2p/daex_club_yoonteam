'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Notice, Schedule, Mission, Submission, Attendance, Profile } from '@/types'
import { MOCK_NOTICES, MOCK_SCHEDULES, MOCK_MISSIONS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE, MOCK_PROFILES } from '@/lib/mock-data'

const isSupabaseConfigured = () =>
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co'

// ---- Notices ----
export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotices = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setNotices(MOCK_NOTICES)
      setLoading(false)
      return
    }
    const supabase = createClient()
    const { data } = await supabase.from('notices').select('*, profiles(name)').order('created_at', { ascending: false })
    if (data) {
      setNotices(data.map((n: any) => ({ ...n, author_name: n.profiles?.name })))
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchNotices() }, [fetchNotices])
  return { notices, loading, refetch: fetchNotices }
}

// ---- Schedules ----
export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSchedules = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setSchedules(MOCK_SCHEDULES)
      setLoading(false)
      return
    }
    const supabase = createClient()
    const { data } = await supabase.from('schedules').select('*').order('start_date', { ascending: true })
    if (data) setSchedules(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchSchedules() }, [fetchSchedules])
  return { schedules, loading, refetch: fetchSchedules }
}

// ---- Missions ----
export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMissions = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setMissions(MOCK_MISSIONS)
      setLoading(false)
      return
    }
    const supabase = createClient()
    const { data } = await supabase.from('missions').select('*').order('created_at', { ascending: false })
    if (data) setMissions(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchMissions() }, [fetchMissions])
  return { missions, loading, refetch: fetchMissions }
}

// ---- Submissions ----
export function useSubmissions(missionId?: string, memberId?: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSubmissions = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      let data = MOCK_SUBMISSIONS
      if (missionId) data = data.filter(s => s.mission_id === missionId)
      if (memberId) data = data.filter(s => s.member_id === memberId)
      setSubmissions(data)
      setLoading(false)
      return
    }
    const supabase = createClient()
    let query = supabase.from('submissions').select('*, profiles(name), missions(title)')
    if (missionId) query = query.eq('mission_id', missionId)
    if (memberId) query = query.eq('member_id', memberId)
    const { data } = await query.order('submitted_at', { ascending: false })
    if (data) {
      setSubmissions(data.map((s: any) => ({ ...s, member_name: s.profiles?.name, mission_title: s.missions?.title })))
    }
    setLoading(false)
  }, [missionId, memberId])

  useEffect(() => { fetchSubmissions() }, [fetchSubmissions])
  return { submissions, loading, refetch: fetchSubmissions }
}

// ---- Attendance ----
export function useAttendance(date?: string) {
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAttendance = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      const today = new Date().toISOString().split('T')[0]
      let data = MOCK_ATTENDANCE
      if (date) data = data.filter(a => a.date === date)
      setAttendance(data)
      setLoading(false)
      return
    }
    const supabase = createClient()
    let query = supabase.from('attendance').select('*, profiles(name)')
    if (date) query = query.eq('date', date)
    const { data } = await query.order('checked_at', { ascending: false })
    if (data) {
      setAttendance(data.map((a: any) => ({ ...a, member_name: a.profiles?.name })))
    }
    setLoading(false)
  }, [date])

  useEffect(() => { fetchAttendance() }, [fetchAttendance])
  return { attendance, loading, refetch: fetchAttendance }
}

// ---- Members ----
export function useMembers() {
  const [members, setMembers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setMembers(MOCK_PROFILES)
      setLoading(false)
      return
    }
    const supabase = createClient()
    supabase.from('profiles').select('*').order('role').then(({ data }) => {
      if (data) setMembers(data)
      setLoading(false)
    })
  }, [])

  return { members, loading }
}
