interface CommandLineProps {
  prompt: string
  command: string
  time: Date
}

export default function CommandLine({ prompt, command, time }: CommandLineProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-terminal-gray">
        {formatDate(time)} | {formatTime(time)}
      </div>
      <div className="command-line">
        <span className="command-prompt">{prompt}:~$</span>
        <span className="command-text">{command}</span>
        <span className="animate-cursor-blink text-terminal-green">█</span>
      </div>
      <div className="output-line text-terminal-green">
        ✓ Ejecutando recopilación diaria de datos...
      </div>
    </div>
  )
}
