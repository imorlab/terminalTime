'use client'

import { useState, useEffect } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  delay?: number
  onComplete?: () => void
}

export default function TypewriterText({ 
  text, 
  speed = 30, 
  delay = 0, 
  onComplete 
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let index = 0
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.substring(0, index + 1))
          index++
        } else {
          clearInterval(interval)
          setIsComplete(true)
          if (onComplete) onComplete()
        }
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [text, speed, delay, onComplete])

  return (
    <span>
      {displayText}
      {!isComplete && <span className="animate-pulse text-terminal-green">█</span>}
    </span>
  )
}
