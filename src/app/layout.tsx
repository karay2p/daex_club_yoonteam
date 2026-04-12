import type { Metadata } from 'next'
import { AuthProvider } from '@/hooks/useAuth'
import './globals.css'

export const metadata: Metadata = {
  title: 'D.A.E.X. Club 박윤영팀',
  description: '연결되고 실행되는 D.A.E.X. Club 박윤영팀 관리 시스템',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
