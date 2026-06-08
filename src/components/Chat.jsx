import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'
import { Send, Copy, Play, FileDown, Wand2, Plus, X, Loader2 } from 'lucide-react'
import ThinkingAnimation from './ThinkingAnimation'
import MessageContent from './MessageContent'

function Chat() {
  const { 
    messages, 
    addMessage, 
    isThinking, 
    setThinking, 
    streamingContent,
    setStreamingContent,
    apiKey,
    model,
    currentFile,
    fileContent,
    openFiles,
    addSubagent,
    subagents,
    activeSubagentId,
    setActiveSubagent,
  } = useStore()
  
  const [input, setInput] = useState('')
  const [context, setContext] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || !apiKey) return

    const userMessage = input.trim()
    setInput('')
    setThinking(true)
    setStreamingContent('')

    // Add user message
    addMessage({
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    })

    // Build context
    const contextInfo = {
      currentFile,
      currentFileContent: currentFile ? (fileContent[currentFile] || '') : '',
      openFiles,
      allOpenFileContents: openFiles.map(f => `${f}:\n${fileContent[f] || ''}`).join('\n\n'),
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: model || 'claude-3-5-sonnet-20240620',
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: `Current context:\n${JSON.stringify(contextInfo, null, 2)}\n\nUser message: ${userMessage}\n\nYou are a helpful AI coding assistant. You can use tools to read files, write code, execute commands, and help with various tasks.`
            }
          ],
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      setThinking(false)
      
      const aiContent = data.content?.[0]?.text || 'No response received'
      
      addMessage({
        id: Date.now(),
        role: 'assistant',
        content: aiContent,
        timestamp: Date.now()
      })
    } catch (error) {
      setThinking(false)
      addMessage({
        id: Date.now(),
        role: 'assistant',
        content: `❌ Error: ${error.message}\n\nPlease check your API key and try again.`,
        timestamp: Date.now()
      })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const createSubagent = () => {
    const id = Date.now().toString()
    addSubagent({
      id,
      name: `Agent ${subagents.length + 1}`,
      status: 'idle',
      messages: [{ role: 'system', content: 'You are a specialized AI assistant.' }]
    })
    setActiveSubagent(id)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex flex-col h-full chat-container">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <WelcomeMessage onSuggestion={(text) => setInput(text)} />
        )}
        
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-vscode-accent text-white' 
                    : 'bg-vscode-editor border border-vscode-border'
                }`}>
                  {message.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <MessageContent content={message.content} />
                  )}
                </div>
                
                {/* Message Actions */}
                <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  {message.role === 'assistant' && (
                    <>
                      <button 
                        className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-vscode-hover transition-colors"
                        onClick={() => copyToClipboard(message.content)}
                      >
                        <Copy size={12} /> Copy
                      </button>
                      <button 
                        className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-vscode-hover transition-colors"
                        onClick={() => {/* Apply to editor */}}
                      >
                        <FileDown size={12} /> Apply
                      </button>
                      <button 
                        className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-vscode-hover transition-colors"
                        onClick={() => {/* Run command */}}
                      >
                        <Play size={12} /> Run
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Thinking Animation */}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-vscode-editor border border-vscode-border rounded-lg p-4">
              <ThinkingAnimation />
              <p className="text-sm text-gray-400 mt-2">AI is thinking...</p>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-vscode-border flex items-center gap-2">
        <button 
          className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-vscode-hover hover:bg-vscode-active transition-colors"
          onClick={createSubagent}
        >
          <Plus size={12} /> Subagent
        </button>
        <button 
          className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-vscode-hover hover:bg-vscode-active transition-colors"
        >
          <Wand2 size={12} /> Improve
        </button>
        <button 
          className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-vscode-hover hover:bg-vscode-active transition-colors"
        >
          <Play size={12} /> Run
        </button>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-vscode-border">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the AI anything... (Shift+Enter for new line)"
              className="w-full bg-vscode-editor border border-vscode-border rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-vscode-accent transition-colors"
              rows={3}
              disabled={isThinking}
            />
          </div>
          <motion.button
            type="submit"
            disabled={!input.trim() || isThinking}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-lg transition-colors ${
              input.trim() && !isThinking
                ? 'bg-vscode-accent text-white hover:bg-opacity-80'
                : 'bg-vscode-hover text-gray-500 cursor-not-allowed'
            }`}
          >
            {isThinking ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </motion.button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  )
}

function WelcomeMessage({ onSuggestion }) {
  const suggestions = [
    { icon: '🔍', text: 'Explain this code', prompt: 'Explain what this code does' },
    { icon: '✨', text: 'Refactor code', prompt: 'Refactor this code to be more efficient' },
    { icon: '🐛', text: 'Find bugs', prompt: 'Find potential bugs in this code' },
    { icon: '📝', text: 'Write tests', prompt: 'Write unit tests for this code' },
    { icon: '📚', text: 'Document', prompt: 'Add documentation to this code' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8"
    >
      <div className="text-5xl mb-4">🤖</div>
      <h2 className="text-xl font-semibold mb-2">Welcome to AI Chat</h2>
      <p className="text-sm text-gray-400 mb-6">How can I help you today?</p>
      
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSuggestion(s.prompt)}
            className="flex items-center gap-2 px-4 py-2 bg-vscode-sidebar border border-vscode-border rounded-full text-sm hover:bg-vscode-hover transition-colors"
          >
            <span>{s.icon}</span>
            <span>{s.text}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export default Chat