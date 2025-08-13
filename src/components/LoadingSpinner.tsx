export default function LoadingSpinner() {
  return (
    <div className="terminal-window max-w-md mx-auto">
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <div className="terminal-dot bg-red-500"></div>
          <div className="terminal-dot bg-yellow-500"></div>
          <div className="terminal-dot bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-sm text-terminal-gray">
          Inicializando...
        </div>
      </div>
      
      <div className="terminal-content">
        <div className="command-line">
          <span className="command-prompt">system:~$</span>
          <span className="command-text">boot --init</span>
          <span className="animate-cursor-blink text-terminal-green">█</span>
        </div>
        
        <div className="space-y-2 mt-4">
          <div className="output-line text-terminal-green">
            ✓ Cargando módulos del sistema...
          </div>
          <div className="output-line text-terminal-yellow">
            ⚡ Conectando a APIs externas...
          </div>
          <div className="output-line text-terminal-blue flex items-center gap-2">
            <div className="animate-spin h-3 w-3 border border-terminal-blue border-t-transparent rounded-full"></div>
            Preparando interfaz terminal...
          </div>
        </div>
      </div>
    </div>
  )
}
