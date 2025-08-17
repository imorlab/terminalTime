'use client'

import { useState, useEffect } from 'react'
import TerminalHeader from '@/components/TerminalHeader'
import CommandLine from '@/components/CommandLine'
import EphemerideSection from '@/components/EphemerideSection'
import WeatherSection from '@/components/WeatherSection'
import NewsSection from '@/components/NewsSection'
import LoadingSpinner from '@/components/LoadingSpinner'
import Footer from '@/components/Footer'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isEphemerideFetchComplete, setIsEphemerideFetchComplete] = useState(false)
  const [shouldStartEphemerideFetch, setShouldStartEphemerideFetch] = useState(false)

  useEffect(() => {
    // Inicializar el tiempo solo en el cliente
    setCurrentTime(new Date())
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Simular carga inicial
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  const handleEphemerideComplete = (completed: boolean) => {
    setIsEphemerideFetchComplete(completed)
  }

  const handleCommandComplete = () => {
    setShouldStartEphemerideFetch(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
            <div className="terminal-window">
              <TerminalHeader />

              <div className="terminal-content">
                <CommandLine  
                  prompt="imorlab@dev"
                  command="./daily-ephemerides.sh"
                  time={currentTime || new Date()}
                  isEphemerideFetchComplete={isEphemerideFetchComplete}
                  onCommandComplete={handleCommandComplete}
                />
                
                <EphemerideSection 
                  onLoadingChange={handleEphemerideComplete}
                  shouldStartFetch={shouldStartEphemerideFetch}
                />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <WeatherSection />
          </div>
        </div>
        
        <div className="mt-8">
          <NewsSection />
        </div>
        
        <Footer />
      </div>
    </div>
  )
}
