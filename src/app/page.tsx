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
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Simular carga inicial
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearInterval(timer)
  }, [])

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
        <div className="terminal-window">
          <TerminalHeader />
          
          <div className="terminal-content">
            <CommandLine 
              prompt="terminaltime@dev"
              command="./daily-digest.sh"
              time={currentTime}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <div className="lg:col-span-2">
                <EphemerideSection />
              </div>
              
              <div className="space-y-6">
                <WeatherSection />
                <NewsSection />
              </div>
            </div>
          </div>
          
          <Footer />
        </div>
      </div>
    </div>
  )
}
