import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import useStore from './store/useStore'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import Chat from './components/Chat'
import Terminal from './components/Terminal'
import SettingsModal from './components/SettingsModal'
import ApiKeyModal from './components/ApiKeyModal'
import { Settings, Menu, Terminal as TerminalIcon, MessageSquare } from 'lucide-react'

function App() {
  const { theme, apiKey, loadExtensions } = useStore()
  const [showSettings, setShowSettings] = useState(false)
  const [showApiKey, setShowApiKey] = useState(!apiKey)
  const [leftPanelWidth, setLeftPanelWidth] = useState(280)
  const [rightPanelWidth, setRightPanelWidth] = useState(400)
  const [showTerminal, setShowTerminal] = useState(true)
  const [activeRightTab, setActiveRightTab] = useState('chat')

  useEffect(() => {
    loadExtensions()
    // Load demo files
    const demoFiles = [
      { name: 'src', type: 'folder', path: 'src', children: [
        { name: 'App.jsx', type: 'file', path: 'src/App.jsx' },
        { name: 'index.js', type: 'file', path: 'src/index.js' },
        { name: 'components', type: 'folder', path: 'src/components', children: [
          { name: 'Button.jsx', type: 'file', path: 'src/components/Button.jsx' },
          { name: 'Card.jsx', type: 'file', path: 'src/components/Card.jsx' },
        ]},
        { name: 'utils', type: 'folder', path: 'src/utils', children: [
          { name: 'helpers.js', type: 'file', path: 'src/utils/helpers.js' },
        ]},
      ]},
      { name: 'package.json', type: 'file', path: 'package.json' },
      { name: 'README.md', type: 'file', path: 'README.md' },
      { name: 'config.js', type: 'file', path: 'config.js' },
    ]
    useStore.getState().setFiles(demoFiles)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  const handleResizeLeft = (e) => {
    const newWidth = Math.max(200, Math.min(500, e.clientX))
    setLeftPanelWidth(newWidth)
  }

  const handleResizeRight = (e) => {
    const newWidth = Math.max(300, Math.min(600, window.innerWidth - e.clientX))
    setRightPanelWidth(newWidth)
  }

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'dark' : 'light'}`}>
      {/* Title Bar */}
      <motion.div 
        className="h-8 bg-vscode-sidebar flex items-center justify-between px-3 border-b border-vscode-border"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/vscode-icon.svg" alt="VS Code AI" className="w-5 h-5" />
            <span className="text-xs font-medium text-vscode-text">VS Code AI Client</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span className="hover:text-vscode-text cursor-pointer px-2 py-0.5 rounded hover:bg-vscode-hover">File</span>
            <span className="hover:text-vscode-text cursor-pointer px-2 py-0.5 rounded hover:bg-vscode-hover">Edit</span>
            <span className="hover:text-vscode-text cursor-pointer px-2 py-0.5 rounded hover:bg-vscode-hover">View</span>
            <span className="hover:text-vscode-text cursor-pointer px-2 py-0.5 rounded hover:bg-vscode-hover">Help</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowApiKey(true)}
            className="text-xs px-2 py-1 rounded bg-vscode-accent text-white hover:bg-opacity-80 transition-all"
          >
            API Key
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-1.5 rounded hover:bg-vscode-hover transition-colors"
          >
            <Settings size={16} />
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div 
          style={{ width: leftPanelWidth }} 
          className="flex flex-col border-r border-vscode-border bg-vscode-sidebar"
        >
          <Sidebar />
        </div>

        {/* Resizer */}
        <div 
          className="resizer"
          onMouseDown={(e) => {
            e.preventDefault()
            document.addEventListener('mousemove', handleResizeLeft)
            document.addEventListener('mouseup', () => {
              document.removeEventListener('mousemove', handleResizeLeft)
            }, { once: true })
          }}
        />

        {/* Center - Editor + Terminal */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tabs */}
          <div className="tab-bar h-9 bg-vscode-sidebar border-b border-vscode-border">
            <EditorTabs />
          </div>

          {/* Editor Area */}
          <div className={`flex-1 overflow-hidden ${showTerminal ? 'h-1/2' : 'h-full'}`}>
            <Editor />
          </div>

          {/* Resizer Horizontal */}
          {showTerminal && (
            <div 
              className="resizer-horizontal"
              onMouseDown={(e) => {
                e.preventDefault()
                const startY = e.clientY
                const editorHeight = document.querySelector('.editor-container')?.clientHeight || 300
                
                const handleMouseMove = (e) => {
                  const delta = startY - e.clientY
                  const newHeight = Math.max(100, Math.min(600, editorHeight + delta))
                  const container = document.querySelector('.center-container')
                  if (container) {
                    const editorEl = container.querySelector('.editor-container')
                    const terminalEl = container.querySelector('.terminal-container')
                    if (editorEl && terminalEl) {
                      editorEl.style.height = `${newHeight}px`
                      terminalEl.style.height = `calc(100% - ${newHeight}px)`
                    }
                  }
                }
                
                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', () => {
                  document.removeEventListener('mousemove', handleMouseMove)
                }, { once: true })
              }}
            />
          )}

          {/* Terminal */}
          {showTerminal && (
            <div className="h-48 bg-black border-t border-vscode-border flex flex-col">
              <div className="flex items-center justify-between px-3 py-1 bg-vscode-sidebar border-b border-vscode-border">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setActiveRightTab('chat')}
                    className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors ${
                      activeRightTab === 'chat' ? 'bg-vscode-accent text-white' : 'hover:bg-vscode-hover'
                    }`}
                  >
                    <MessageSquare size={14} />
                    Chat
                  </button>
                  <button 
                    onClick={() => setActiveRightTab('terminal')}
                    className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors ${
                      activeRightTab === 'terminal' ? 'bg-vscode-accent text-white' : 'hover:bg-vscode-hover'
                    }`}
                  >
                    <TerminalIcon size={14} />
                    Terminal
                  </button>
                </div>
                <button 
                  onClick={() => setShowTerminal(false)}
                  className="p-1 hover:bg-vscode-hover rounded transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-auto p-2 font-mono text-sm">
                <Terminal />
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Chat */}
        <div 
          style={{ width: rightPanelWidth }} 
          className="flex flex-col bg-vscode-sidebar border-l border-vscode-border"
        >
          <ChatHeader 
            activeRightTab={activeRightTab} 
            setActiveRightTab={setActiveRightTab}
            setShowTerminal={setShowTerminal}
          />
          <div className="resizer-horizontal mx-2" 
            onMouseDown={(e) => {
              e.preventDefault()
              const startY = e.clientY
              const chatHeight = document.querySelector('.chat-container')?.clientHeight || 400
              
              const handleMouseMove = (e) => {
                const delta = startY - e.clientY
                const newHeight = Math.max(200, Math.min(800, chatHeight + delta))
                const chatEl = document.querySelector('.chat-container')
                if (chatEl) chatEl.style.height = `${newHeight}px`
              }
              
              document.addEventListener('mousemove', handleMouseMove)
              document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', handleMouseMove)
              }, { once: true })
            }}
          />
          <div className="flex-1 overflow-hidden">
            {activeRightTab === 'chat' ? <Chat /> : null}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-vscode-accent flex items-center justify-between px-3 text-xs text-white">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Ready
          </span>
          <span>Line 1, Col 1</span>
        </div>
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>JavaScript</span>
          <span>INS</span>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
        {showApiKey && (
          <ApiKeyModal onClose={() => setShowApiKey(false)} />
        )}
      </AnimatePresence>

      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}

function EditorTabs() {
  const { openFiles, currentFile, setCurrentFile, closeFile } = useStore()

  return (
    <div className="flex items-center h-full overflow-x-auto">
      {openFiles.map((file, index) => (
        <motion.div
          key={file}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`vscode-tab flex items-center gap-2 group ${currentFile === file ? 'active' : ''}`}
          onClick={() => setCurrentFile(file)}
        >
          <span className="text-xs">{file.split('/').pop()}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeFile(file)
            }}
            className="opacity-0 group-hover:opacity-100 hover:bg-vscode-hover rounded p-0.5 transition-all"
          >
            ✕
          </button>
        </motion.div>
      ))}
      {openFiles.length === 0 && (
        <div className="vscode-tab text-gray-500 text-xs">
          No files open
        </div>
      )}
    </div>
  )
}

function ChatHeader({ activeRightTab, setActiveRightTab, setShowTerminal }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-vscode-border">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => {
            setActiveRightTab('chat')
            setShowTerminal(false)
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
            activeRightTab === 'chat' ? 'bg-vscode-accent text-white' : 'hover:bg-vscode-hover'
          }`}
        >
          <MessageSquare size={16} />
          Chat
        </button>
        <SubagentTabs />
      </div>
    </div>
  )
}

function SubagentTabs() {
  const { subagents, activeSubagentId, setActiveSubagent, removeSubagent, addSubagent } = useStore()

  const createNewSubagent = () => {
    const id = Date.now().toString()
    addSubagent({
      id,
      name: `Agent ${subagents.length + 1}`,
      status: 'idle',
      messages: []
    })
    setActiveSubagent(id)
  }

  return (
    <div className="flex items-center gap-1">
      {subagents.map(agent => (
        <div 
          key={agent.id}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs cursor-pointer transition-colors ${
            activeSubagentId === agent.id ? 'bg-vscode-active' : 'hover:bg-vscode-hover'
          }`}
          onClick={() => setActiveSubagent(agent.id)}
        >
          <span className={`w-2 h-2 rounded-full ${
            agent.status === 'thinking' ? 'bg-yellow-400 animate-pulse' :
            agent.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
          }`} />
          <span>{agent.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              removeSubagent(agent.id)
            }}
            className="ml-1 hover:text-vscode-error"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={createNewSubagent}
        className="p-1 rounded hover:bg-vscode-hover transition-colors"
        title="Create new subagent"
      >
        +
      </button>
    </div>
  )
}

export default App