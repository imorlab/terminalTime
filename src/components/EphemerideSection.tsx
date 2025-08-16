'use client'

import { useState, useEffect } from 'react'
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

    // Cambiar pasos cada 2.5 segundos
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % loadingSteps.length)
    }, 2500)

    // Cambiar facts cada 4 segundos
    const factInterval = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % programmingFacts.length)
    }, 4000)

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
      
      {/* Información adicional después de 8 segundos */}
      {timeElapsed > 8 && (
        <div className="mt-4 p-3 bg-terminal-bg/30 border-l-4 border-terminal-yellow rounded-r">
          <div className="text-terminal-yellow text-sm mb-1">🤖 Generación con IA</div>
          <div className="text-terminal-gray text-sm">
            Estamos creando contenido único y preciso sobre eventos históricos de la programación.
            La IA está analizando bases de datos para ofrecerte la mejor información posible.
          </div>
        </div>
      )}
      
      {/* Advertencia si tarda mucho */}
      {timeElapsed > 20 && (
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

export default function EphemerideSection() {
  const [ephemeride, setEphemeride] = useState<Ephemeride | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState<string>('')
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    fetchTodayEphemeride()
    
    // Verificar cada minuto si cambió el día
    const interval = setInterval(() => {
      const today = new Date().toISOString().split('T')[0]
      if (currentDate && currentDate !== today) {
        console.log('📅 Nuevo día detectado, refrescando efeméride...')
        fetchTodayEphemeride()
      }
    }, 60000) // Verificar cada minuto
    
    return () => clearInterval(interval)
  }, [currentDate])

  const fetchTodayEphemeride = async (forceFallback = false) => {
    try {
      setLoading(true)
      setError(null)
      setUseFallback(forceFallback)
      
      // Actualizar fecha actual
      const today = new Date().toISOString().split('T')[0]
      setCurrentDate(today)
      
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
          
          {/* Descripción con estilo de bloque de código */}
          <div className="mt-4 p-1 md:p-4 bg-terminal-bg/50 border-l-1 md:border-l-4 border-terminal-green rounded-r">
            <p className="text-terminal-text leading-relaxed text-sm md:text-base">
              {ephemeride.description}
            </p>
          </div>
          
          {/* Línea de estado final */}
          <div className="output-line text-terminal-green mt-4">
            ✓ Proceso completado - Historia cargada exitosamente
          </div>
        </div>
      )}
    </div>
  )
}
