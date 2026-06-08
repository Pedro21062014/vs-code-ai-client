import React, { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

const defaultCode = `// Welcome to VS Code AI Client!
// Start coding and use the AI chat to help you.

import React from 'react'

function App() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(prev => prev + 1)
    console.log('Count:', count + 1)
  }

  return (
    <div classNameName="app">
      <h1>Hello, AI Assistant!</h1>
      <p>Count: {count}</p>
      <button onClick={handleClick}>
        Increment
      </button>
    </div>
  )
}

export default App
`

const packageJsonCode = `{
  "name": "vs-code-ai-client",
  "version": "1.0.0",
  "description": "VS Code AI Client with real-time AI chat",
  "main": "src/index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.2"
  }
}`

const readmeCode = `# VS Code AI Client

A powerful IDE with integrated AI chat for real-time assistance.

## Features

- 🤖 AI Chat powered by Claude API
- 📁 File Explorer with tree view
- 💻 Monaco Editor with syntax highlighting
- 🔧 Terminal integration
- 🧩 Subagents for parallel AI tasks
- 🎨 VS Code-like dark theme

## Getting Started

1. Enter your API key in the settings
2. Open a file from the explorer
3. Start chatting with the AI!

## Usage

Use the chat to:
- Ask questions about your code
- Generate new code
- Debug issues
- Refactor existing code
- Create documentation

Enjoy coding with AI assistance! 🚀
`

const helpersCode = `// Utility helper functions

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}
`

const buttonCode = `import React from 'react'

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick,
  disabled = false,
  className = ''
}) {
  const baseStyles = 'font-medium rounded transition-all duration-200 active:scale-95'
  
  const variants = {
    primary: 'bg-vscode-accent text-white hover:bg-opacity-80',
    secondary: 'bg-vscode-sidebar text-vscode-text hover:bg-vscode-hover border border-vscode-border',
    danger: 'bg-vscode-error text-white hover:bg-opacity-80',
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={\`\${baseStyles} \${variants[variant]} \${sizes[size]} \${className}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
`

const cardCode = `import React from 'react'

export function Card({ 
  title, 
  children, 
  footer,
  className = '',
  onClick
}) {
  return (
    <div 
      className={\`bg-vscode-editor border border-vscode-border rounded-lg overflow-hidden \${className}\`}
      onClick={onClick}
    >
      {title && (
        <div className="px-4 py-3 border-b border-vscode-border bg-vscode-sidebar">
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
      {footer && (
        <div className="px-4 py-3 border-t border-vscode-border bg-vscode-sidebar">
          {footer}
        </div>
      )}
    </div>
  )
}
`

function CodeEditor() {
  const { currentFile, setFileContent, fileContent } = useStore()
  const [editorContent, setEditorContent] = useState('')
  const [language, setLanguage] = useState('javascript')

  useEffect(() => {
    if (currentFile) {
      const content = getFileContent(currentFile)
      setEditorContent(content)
      
      const ext = currentFile.split('.').pop()
      const langMap = {
        js: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        json: 'json',
        md: 'markdown',
        css: 'css',
        html: 'html',
        py: 'python',
      }
      setLanguage(langMap[ext] || 'plaintext')
    }
  }, [currentFile])

  const getFileContent = (path) => {
    const fileMap = {
      'src/App.jsx': defaultCode,
      'package.json': packageJsonCode,
      'README.md': readmeCode,
      'src/utils/helpers.js': helpersCode,
      'src/components/Button.jsx': buttonCode,
      'src/components/Card.jsx': cardCode,
    }
    return fileMap[path] || fileContent[path] || '// File not found'
  }

  const handleEditorChange = (value) => {
    setEditorContent(value)
    if (currentFile) {
      setFileContent(currentFile, value)
    }
  }

  const getTheme = () => {
    return 'vs-dark'
  }

  if (!currentFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-vscode-editor text-gray-500">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-xl font-semibold mb-2">No File Open</h2>
        <p className="text-sm">Select a file from the explorer to start editing</p>
        <div className="mt-8 flex flex-col gap-2 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-vscode-sidebar rounded">Ctrl</span>
            <span>+</span>
            <span className="px-2 py-0.5 bg-vscode-sidebar rounded">P</span>
            <span>Quick Open</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-vscode-sidebar rounded">Ctrl</span>
            <span>+</span>
            <span className="px-2 py-0.5 bg-vscode-sidebar rounded">K</span>
            <span>Command Palette</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-vscode-editor editor-container">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-vscode-border bg-vscode-sidebar">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Editing:</span>
          <span className="text-sm font-medium">{currentFile}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="px-2 py-1 text-xs rounded hover:bg-vscode-hover transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(editorContent)
              toast.success('Copied to clipboard!')
            }}
          >
            Copy
          </button>
          <button 
            className="px-2 py-1 text-xs rounded bg-vscode-accent text-white hover:bg-opacity-80 transition-colors"
            onClick={() => toast.success('File saved!')}
          >
            Save
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={editorContent}
          onChange={handleEditorChange}
          theme={getTheme()}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            renderWhitespace: 'selection',
            tabSize: 2,
            wordWrap: 'on',
            automaticLayout: true,
            padding: { top: 10 },
            lineNumbers: 'on',
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            cursorBlinking: 'smooth',
            smoothScrolling: true,
          }}
        />
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between px-4 py-1 border-t border-vscode-border bg-vscode-sidebar text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>LF</span>
          <span>{language.charAt(0).toUpperCase() + language.slice(1)}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln 1, Col 1</span>
          <span>{editorContent.split('\n').length} lines</span>
        </div>
      </div>
    </div>
  )
}

export default CodeEditor