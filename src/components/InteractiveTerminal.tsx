'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export default function InteractiveTerminal() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [output, setOutput] = useState<string[]>([])
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Función para calcular la posición del cursor (super optimizada)
  const updateCursorPosition = useCallback(() => {
    requestAnimationFrame(() => {
      // Aproximación rápida: cada carácter monospace tiene ~8.4px de ancho a 14px
      const charWidth = 8.4
      const textWidth = input.length * charWidth
      setCursorPosition(textWidth)
    })
  }, [input])

  useEffect(() => {
    updateCursorPosition()
  }, [updateCursorPosition])

  // Comandos disponibles
  const commands = {
    help: () => [
      '📚 Comandos disponibles:',
      '  help             - Muestra esta ayuda',
      '  clear            - Limpia la terminal',
      '  date             - Muestra la fecha actual',
      '  whoami           - Información del usuario',
      '  fortune          - Frase tech aleatoria',
      '  history          - Historial de comandos',
      '  joke             - Chiste de programadores',
      '  cowsay           - ASCII art con mensaje',
      '  weather          - Estado del clima',
      '  refresh-ephemeride - Regenera la efeméride del día',
      '  exit             - Salir del modo interactivo'
    ],
    
    clear: () => {
      setOutput([])
      return ['Terminal limpiada ✨']
    },
    
    date: () => [
      `📅 ${new Date().toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`
    ],
    
    whoami: () => [
      '👨‍💻 imorlab@dev',
      '🏠 Ubicación: ~/terminaltime',
      '🎯 Misión: Explorar la historia de la programación',
      '⚡ Estado: Activo y explorando'
    ],
    
    fortune: () => {
      const fortunes = [
        '"La mejor forma de predecir el futuro es inventarlo." - Alan Kay',
        '"El código es como el humor. Cuando tienes que explicarlo, es malo." - Cory House',
        '"Primero resuelve el problema. Después escribe el código." - John Johnson',
        '"La experiencia es el nombre que damos a nuestros errores." - Oscar Wilde',
        '"Un lenguaje que no afecta tu forma de pensar no vale la pena conocerlo." - Alan Perlis',
        '"La simplicidad es la sofisticación suprema." - Leonardo da Vinci',
        '"Hablar es barato. Muéstrame el código." - Linus Torvalds'
      ]
      return [`🔮 ${fortunes[Math.floor(Math.random() * fortunes.length)]}`]
    },
    
    joke: () => {
      const jokes = [
        '¿Por qué los programadores prefieren el dark mode? Porque la luz atrae bugs! 🐛',
        '¿Cuántos programadores se necesitan para cambiar una bombilla? Ninguno, es un problema de hardware 💡',
        'No hay lugar como 127.0.0.1 🏠',
        '¿Por qué los programadores odian la naturaleza? Tiene demasiados bugs 🌿',
        'Hay 10 tipos de personas: las que entienden binario y las que no 🤖',
        'Mi código funciona, no sé por qué. Mi código no funciona, no sé por qué. 🤷‍♂️'
      ]
      return [`😂 ${jokes[Math.floor(Math.random() * jokes.length)]}`]
    },
    
    cowsay: (message: string) => {
      const msg = message || 'TerminalTime es genial!'
      const border = '_'.repeat(msg.length + 2)
      return [
        ` ${border}`,
        `< ${msg} >`,
        ` ${'-'.repeat(msg.length + 2)}`,
        '        \\   ^__^',
        '         \\  (oo)\\_______',
        '            (__)\\       )\\/\\',
        '                ||----w |',
        '                ||     ||'
      ]
    },
    
    weather: () => [
      '🌤️ Estado del clima: Perfecto para programar',
      '🌡️ Temperatura: 22°C (ideal para debugging)',
      '💨 Viento: Suave brisa de inspiración',
      '☁️ Nubes: Dispersas como mis pensamientos antes del café'
    ],
    
    history: () => {
      if (history.length === 0) return ['📝 Historial vacío']
      return ['📜 Historial de comandos:', ...history.map((cmd, i) => `  ${i + 1}. ${cmd}`)]
    },

    'refresh-ephemeride': async () => {
      try {
        setOutput(prev => [...prev, '🔄 Regenerando efeméride del día...'])
        const response = await fetch('/api/ephemerides/today?force=true')
        if (response.ok) {
          const data = await response.json()
          setOutput(prev => [...prev, 
            '✅ Nueva efeméride generada exitosamente:',
            `📅 ${data.year}: ${data.title}`,
            '💡 Recarga la página para ver la nueva efeméride'
          ])
        } else {
          setOutput(prev => [...prev, '❌ Error al regenerar efeméride'])
        }
      } catch (error) {
        setOutput(prev => [...prev, '❌ Error de conexión al regenerar efeméride'])
      }
      return []
    }
  }

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    const [command, ...args] = trimmedCmd.split(' ')
    
    // Añadir al historial
    if (cmd.trim()) {
      setHistory(prev => [...prev, cmd.trim()])
    }

    // Añadir comando a output
    setOutput(prev => [...prev, `imorlab@dev:~$ ${cmd}`])

    if (command === 'exit') {
      setOutput(prev => [...prev, '👋 Saliendo del modo interactivo...'])
      return
    }

    if (command in commands) {
      const result = (commands as any)[command](args.join(' '))
      setOutput(prev => [...prev, ...result, ''])
    } else if (command === '') {
      // No hacer nada si está vacío
      return
    } else {
      setOutput(prev => [...prev, `❌ Comando no encontrado: ${command}`, `💡 Escribe 'help' para ver comandos disponibles`, ''])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input)
      setInput('')
    }
  }

  return (
    <div className="mt-6 space-y-2">
      {/* Output del terminal */}
      {output.map((line, index) => (
        <div key={index} className="output-line text-terminal-text text-sm">
          {line}
        </div>
      ))}
      
      {/* Input interactivo */}
      <div className="command-line flex items-center relative">
        <span className="text-terminal-blue">imorlab@dev:~$</span>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="ml-2 bg-transparent text-terminal-text outline-none w-full font-mono terminal-block-cursor"
            title="Terminal de comandos interactivo"
            autoFocus
          />
          {/* Cursor personalizado - usando ref para posicionamiento CSS */}
          <div 
            className="terminal-cursor-overlay"
            ref={(el) => {
              if (el) {
                el.style.setProperty('--cursor-left', `${8 + cursorPosition}px`)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
