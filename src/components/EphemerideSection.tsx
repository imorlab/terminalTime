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
      <div className="space-y-4">
        <div className="output-line text-terminal-blue">
          📅 Cargando efeméride del día...
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-terminal-gray/20 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-terminal-gray/20 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error && !ephemeride) {
    return (
      <div className="space-y-4">
        <div className="output-line text-terminal-red">
          ❌ Error: {error}
        </div>
        <button 
          onClick={fetchTodayEphemeride}
          className="text-terminal-blue hover:text-terminal-yellow transition-colors underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {ephemeride && (
        <div className="bg-terminal-gray/5 border border-terminal-gray/20 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Code className="h-6 w-6 text-terminal-blue" />
              <div>
                <h2 className="text-xl font-semibold text-terminal-yellow">
                  📅 Efeméride del día
                </h2>
                <div className="flex items-center gap-4 text-sm text-terminal-gray mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {ephemeride.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {ephemeride.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-terminal-text leading-relaxed">
              {ephemeride.description}
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-terminal-gray/20">
            <div className="flex items-center justify-between text-xs text-terminal-gray">
              <span>Fecha: {new Date(ephemeride.date).toLocaleDateString('es-ES')}</span>
              <span>ID: {ephemeride.id}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
