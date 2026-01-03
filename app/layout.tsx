import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientProviders from '@/components/ClientProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MCU Tracker - Maratone até Vingadores: Doomsday',
  description: 'Acompanhe sua jornada pelo Universo Cinematográfico Marvel em ordem cronológica ou de lançamento. Marque filmes e séries como assistidos e prepare-se para Vingadores: Doomsday!',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MCU Tracker',
  },
  openGraph: {
    title: 'MCU Tracker - Maratona Marvel',
    description: 'Acompanhe sua maratona do MCU até Vingadores: Doomsday',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCU Tracker - Maratona Marvel',
    description: 'Acompanhe sua maratona do MCU até Vingadores: Doomsday',
  },
  keywords: ['MCU', 'Marvel', 'Vingadores', 'Doomsday', 'Maratona', 'Filmes', 'Séries', 'Disney+'],
}

export const viewport: Viewport = {
  themeColor: '#E62429',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
