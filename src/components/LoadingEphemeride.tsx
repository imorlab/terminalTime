'use client'

import { useState, useEffect } from 'react'

interface LoadingEphemerideProps {
  onCancel?: () => void
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

export default function LoadingEphemeride({ onCancel }: LoadingEphemerideProps) {
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
