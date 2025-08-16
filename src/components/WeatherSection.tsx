'use client'

import { useState, useEffect, useCallback } from 'react'
import { MapPin, Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Eye, ChevronDown } from 'lucide-react'

interface WeatherData {
  temperature: number
  description: string
  city: string
  humidity: number
  windSpeed: number
  icon: string
  visibility?: number
}

interface SpanishCity {
  name: string
  lat: number
  lon: number
  province: string
}

const SPANISH_CITIES: SpanishCity[] = [
  { name: 'Madrid', lat: 40.4165, lon: -3.7026, province: 'Madrid' },
  { name: 'Barcelona', lat: 41.3828, lon: 2.1774, province: 'Barcelona' },
  { name: 'Valencia', lat: 39.4697, lon: -0.3774, province: 'Valencia' },
  { name: 'Sevilla', lat: 37.3886, lon: -5.9823, province: 'Sevilla' },
  { name: 'Zaragoza', lat: 41.6561, lon: -0.8773, province: 'Zaragoza' },
  { name: 'Málaga', lat: 36.7213, lon: -4.4213, province: 'Málaga' },
  { name: 'Murcia', lat: 37.9923, lon: -1.1307, province: 'Murcia' },
  { name: 'Palma', lat: 39.5696, lon: 2.6502, province: 'Baleares' },
  { name: 'Las Palmas', lat: 28.1248, lon: -15.4300, province: 'Las Palmas' },
  { name: 'Bilbao', lat: 43.2630, lon: -2.9350, province: 'Vizcaya' },
  { name: 'Alicante', lat: 38.3452, lon: -0.4810, province: 'Alicante' },
  { name: 'Córdoba', lat: 37.8845, lon: -4.7760, province: 'Córdoba' },
  { name: 'Valladolid', lat: 41.6523, lon: -4.7245, province: 'Valladolid' },
  { name: 'Vigo', lat: 42.2406, lon: -8.7207, province: 'Pontevedra' },
  { name: 'Gijón', lat: 43.5322, lon: -5.6611, province: 'Asturias' },
  { name: 'A Coruña', lat: 43.3623, lon: -8.4115, province: 'A Coruña' },
  { name: 'Granada', lat: 37.1809, lon: -3.6019, province: 'Granada' },
  { name: 'Vitoria', lat: 42.8466, lon: -2.6719, province: 'Álava' },
  { name: 'Santander', lat: 43.4623, lon: -3.8100, province: 'Cantabria' },
  { name: 'Pamplona', lat: 42.8125, lon: -1.6458, province: 'Navarra' },
  { name: 'Toledo', lat: 39.8628, lon: -4.0273, province: 'Toledo' },
  { name: 'Salamanca', lat: 40.9701, lon: -5.6635, province: 'Salamanca' },
  { name: 'León', lat: 42.5987, lon: -5.5671, province: 'León' },
  { name: 'Burgos', lat: 42.3439, lon: -3.6969, province: 'Burgos' },
  { name: 'Albacete', lat: 38.9942, lon: -1.8564, province: 'Albacete' },
  { name: 'Cádiz', lat: 36.5270, lon: -6.2885, province: 'Cádiz' },
  { name: 'Huelva', lat: 37.2614, lon: -6.9447, province: 'Huelva' },
  { name: 'Logroño', lat: 42.4627, lon: -2.4449, province: 'La Rioja' },
  { name: 'Badajoz', lat: 38.8794, lon: -6.9706, province: 'Badajoz' },
  { name: 'San Sebastián', lat: 43.3183, lon: -1.9812, province: 'Guipúzcoa' }
]

export default function WeatherSection() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<SpanishCity>(SPANISH_CITIES[3]) // Madrid por defecto
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [locationDetected, setLocationDetected] = useState(false)

  // Función para encontrar la ciudad más cercana a las coordenadas
  const findNearestCity = (userLat: number, userLon: number): SpanishCity => {
    let nearestCity = SPANISH_CITIES[0]
    let minDistance = Infinity

    SPANISH_CITIES.forEach(city => {
      // Calcular distancia usando fórmula de Haversine simplificada
      const deltaLat = userLat - city.lat
      const deltaLon = userLon - city.lon
      const distance = Math.sqrt(deltaLat * deltaLat + deltaLon * deltaLon)
      
      if (distance < minDistance) {
        minDistance = distance
        nearestCity = city
      }
    })

    return nearestCity
  }

  // Función para detectar ubicación automáticamente
  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      console.log('Geolocalización no soportada')
      return
    }
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutos de cache
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('🗺️ Ubicación detectada:', position.coords.latitude, position.coords.longitude)
        
        const nearestCity = findNearestCity(
          position.coords.latitude,
          position.coords.longitude
        )
        
        console.log('🎯 Ciudad más cercana:', nearestCity.name)
        setSelectedCity(nearestCity)
        setLocationDetected(true)
      },
      (error) => {
        console.log('❌ Error detectando ubicación:', error.message)
        // Si hay error, mantener Madrid como ciudad por defecto
      },
      options
    )
  }, [])

  const fetchWeatherForCity = useCallback(async (city: SpanishCity) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/weather?lat=${city.lat}&lon=${city.lon}`)
      
      if (!response.ok) {
        throw new Error('API del clima no disponible')
      }
      
      const data = await response.json()
      setWeather({ ...data, city: city.name })
    } catch (apiError) {
      console.log('Error API clima:', apiError)
      setError('API no disponible')
      setMockWeather(city)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Intentar detectar ubicación automáticamente solo la primera vez
    if (!locationDetected) {
      detectLocation()
    }
  }, [detectLocation, locationDetected])

  useEffect(() => {
    fetchWeatherForCity(selectedCity)
  }, [selectedCity, fetchWeatherForCity])

  const setMockWeather = (city: SpanishCity) => {
    // Usar el nombre de la ciudad como seed para generar datos consistentes
    const seed = city.name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    // Función de random seeded simple
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }
    
    setWeather({
      temperature: Math.floor(seededRandom(seed) * 20) + 10,
      description: 'Parcialmente nublado',
      city: city.name,
      humidity: Math.floor(seededRandom(seed + 1) * 40) + 40,
      windSpeed: Math.floor(seededRandom(seed + 2) * 15) + 5,
      visibility: Math.floor(seededRandom(seed + 3) * 5) + 8,
      icon: 'partly-cloudy'
    })
  }

  const getWeatherIcon = (iconType: string, size: 'sm' | 'lg' = 'lg') => {
    const sizeClass = size === 'sm' ? 'h-10 w-10' : 'h-16 w-16'
    
    switch (iconType) {
      case 'sunny':
      case 'clear':
        return <Sun className={`${sizeClass} text-terminal-yellow`} />
      case 'cloudy':
      case 'overcast':
        return <Cloud className={`${sizeClass} text-terminal-gray`} />
      case 'rainy':
      case 'rain':
        return <CloudRain className={`${sizeClass} text-terminal-blue`} />
      case 'snow':
        return <CloudSnow className={`${sizeClass} text-blue-200`} />
      default:
        return <Cloud className={`${sizeClass} text-terminal-gray`} />
    }
  }

  if (loading) {
    return (
      <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-terminal-gray/5 to-terminal-blue/5 border border-terminal-gray/10 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-terminal-green/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        
        <div className="relative p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="animate-pulse">
              <Cloud className="h-5 w-5 text-terminal-blue" />
            </div>
            <span className="text-terminal-green font-mono text-sm">weather.status</span>
            <div className="flex-1 border-b border-dotted border-terminal-gray/30" />
            <span className="text-terminal-yellow text-xs">loading...</span>
          </div>
          
          <div className="space-y-3">
            <div className="animate-pulse space-y-2">
              <div className="h-6 bg-terminal-gray/10 rounded-md w-3/4" />
              <div className="h-4 bg-terminal-gray/10 rounded-md w-1/2" />
              <div className="h-4 bg-terminal-gray/10 rounded-md w-2/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-terminal-gray/5 to-terminal-blue/5 border border-terminal-gray/10 backdrop-blur-sm hover:border-terminal-green/30 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-terminal-green/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      <div className="relative p-4">
        {/* Header con selector de ciudad */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-terminal-blue" />
            <span className="text-terminal-green font-mono text-sm">weather.query</span>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1.5 bg-terminal-gray/10 hover:bg-terminal-gray/20 rounded-lg border border-terminal-gray/20 transition-colors text-sm"
            >
              <MapPin className="h-4 w-4 text-terminal-yellow" />
              <span className="text-terminal-text">{selectedCity.name}</span>
              <ChevronDown className={`h-4 w-4 text-terminal-gray transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 max-h-60 overflow-y-auto bg-terminal-bg border border-terminal-gray/20 rounded-lg shadow-lg z-10">
                <div className="p-2 space-y-1">
                  {SPANISH_CITIES.map((city) => (
                    <button
                      key={`${city.name}-${city.province}`}
                      onClick={() => {
                        setSelectedCity(city)
                        setIsDropdownOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                        selectedCity.name === city.name
                          ? 'bg-terminal-green/20 text-terminal-green'
                          : 'hover:bg-terminal-gray/10 text-terminal-text'
                      }`}
                    >
                      <div className="font-medium">{city.name}</div>
                      <div className="text-xs text-terminal-gray">{city.province}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {weather && (
          <div className="space-y-6">
            {/* Temperatura principal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getWeatherIcon(weather.icon)}
                <div>
                  <div className="text-4xl font-light text-terminal-text">
                    {weather.temperature}°C
                  </div>
                  <div className="text-md text-terminal-gray font-mono">
                    {weather.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Métricas en grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-terminal-gray/5 border border-terminal-gray/10">
                <div className="flex items-center gap-2 mb-1">
                  <Droplets className="h-4 w-4 text-terminal-blue" />
                  <span className="text-xs text-terminal-gray font-mono">humidity</span>
                </div>
                <div className="text-lg font-light text-terminal-text">
                  {weather.humidity}%
                </div>
              </div>

              <div className="p-3 rounded-lg bg-terminal-gray/5 border border-terminal-gray/10">
                <div className="flex items-center gap-2 mb-1">
                  <Wind className="h-4 w-4 text-terminal-green" />
                  <span className="text-xs text-terminal-gray font-mono">wind</span>
                </div>
                <div className="text-lg font-light text-terminal-text">
                  {weather.windSpeed} km/h
                </div>
              </div>

              {weather.visibility && (
                <div className="p-3 rounded-lg bg-terminal-gray/5 border border-terminal-gray/10 col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-terminal-yellow" />
                    <span className="text-xs text-terminal-gray font-mono">visibility</span>
                  </div>
                  <div className="text-lg font-light text-terminal-text">
                    {weather.visibility} km
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-terminal-yellow/10 border border-terminal-yellow/20">
            <div className="flex items-center gap-2 text-terminal-yellow text-xs font-mono">
              <span>⚡</span>
              <span>mock_data.enabled = true</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}