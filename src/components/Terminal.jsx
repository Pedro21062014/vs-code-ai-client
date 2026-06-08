import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import { Terminal as TerminalIcon, Trash2, Copy } from 'lucide-react'

function Terminal() {
  const { terminalHistory, addTerminalOutput } = useStore()
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState([
    { type: 'system', content: 'VS Code AI Client Terminal v1.0.0' },
    { type: 'system', content: 'Type "help" for available commands' },
    { type: 'output', content: '' },
  ])
  const inputRef = useRef(null)
  const outputRef = useRef(null)

  const commands = {
    help: () => `Available commands:
  help     - Show this help message
  clear    - Clear terminal
  date     - Show current date and time
  whoami   - Show current user
  pwd      - Print working directory
  ls       - List files in current directory
  echo     - Print text to terminal
  history  - Show command history
  version  - Show version info
  api      - Test API connection`,
    
    clear: () => {
      setHistory([])
      return null
    },
    
    date: () => new Date().toLocaleString(),
    
    whoami: () => 'user@vscode-ai',
    
    pwd: () => '/home/user/project',
    
    ls: () => `src/
package.json
README.md
config.js
node_modules/`,
    
    echo: (args) => args.join(' '),
    
    history: () => history.filter(h => h.type === 'command').map(h => h.content).join('\n'),
    
    version: () => 'VS Code AI Client v1.0.0',
    
    api: () => {
      const apiKey = useStore.getState().apiKey
      if (apiKey) {
        return '✓ API Key configured'
      }
      return '✗ No API Key configured. Set it in Settings.'
    },
  }

  useEffect(() => {
    outputRef.current?.scrollTo(0, outputRef.current.scrollHeight)
  }, [history])

  const executeCommand = (cmd) => {
    const trimmed = cmd.trim()
    if (!trimmed) return

    const [commandName, ...args] = trimmed.split(' ')
    const cmdLower = commandName.toLowerCase()

    // Add command to history
    setHistory(prev => [...prev, { type: 'command', content: `user@vscode-ai:~$ ${trimmed}` }])

    if (commands[cmdLower]) {
      const result = commands[cmdLower](args)
      if (result !== null) {
        setHistory(prev => [...prev, { type: 'output', content: result }])
      }
    } else {
      setHistory(prev => [...prev, { type: 'error', content: `Command not found: ${commandName}` }])
    }

    addTerminalOutput(trimmed)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(command)
      setCommand('')
    }
  }

  const clearTerminal = () => {
    setHistory([
      { type: 'system', content: 'Terminal cleared' },
      { type: 'output', content: '' },
    ])
  }

  return (
    <div className="h-full flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className="text-green-400" />
          <span className="text-xs text-gray-400">bash</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={clearTerminal}
            className="p-1 rounded hover:bg-vscode-hover transition-colors"
            title="Clear terminal"
          >
            <Trash2 size={12} />
          </button>
          <button 
            onClick={() => {
              const content = history.map(h => h.content).join('\n')
              navigator.clipboard.writeText(content)
            }}
            className="p-1 rounded hover:bg-vscode-hover transition-colors"
            title="Copy output"
          >
            <Copy size={12} />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={outputRef}
        className="flex-1 overflow-y-auto font-mono text-sm space-y-1"
      >
        {history.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1 }}
            className={`${
              line.type === 'command' ? 'text-green-400' :
              line.type === 'error' ? 'text-vscode-error' :
              line.type === 'system' ? 'text-vscode-accent' :
              'text-gray-300'
            }`}
          >
            {line.content}
          </motion.div>
        ))}
      </div>

      {/* Terminal Input */}
      <div className="mt-2 flex items-center">
        <span className="text-green-400 mr-2">user@vscode-ai:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-gray-300 font-mono text-sm"
          placeholder="Type a command..."
          autoFocus
        />
      </div>

      {/* Quick Commands */}
      <div className="mt-3 flex items-center gap-2 border-t border-vscode-border pt-2">
        <span className="text-xs text-gray-500">Quick:</span>
        {['npm install', 'git status', 'node -v', 'ls -la'].map((cmd, i) => (
          <button
            key={i}
            onClick={() => {
              setCommand(cmd)
              inputRef.current?.focus()
            }}
            className="px-2 py-0.5 text-xs bg-vscode-sidebar rounded hover:bg-vscode-hover transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Terminal