'use client'

import { ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-12 pt-8" suppressHydrationWarning>
      <div className="text-center space-y-2 text-sm text-terminal-gray">
        <div className="flex items-center justify-center gap-2">
          <span>Pulsa</span>
          <kbd className="px-2 py-1 bg-terminal-gray/10 border border-terminal-gray/20 rounded text-xs">
            Cmd+W
          </kbd>
          <span>para salir</span>
        </div>
        
        <div className="flex items-center justify-center gap-1">
          <span>©2025</span>
          <a 
            href="https://imorlab.github.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-terminal-blue hover:text-terminal-yellow transition-colors inline-flex items-center gap-1"
          >
            imorlab 
          </a>
          by
          <a 
            href="https://www.linkedin.com/in/israelmorenolabrador/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-terminal-blue hover:text-terminal-yellow transition-colors inline-flex items-center gap-1"
          >
            Israel Moreno
          </a>
        </div>
        
        <div className="flex flex-row items-center justify-center gap-1 sm:gap-1">
          <div className="flex items-center gap-1">
            
              <a
            href="https://github.com/imorlab/terminalTime" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Ver repositorio en GitHub"
            className="text-terminal-blue hover:text-terminal-yellow transition-colors inline-flex items-center gap-1 sm:ml-1"
          >
              Desarrollado con 
              <span className="text-purple-400"> 💜 </span> 
              desde Andalucía para el mundo
            
          </a>
          
          </div>
          
        </div>
      </div>
    </footer>
  )
}
