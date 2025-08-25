'use client'

import { useState, useEffect } from 'react'
import LoadingEphemeride from './LoadingEphemeride'
import EphemerideDisplay from './EphemerideDisplay'

interface Ephemeride {
  id: string
  date: string
  title: string
  description: string
  year: number
  category: string
  created_at: string
}

interface EphemerideSectionProps {
  onLoadingChange?: (completed: boolean) => void
  shouldStartFetch?: boolean
}

export default function EphemerideSection({ onLoadingChange, shouldStartFetch = false }: EphemerideSectionProps) {
  const [ephemeride, setEphemeride] = useState<Ephemeride | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState<string>('')

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
      {ephemeride && <EphemerideDisplay ephemeride={ephemeride} />}
    </div>
  )
}
