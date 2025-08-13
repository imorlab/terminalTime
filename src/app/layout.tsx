import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TerminalTime - Historia de la Programación en tu Terminal',
  description: 'Descubre efemérides de programación, noticias tech y clima en una interfaz terminal. Historia diaria del desarrollo de software y tecnología.',
  keywords: ['programación', 'historia', 'tecnología', 'efemérides', 'desarrollo', 'terminal', 'tech news'],
  authors: [{ name: 'TerminalTime' }],
  viewport: 'width=device-width, initial-scale=1',
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
    <html lang="es">
      <body>
        <main className="min-h-screen bg-terminal-bg">
          {children}
        </main>
      </body>
    </html>
  )
}
