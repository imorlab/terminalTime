'use client'

import { ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-12 pt-8">
      <div className="text-center space-y-2 text-sm text-terminal-gray">
        <div className="flex items-center justify-center gap-2">
          <span>Pulsa</span>
          <kbd className="px-2 py-1 bg-terminal-gray/10 border border-terminal-gray/20 rounded text-xs">
            Cmd+W
          </kbd>
          <span>para salir</span>
        </div>
        
        <div className="flex items-center justify-center gap-1">
          <span>© 2025</span>
          <a 
            href="https://imorlab.github.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-terminal-blue hover:text-terminal-yellow transition-colors inline-flex items-center gap-1"
          >
            imorlab by Israel Moreno
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        
        <div className="flex items-center justify-center gap-1">
          <span>Desarrollado con</span>
          <span className="text-purple-400">💜</span>
          <span>desde Andalucía para el mundo</span>
          <a 
            href="https://github.com/imorlab/terminalTime" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Ver repositorio en GitHub"
            className="text-terminal-blue hover:text-terminal-yellow transition-colors inline-flex items-center gap-1 ml-1"
          >
            (GitHub)
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  )
}
