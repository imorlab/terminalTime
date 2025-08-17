'use client'

import { useState, useEffect } from 'react'

interface CommandLineProps {
  prompt: string
  command: string
  time: Date
  isEphemerideFetchComplete?: boolean
  onCommandComplete?: () => void
}

export default function CommandLine({ prompt, command, time, isEphemerideFetchComplete = false, onCommandComplete }: CommandLineProps) {
  const [displayedCommand, setDisplayedCommand] = useState('')
  const [commandComplete, setCommandComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Efecto de máquina de escribir para el comando
  useEffect(() => {
    if (command && displayedCommand.length < command.length) {
      const timer = setTimeout(() => {
        setDisplayedCommand(command.slice(0, displayedCommand.length + 1))
      }, 80 + Math.random() * 40) // Velocidad variable para más realismo

      return () => clearTimeout(timer)
    } else if (command && displayedCommand.length === command.length && !commandComplete) {
      // Comando completado, esperar un momento antes de marcarlo como completo
      const timer = setTimeout(() => {
        setCommandComplete(true)
        // Notificar que el comando terminó de escribirse
        if (onCommandComplete) {
          onCommandComplete()
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [displayedCommand, command, commandComplete, onCommandComplete])

  // Efecto de cursor parpadeante
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <div className="space-y-2">
      <div className="text-xs text-terminal-gray">
        {formatDate(time)} | {formatTime(time)}
      </div>
      
      {/* Línea de comando principal con efecto de escritura */}
      <div className="command-line">
        <p className="command-prompt">
          {prompt}:~$
          <span className="command-text ml-1">{displayedCommand}</span>
          {!commandComplete && (
            <span className={`text-terminal-green transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>
              █
            </span>
          )}
        </p>
      </div>

      {/* Resultado del comando cuando se complete la escritura */}
      {commandComplete && (
        <div className="output-line text-terminal-green">
          ✓ Ejecutando recopilación diaria de datos...
        </div>
      )}
      
    </div>
  )
}
