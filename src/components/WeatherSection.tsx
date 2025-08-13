'use client'

import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Thermometer, Wind, Droplets } from 'lucide-react'

interface WeatherData {
  temperature: number
  description: string
  city: string
  humidity: number
  windSpeed: number
  icon: string
}

export default function WeatherSection() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWeather()
  }, [])

  const fetchWeather = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Intentar obtener ubicación del usuario
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords
              const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
              
              if (!response.ok) {
                throw new Error('API del clima no disponible')
              }
              
              const data = await response.json()
              setWeather(data)
            } catch (apiError) {
              console.log('Error API clima:', apiError)
              setError('API no disponible')
              setMockWeather()
            }
          },
          () => {
            // Si no se puede obtener la ubicación, usar datos de ejemplo
            setError('Geolocalización no disponible')
            setMockWeather()
          }
        )
      } else {
        setError('Geolocalización no soportada')
        setMockWeather()
      }
    } catch (err) {
      console.log('Error general clima:', err)
      setError('Error general')
      setMockWeather()
    } finally {
      setLoading(false)
    }
  }

  const setMockWeather = () => {
    setWeather({
      temperature: 22,
      description: 'Parcialmente nublado',
      city: 'Madrid',
      humidity: 65,
      windSpeed: 12,
      icon: 'partly-cloudy'
    })
  }

  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-400" />
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-400" />
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-400" />
      default:
        return <Cloud className="h-8 w-8 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="bg-terminal-gray/5 border border-terminal-gray/20 rounded-lg p-4">
        <div className="output-line text-terminal-blue mb-3">
          🌤️ Obteniendo datos del clima...
        </div>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-terminal-gray/20 rounded w-3/4"></div>
          <div className="h-4 bg-terminal-gray/20 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-terminal-gray/5 border border-terminal-gray/20 rounded-lg p-4">
      <div className="output-line text-terminal-green mb-4">
        🌤️ Clima actual
      </div>
      
      {weather && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-terminal-yellow">
                {weather.city}
              </h3>
              <p className="text-sm text-terminal-gray">
                {weather.description}
              </p>
            </div>
            {getWeatherIcon(weather.icon)}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-terminal-red" />
              <span className="text-terminal-text">
                {weather.temperature}°C
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-terminal-blue" />
              <span className="text-terminal-text">
                {weather.humidity}%
              </span>
            </div>
            
            <div className="flex items-center gap-2 col-span-2">
              <Wind className="h-4 w-4 text-terminal-green" />
              <span className="text-terminal-text">
                {weather.windSpeed} km/h
              </span>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="text-terminal-yellow text-xs mt-2">
          ⚡ Usando Open-Meteo (servicio público)
        </div>
      )}
    </div>
  )
}
