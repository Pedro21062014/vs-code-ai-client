import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'
import { 
  Folder, FolderOpen, File, ChevronRight, ChevronDown, 
  Plus, FilePlus, FolderPlus, MoreVertical, Search, GitBranch
} from 'lucide-react'

const fileIcons = {
  js: '🟨',
  jsx: '⚛️',
  ts: '🔷',
  tsx: '⚛️',
  json: '📋',
  md: '📝',
  css: '🎨',
  html: '🌐',
  py: '🐍',
  gitignore: '📁',
  lock: '🔒',
}

function Sidebar() {
  const { files, setCurrentFile, addOpenFile, currentFile } = useStore()
  const [expandedFolders, setExpandedFolders] = useState(['src', 'src/components', 'src/utils'])
  const [searchQuery, setSearchQuery] = useState('')
  const [contextMenu, setContextMenu] = useState(null)

  const toggleFolder = (path) => {
    setExpandedFolders(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    )
  }

  const handleFileClick = (file) => {
    setCurrentFile(file.path)
    addOpenFile(file.path)
  }

  const renderFileTree = (items, depth = 0) => {
    return items.map(item => {
      const isExpanded = expandedFolders.includes(item.path)
      const isActive = currentFile === item.path

      if (item.type === 'folder') {
        return (
          <div key={item.path}>
            <motion.div
              className={`tree-item ${isExpanded ? 'bg-vscode-hover' : ''}`}
              style={{ paddingLeft: depth * 12 + 8 }}
              whileHover={{ backgroundColor: '#2a2d2e' }}
              onClick={() => toggleFolder(item.path)}
              onContextMenu={(e) => {
                e.preventDefault()
                setContextMenu({ x: e.clientX, y: e.clientY, item })
              }}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              {isExpanded ? <FolderOpen size={16} className="text-vscode-warning" /> : <Folder size={16} className="text-vscode-warning" />}
              <span className="text-sm truncate">{item.name}</span>
            </motion.div>
            <AnimatePresence>
              {isExpanded && item.children && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderFileTree(item.children, depth + 1)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      }

      const ext = item.name.split('.').pop()
      const icon = fileIcons[ext] || '📄'

      return (
        <motion.div
          key={item.path}
          className={`tree-item ${isActive ? 'active' : ''}`}
          style={{ paddingLeft: depth * 12 + 28 }}
          whileHover={{ backgroundColor: '#2a2d2e' }}
          onClick={() => handleFileClick(item)}
          onContextMenu={(e) => {
            e.preventDefault()
            setContextMenu({ x: e.clientX, y: e.clientY, item })
          }}
        >
          <span className="text-sm">{icon}</span>
          <span className="text-sm truncate">{item.name}</span>
        </motion.div>
      )
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Activity Bar */}
      <div className="flex items-center justify-center py-2 border-b border-vscode-border">
        <div className="flex flex-col items-center gap-3">
          <FileExplorerIcon />
          <GitBranchIcon />
          <SearchIcon />
        </div>
      </div>

      {/* Explorer Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-vscode-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Explorer
        </span>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-vscode-hover transition-colors" title="New File">
            <FilePlus size={14} />
          </button>
          <button className="p-1 rounded hover:bg-vscode-hover transition-colors" title="New Folder">
            <FolderPlus size={14} />
          </button>
          <button className="p-1 rounded hover:bg-vscode-hover transition-colors" title="More Actions">
            <MoreVertical size={14} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-2 py-2 border-b border-vscode-border">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2 py-1 text-xs bg-vscode-editor border border-vscode-border rounded focus:outline-none focus:border-vscode-accent"
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {renderFileTree(files)}
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setContextMenu(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed z-50 bg-vscode-sidebar border border-vscode-border rounded-lg shadow-xl py-1 min-w-48"
              style={{ left: contextMenu.x, top: contextMenu.y }}
            >
              <ContextMenuItem icon={<FilePlus size={14} />} label="New File" />
              <ContextMenuItem icon={<FolderPlus size={14} />} label="New Folder" />
              <div className="border-t border-vscode-border my-1" />
              <ContextMenuItem icon={<span>📋</span>} label="Copy" />
              <ContextMenuItem icon={<span>✂️</span>} label="Cut" />
              <ContextMenuItem icon={<span>📋</span>} label="Paste" />
              <ContextMenuItem icon={<span>🗑️</span>} label="Delete" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function ContextMenuItem({ icon, label, onClick }) {
  return (
    <button 
      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-vscode-hover transition-colors"
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function FileExplorerIcon() {
  return (
    <div className="w-6 h-6 flex items-center justify-center text-vscode-accent">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H13L11 5H5C3.89543 5 3 5.89543 3 7Z" />
      </svg>
    </div>
  )
}

function GitBranchIcon() {
  return (
    <div className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-vscode-text cursor-pointer">
      <GitBranch size={18} />
    </div>
  )
}

function SearchIcon() {
  return (
    <div className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-vscode-text cursor-pointer">
      <Search size={18} />
    </div>
  )
}

export default Sidebar