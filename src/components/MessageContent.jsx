import React, { useState } from 'react'
import { Copy, Check, FileDown, Play } from 'lucide-react'
import useStore from '../store/useStore'

function MessageContent({ content }) {
  const [copiedIndex, setCopiedIndex] = useState(null)
  const { setFileContent, currentFile, addOpenFile, setCurrentFile } = useStore()

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const applyCodeToFile = (code) => {
    if (currentFile) {
      setFileContent(currentFile, code)
      addOpenFile(currentFile)
      setCurrentFile(currentFile)
    }
  }

  // Parse content with code blocks
  const renderContent = () => {
    const parts = []
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    let lastIndex = 0
    let match
    let blockIndex = 0

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        })
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'plaintext',
        content: match[2].trim(),
        index: blockIndex++
      })

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      })
    }

    return parts.map((part, i) => {
      if (part.type === 'code') {
        return (
          <div key={i} className="my-3">
            <div className="flex items-center justify-between px-3 py-2 bg-vscode-sidebar rounded-t-lg border border-vscode-border border-b-0">
              <span className="text-xs text-gray-400">{part.language}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(part.content, part.index)}
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-vscode-hover transition-colors"
                >
                  {copiedIndex === part.index ? <Check size={12} className="text-vscode-success" /> : <Copy size={12} />}
                  {copiedIndex === part.index ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => applyCodeToFile(part.content)}
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-vscode-hover transition-colors"
                >
                  <FileDown size={12} />
                  Apply
                </button>
              </div>
            </div>
            <pre className="bg-vscode-editor border border-vscode-border rounded-b-lg p-4 overflow-x-auto">
              <code className={`language-${part.language} text-sm font-mono`}>
                <SyntaxHighlighter code={part.content} language={part.language} />
              </code>
            </pre>
          </div>
        )
      }

      return (
        <p key={i} className="text-sm whitespace-pre-wrap leading-relaxed">
          {renderMarkdown(part.content)}
        </p>
      )
    })
  }

  return <div className="space-y-1">{renderContent()}</div>
}

function renderMarkdown(text) {
  // Simple markdown rendering
  const lines = text.split('\n')
  
  return lines.map((line, i) => {
    // Headers
    if (line.startsWith('### ')) {
      return <h3 key={i} className="text-base font-semibold mt-3 mb-1">{line.slice(4)}</h3>
    }
    if (line.startsWith('## ')) {
      return <h2 key={i} className="text-lg font-semibold mt-3 mb-1">{line.slice(3)}</h2>
    }
    if (line.startsWith('# ')) {
      return <h1 key={i} className="text-xl font-bold mt-3 mb-1">{line.slice(2)}</h1>
    }
    
    // Lists
    if (line.match(/^[-*]\s/)) {
      return <li key={i} className="ml-4 list-disc">{renderInline(line.slice(2))}</li>
    }
    if (line.match(/^\d+\.\s/)) {
      return <li key={i} className="ml-4 list-decimal">{renderInline(line.replace(/^\d+\.\s/, ''))}</li>
    }
    
    // Bold and italic
    if (line.match(/^\s*$/)) {
      return <br key={i} />
    }

    return <span key={i}>{renderInline(line)}<br /></span>
  })
}

function renderInline(text) {
  // Bold
  let result = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
  // Inline code
  result = result.replace(/`(.+?)`/g, '<code class="px-1 py-0.5 bg-vscode-sidebar rounded text-vscode-success text-xs">$1</code>')
  // Links
  result = result.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-vscode-accent hover:underline" target="_blank">$1</a>')
  
  return <span dangerouslySetInnerHTML={{ __html: result }} />
}

function SyntaxHighlighter({ code, language }) {
  // Simple syntax highlighting
  const tokens = tokenize(code, language)
  
  return (
    <>
      {tokens.map((token, i) => (
        <span key={i} className={`token ${token.type}`}>
          {token.content}
        </span>
      ))}
    </>
  )
}

function tokenize(code, language) {
  const tokens = []
  const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'true', 'false', 'null', 'undefined', 'typeof', 'instanceof']
  const types = ['string', 'number', 'boolean', 'object', 'array', 'void', 'any', 'interface', 'type']
  
  let i = 0
  while (i < code.length) {
    // Whitespace
    if (/\s/.test(code[i])) {
      let whitespace = ''
      while (i < code.length && /\s/.test(code[i])) {
        whitespace += code[i++]
      }
      tokens.push({ type: 'whitespace', content: whitespace })
      continue
    }
    
    // Comments
    if (code.slice(i, i + 2) === '//') {
      let comment = ''
      while (i < code.length && code[i] !== '\n') {
        comment += code[i++]
      }
      tokens.push({ type: 'comment', content: comment })
      continue
    }
    
    // Strings
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i]
      let str = code[i++]
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\' && i + 1 < code.length) {
          str += code[i++] + code[i++]
        } else {
          str += code[i++]
        }
      }
      if (i < code.length) str += code[i++]
      tokens.push({ type: 'string', content: str })
      continue
    }
    
    // Numbers
    if (/\d/.test(code[i])) {
      let num = ''
      while (i < code.length && /[\d.]/.test(code[i])) {
        num += code[i++]
      }
      tokens.push({ type: 'number', content: num })
      continue
    }
    
    // Identifiers and keywords
    if (/[a-zA-Z_$]/.test(code[i])) {
      let word = ''
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) {
        word += code[i++]
      }
      
      if (keywords.includes(word)) {
        tokens.push({ type: 'keyword', content: word })
      } else if (types.includes(word)) {
        tokens.push({ type: 'type', content: word })
      } else if (i < code.length && code[i] === '(') {
        tokens.push({ type: 'function', content: word })
      } else {
        tokens.push({ type: 'variable', content: word })
      }
      continue
    }
    
    // Operators and punctuation
    if (/[{}()[\];:,.<>?!@#%^&*+=\-/|\\~`]/.test(code[i])) {
      tokens.push({ type: 'punctuation', content: code[i++] })
      continue
    }
    
    // Default
    tokens.push({ type: 'default', content: code[i++] })
  }
  
  return tokens
}

export default MessageContent