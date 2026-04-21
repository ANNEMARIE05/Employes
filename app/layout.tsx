import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MUFER Employes | Gestion des Ressources Humaines',
  description: 'Plateforme moderne de gestion RH - Demandes de congés, documents, et suivi des employés',
  generator: 'Next.js',
  keywords: ['RH', 'gestion', 'employés', 'congés', 'documents', 'MUFER'],
}

export const viewport: Viewport = {
  themeColor: '#E5B800',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${geistMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="font-sans antialiased bg-background text-foreground"
      >
        <Providers>
          {children}
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
