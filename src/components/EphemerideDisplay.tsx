'use client'

import TypewriterText from './TypewriterText'
import InteractiveTerminal from './InteractiveTerminal'

interface Ephemeride {
  id: string
  date: string
  title: string
  description: string
  year: number
  category: string
  created_at: string
}

interface EphemerideDisplayProps {
  ephemeride: Ephemeride
}

export default function EphemerideDisplay({ ephemeride }: EphemerideDisplayProps) {
  return (
    <div className="space-y-2">
      {/* Salida estilo terminal */}
      <div className="output-line text-terminal-green">
        ✓ Efeméride encontrada para {new Date(ephemeride.date).toLocaleDateString('es-ES')}
      </div>
      
      <div className="output-line">
        <span className="text-terminal-yellow">📅 {ephemeride.year}:</span> 
        <span className="text-terminal-text font-medium">{ephemeride.title}</span>
      </div>
      
      <div className="output-line text-terminal-gray">
        ├─ Categoría: <span className="text-terminal-blue">{ephemeride.category}</span>
      </div>
      
      <div className="output-line text-terminal-gray">
        └─ ID: <span className="text-terminal-yellow">{ephemeride.id}</span>
      </div>
      
      {/* Descripción con efecto typewriter */}
      <div className="mt-4 p-1 md:p-4 bg-terminal-bg/50 border-l-1 md:border-l-4 border-terminal-green rounded-r">
        <p className="text-terminal-text leading-relaxed text-sm md:text-base">
          <TypewriterText 
            text={ephemeride.description}
            speed={20}
            delay={500}
          />
        </p>
      </div>
      
      {/* Línea de estado final */}
      <div className="output-line text-terminal-green mt-4">
        ✓ Proceso completado - Historia cargada exitosamente
      </div>
      
      {/* Terminal interactivo */}
      <InteractiveTerminal />
    </div>
  )
}
