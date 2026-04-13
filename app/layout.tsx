import type { Metadata } from 'next'
import { AuthProvider } from '@/hooks/useAuth'
import './globals.css'

export const metadata: Metadata = {
  title: 'D.A.E.X. Club 박윤영팀',
  description: '연결되고 실행되는 D.A.E.X. Club 박윤영팀 관리 시스템',
  openGraph: {
    title: 'D.A.E.X. Club 박윤영팀',
    description: '연결되고 실행되는 D.A.E.X. Club 박윤영팀 관리 시스템',
    url: 'https://daex-yoonteam.vercel.app',
    siteName: 'D.A.E.X. Club 박윤영팀',
    images: [
      {
        url: 'https://zukcaxtkikuecgjkzjjt.supabase.co/storage/v1/object/public/notices/og-image.png.png',
        width: 1200,
        height: 630,
        alt: 'D.A.E.X. Club 박윤영팀',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
