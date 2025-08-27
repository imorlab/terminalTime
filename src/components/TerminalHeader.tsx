export default function TerminalHeader() {
  return (
    <div className="terminal-header">
      <div className="flex items-center gap-2">
        <div className="terminal-dot bg-red-500"></div>
        <div className="terminal-dot bg-yellow-500"></div>
        <div className="terminal-dot bg-green-500"></div>
      </div>
      <h1 className="flex-1 text-center text-sm text-terminal-gray">
        terminal-time
      </h1>
      <div className="text-xs text-terminal-gray">
        SSH: active
      </div>
    </div>
  )
}
