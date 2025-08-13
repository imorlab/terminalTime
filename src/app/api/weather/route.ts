import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    
    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitud y longitud son requeridas' },
        { status: 400 }
      )
    }
    
    if (!process.env.OPENWEATHER_API_KEY) {
      return NextResponse.json(
        { error: 'API key de OpenWeather no configurada' },
        { status: 500 }
      )
    }
    
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=es`
    )
    
    if (!weatherResponse.ok) {
      throw new Error('Error al obtener datos del clima')
    }
    
    const weatherData = await weatherResponse.json()
    
    // Mapear los datos a nuestro formato
    const formattedData = {
      temperature: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
      city: weatherData.name,
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed * 3.6), // convertir de m/s a km/h
      icon: mapWeatherIcon(weatherData.weather[0].icon)
    }
    
    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Error en API del clima:', error)
    return NextResponse.json(
      { error: 'Error al obtener datos del clima' },
      { status: 500 }
    )
  }
}

function mapWeatherIcon(iconCode: string): string {
  // Mapear los códigos de iconos de OpenWeather a nuestros tipos
  const iconMap: { [key: string]: string } = {
    '01d': 'sunny',
    '01n': 'sunny',
    '02d': 'partly-cloudy',
    '02n': 'partly-cloudy',
    '03d': 'cloudy',
    '03n': 'cloudy',
    '04d': 'cloudy',
    '04n': 'cloudy',
    '09d': 'rainy',
    '09n': 'rainy',
    '10d': 'rainy',
    '10n': 'rainy',
    '11d': 'rainy',
    '11n': 'rainy',
    '13d': 'snowy',
    '13n': 'snowy',
    '50d': 'cloudy',
    '50n': 'cloudy'
  }
  
  return iconMap[iconCode] || 'partly-cloudy'
}
