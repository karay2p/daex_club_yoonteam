import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'D.A.E.X. Club | 박윤영 팀',
  description: 'D.A.E.X. Club 박윤영팀 — 연결되고 실행되는 팀',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
