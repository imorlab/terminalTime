'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Calendar, Clock, Code } from 'lucide-react'

interface Ephemeride {
  id: string
  date: string
  title: string
  description: string
  year: number
  category: string
  created_at: string
}

// Componente para efecto typewriter
function TypewriterText({ 
  text, 
  speed = 30, 
  delay = 0, 
  onComplete 
}: { 
  text: string
  speed?: number
  delay?: number
  onComplete?: () => void
}) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let index = 0
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.substring(0, index + 1))
          index++
        } else {
          clearInterval(interval)
          setIsComplete(true)
          if (onComplete) onComplete()
        }
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [text, speed, delay, onComplete])

  return (
    <span>
      {displayText}
      {!isComplete && <span className="animate-pulse text-terminal-green">█</span>}
    </span>
  )
}

// Componente para terminal interactivo
function InteractiveTerminal() {
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
      '  help     - Muestra esta ayuda',
      '  clear    - Limpia la terminal',
      '  date     - Muestra la fecha actual',
      '  whoami   - Información del usuario',
      '  fortune  - Frase tech aleatoria',
      '  history  - Historial de comandos',
      '  joke     - Chiste de programadores',
      '  cowsay   - ASCII art con mensaje',
      '  weather  - Estado del clima',
      '  exit     - Salir del modo interactivo'
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
      '🏠 Ubicación: ~/andalucia',
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
            placeholder=""
            title="Terminal de comandos interactivo"
            autoFocus
          />
          {/* Cursor personalizado */}
          <div 
            className="terminal-cursor-overlay"
            style={{ '--cursor-left': `${8 + cursorPosition}px` } as any}
          />
        </div>
      </div>
    </div>
  )
}

// Datos curiosos para mostrar mientras carga
const programmingFacts = [
  "💡 El primer 'bug' informático fue literalmente un insecto encontrado en 1947",
  "🔢 El primer algoritmo fue escrito por Ada Lovelace en 1843",
  "☕ Java se llamó originalmente 'Oak' hasta que descubrieron que ya estaba registrado",
  "🐍 Python fue nombrado por Monty Python, no por la serpiente",
  "📱 El primer iPhone tenía menos poder de procesamiento que una calculadora TI-83",
  "💾 El primer disco duro pesaba más de una tonelada y almacenaba 5MB",
  "🌐 El primer sitio web sigue activo: info.cern.ch",
  "⌨️ QWERTY fue diseñado para ralentizar la escritura en máquinas de escribir"
]

const loadingSteps = [
  "🔍 Explorando archivos históricos...",
  "🤖 Consultando base de conocimiento IA...",
  "📚 Analizando eventos de programación...",
  "✨ Generando contenido personalizado...",
  "🎯 Verificando precisión histórica...",
  "📝 Formateando respuesta final..."
]

function LoadingEphemeride({ onCancel }: { onCancel?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentFact, setCurrentFact] = useState(0)
  const [dots, setDots] = useState('')
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    // Animación de puntos
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    // Cambiar pasos cada 1.5 segundos (más rápido)
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % loadingSteps.length)
    }, 1500)

    // Cambiar facts cada 3 segundos (más rápido)
    const factInterval = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % programmingFacts.length)
    }, 3000)

    // Contador de tiempo transcurrido
    const timeInterval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => {
      clearInterval(dotsInterval)
      clearInterval(stepInterval)
      clearInterval(factInterval)
      clearInterval(timeInterval)
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Línea de comando */}
      <div className="output-line">
        <span className="text-terminal-green">$</span> 
        <span className="text-terminal-blue ml-1">./ephemerides</span> 
        <span className="text-terminal-yellow ml-1">--today --ai-enhanced</span>
      </div>
      
      {/* Progreso actual */}
      <div className="output-line text-terminal-yellow">
        ⏳ {loadingSteps[currentStep]}{dots}
      </div>
      
      {/* Barra de progreso visual */}
      <div className="output-line text-terminal-gray">
        ├─ Progreso: [{currentStep + 1}/{loadingSteps.length}] {Math.round(((currentStep + 1) / loadingSteps.length) * 100)}%
      </div>
      
      {/* Tiempo transcurrido */}
      <div className="output-line text-terminal-gray">
        ├─ Tiempo: {timeElapsed}s {timeElapsed > 10 ? '(generando contenido único...)' : ''}
      </div>
      
      {/* Dato curioso rotativo */}
      <div className="output-line text-terminal-gray">
        └─ Mientras esperas: <span className="text-terminal-blue">{programmingFacts[currentFact]}</span>
      </div>
      
      {/* Información adicional después de 5 segundos */}
      {timeElapsed > 5 && (
        <div className="mt-4 p-3 bg-terminal-bg/30 border-l-4 border-terminal-yellow rounded-r">
          <div className="text-terminal-yellow text-sm mb-1">🤖 Generación con IA</div>
          <div className="text-terminal-gray text-sm">
            Estamos creando contenido único y preciso sobre eventos históricos de la programación.
            La IA está analizando bases de datos para ofrecerte la mejor información posible.
          </div>
        </div>
      )}
      
      {/* Advertencia si tarda mucho */}
      {timeElapsed > 12 && (
        <>
          <div className="output-line text-terminal-red">
            ⚠️ La generación está tardando más de lo esperado. Esto puede deberse a alta demanda en el servicio de IA.
          </div>
          {onCancel && (
            <button 
              onClick={onCancel}
              className="output-line text-terminal-blue hover:text-terminal-yellow transition-colors underline cursor-pointer"
            >
              🔄 Usar datos de fallback (más rápido)
            </button>
          )}
        </>
      )}
    </div>
  )
}

interface EphemerideSectionProps {
  onLoadingChange?: (completed: boolean) => void
  shouldStartFetch?: boolean
}

export default function EphemerideSection({ onLoadingChange, shouldStartFetch = false }: EphemerideSectionProps) {
  const [ephemeride, setEphemeride] = useState<Ephemeride | null>(null)
  const [loading, setLoading] = useState(false) // Iniciar como false hasta que se active el fetch
  const [error, setError] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState<string>('')
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    // Solo iniciar el fetch cuando se indique desde el comando
    if (shouldStartFetch) {
      fetchTodayEphemeride()
    }
    
    // Verificar cada minuto si cambió el día
    const interval = setInterval(() => {
      const today = new Date().toISOString().split('T')[0]
      if (currentDate && currentDate !== today && shouldStartFetch) {
        console.log('📅 Nuevo día detectado, refrescando efeméride...')
        fetchTodayEphemeride()
      }
    }, 60000) // Verificar cada minuto
    
    return () => clearInterval(interval)
  }, [currentDate, shouldStartFetch])

  // Notificar cuando cambie el estado de carga
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(!loading)
    }
  }, [loading, onLoadingChange])

  const fetchTodayEphemeride = async (forceFallback = false) => {
    try {
      setLoading(true)
      setError(null)
      setUseFallback(forceFallback)
      
      // Actualizar fecha actual
      const today = new Date().toISOString().split('T')[0]
      setCurrentDate(today)
      
      // Tiempo de inicio para calcular duración
      const startTime = Date.now()
      
      const url = forceFallback 
        ? '/api/ephemerides/today?fallback=true' 
        : '/api/ephemerides/today'
      
      const response = await fetch(url)
      
      if (!response.ok) {
        if (response.status === 503) {
          throw new Error('Servicio no disponible')
        }
        throw new Error('API de efemérides no disponible')
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Calcular tiempo transcurrido
      const elapsedTime = Date.now() - startTime
      const minLoadingTime = 1500 // Reducido a 1.5 segundos para carga más rápida
      
      // Si la carga fue muy rápida (desde DB), añadir delay mínimo
      if (elapsedTime < minLoadingTime) {
        const remainingTime = minLoadingTime - elapsedTime
        console.log(`⏱️ Carga rápida detectada (${elapsedTime}ms), añadiendo delay mínimo de ${remainingTime}ms`)
        await new Promise(resolve => setTimeout(resolve, remainingTime))
      }
      
      setEphemeride(data)
    } catch (err) {
      console.log('Error API efemérides:', err)
      setError(err instanceof Error ? err.message : 'API no disponible')
      // La API ya maneja fallbacks inteligentes, no necesitamos uno aquí
    } finally {
      setLoading(false)
    }
  }

  const handleUseFallback = () => {
    fetchTodayEphemeride(true)
  }

  if (loading) {
    return <LoadingEphemeride onCancel={handleUseFallback} />
  }

  if (error && !ephemeride) {
    return (
      <div className="space-y-2">
        {/* <div className="output-line">
          <span className="text-terminal-green">$</span> <span className="text-terminal-blue">./ephemerides</span> <span className="text-terminal-yellow">--today</span>
        </div> */}
        <div className="output-line text-terminal-red">
          ❌ Error: {error}
        </div>
        <button 
          onClick={() => fetchTodayEphemeride()}
          className="output-line text-terminal-blue hover:text-terminal-yellow transition-colors underline cursor-pointer"
        >
          🔄 Reintentar conexión
        </button>
      </div>
    )
  }

  // Si no se ha iniciado el fetch, no mostrar nada
  if (!shouldStartFetch && !ephemeride) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Línea de comando de efemérides */}
      {/* <div className="output-line">
        <span className="text-terminal-green">$</span> <span className="text-terminal-blue">./ephemerides</span> <span className="text-terminal-yellow">--today</span>
      </div> */}
      
      {ephemeride && (
        <div className="space-y-2">
          {/* Salida estilo terminal */}
          <div className="output-line text-terminal-green">
            ✓ Efeméride encontrada para {new Date(ephemeride.date).toLocaleDateString('es-ES')}
          </div>
          
          <div className="output-line">
            <span className="text-terminal-yellow">📅 {ephemeride.year}:</span> <span className="text-terminal-text font-medium">{ephemeride.title}</span>
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
      )}
    </div>
  )
}
