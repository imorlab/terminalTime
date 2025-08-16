import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'TerminalTime - Historia de la Programación en tu Terminal',
  description: 'Descubre efemérides de programación, noticias tech y clima en una interfaz terminal. Historia diaria del desarrollo de software y tecnología.',
  keywords: ['programación', 'historia', 'tecnología', 'efemérides', 'desarrollo', 'terminal', 'tech news'],
  authors: [{ name: 'TerminalTime' }],
  openGraph: {
    title: 'TerminalTime - Historia de la Programación',
    description: 'Tu dosis diaria de historia tech en una terminal minimalista',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TerminalTime',
    description: 'Historia de la programación en tu terminal',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <main className="min-h-screen bg-terminal-bg">
          {children}
        </main>
      </body>
    </html>
  )
}
