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

export default function EphemerideSection() {
  const [ephemeride, setEphemeride] = useState<Ephemeride | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState<string>('')

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

  const fetchTodayEphemeride = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Actualizar fecha actual
      const today = new Date().toISOString().split('T')[0]
      setCurrentDate(today)
      
      const response = await fetch('/api/ephemerides/today')
      
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

  if (loading) {
    return (
      <div className="space-y-2">
        
        {/* <div className="output-line">
          <span className="text-terminal-green">$</span> <span className="text-terminal-blue">./ephemerides</span> <span className="text-terminal-yellow">--today</span>
        </div> */}
        <div className="output-line text-terminal-yellow">
          ⏳ Cargando efeméride del día...
        </div>
        <div className="output-line text-terminal-gray">
          └─ Consultando base de datos histórica
        </div>
      </div>
    )
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
          onClick={fetchTodayEphemeride}
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
          <div className="mt-4 p-4 bg-terminal-bg/50 border-l-4 border-terminal-green rounded-r">
            <div className="text-terminal-gray text-xs mb-2">{'/** Descripción **/'}</div>
            <p className="text-terminal-text leading-relaxed">
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
