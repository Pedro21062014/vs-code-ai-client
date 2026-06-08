import React, { useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import { X, Save, Moon, Sun, Code, Palette } from 'lucide-react'

function SettingsModal({ onClose }) {
  const { theme, setTheme, model, setModel, extensions, toggleExtension } = useStore()
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', label: 'General', icon: <Code size={16} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={16} /> },
    { id: 'extensions', label: 'Extensions', icon: <span>🧩</span> },
    { id: 'about', label: 'About', icon: <span>ℹ️</span> },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-[800px] h-[500px] bg-vscode-sidebar border border-vscode-border rounded-lg shadow-2xl flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar */}
        <div className="w-48 border-r border-vscode-border bg-vscode-editor p-2">
          <h2 className="text-sm font-semibold px-3 py-2 mb-2">Settings</h2>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-vscode-active text-vscode-text'
                  : 'hover:bg-vscode-hover text-gray-400'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'appearance' && <AppearanceSettings theme={theme} setTheme={setTheme} />}
          {activeTab === 'extensions' && <ExtensionsSettings extensions={extensions} toggleExtension={toggleExtension} />}
          {activeTab === 'about' && <AboutSettings />}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded hover:bg-vscode-hover transition-colors"
        >
          <X size={20} />
        </button>
      </motion.div>
    </motion.div>
  )
}

function GeneralSettings() {
  const { model, setModel } = useStore()

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">General Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">AI Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-vscode-editor border border-vscode-border rounded px-3 py-2 text-sm focus:outline-none focus:border-vscode-accent"
          >
            <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet (Recommended)</option>
            <option value="claude-3-opus-20240229">Claude 3 Opus</option>
            <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Higher models are smarter but use more tokens.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Auto-save</label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span className="text-sm">Automatically save files when changed</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Font Size</label>
          <input
            type="range"
            min="10"
            max="24"
            defaultValue="14"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tab Size</label>
          <select
            defaultValue="2"
            className="bg-vscode-editor border border-vscode-border rounded px-3 py-2 text-sm focus:outline-none focus:border-vscode-accent"
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tab</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function AppearanceSettings({ theme, setTheme }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Appearance</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3">Theme</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'dark' ? 'border-vscode-accent bg-vscode-hover' : 'border-vscode-border hover:border-vscode-hover'
              }`}
            >
              <div className="w-full h-20 bg-vscode-bg rounded mb-2 flex items-center justify-center">
                <Moon size={24} className="text-vscode-accent" />
              </div>
              <span className="text-sm font-medium">Dark Theme</span>
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'light' ? 'border-vscode-accent bg-gray-100' : 'border-vscode-border hover:border-gray-300'
              }`}
            >
              <div className="w-full h-20 bg-white rounded mb-2 flex items-center justify-center">
                <Sun size={24} className="text-yellow-500" />
              </div>
              <span className="text-sm font-medium">Light Theme</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Font Family</label>
          <select
            defaultValue="jetbrains"
            className="w-full bg-vscode-editor border border-vscode-border rounded px-3 py-2 text-sm focus:outline-none focus:border-vscode-accent"
          >
            <option value="jetbrains">JetBrains Mono</option>
            <option value="fira">Fira Code</option>
            <option value="consolas">Consolas</option>
            <option value="monaco">Monaco</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cursor Style</label>
          <select
            defaultValue="block"
            className="w-full bg-vscode-editor border border-vscode-border rounded px-3 py-2 text-sm focus:outline-none focus:border-vscode-accent"
          >
            <option value="block">Block</option>
            <option value="line">Line</option>
            <option value="underline">Underline</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span className="text-sm">Show minimap</span>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span className="text-sm">Show line numbers</span>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded" />
            <span className="text-sm">Word wrap</span>
          </label>
        </div>
      </div>
    </div>
  )
}

function ExtensionsSettings({ extensions, toggleExtension }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Extensions</h3>
      
      <div className="space-y-3">
        {extensions.map((ext) => (
          <div
            key={ext.id}
            className="flex items-center justify-between p-3 bg-vscode-editor rounded-lg border border-vscode-border"
          >
            <div>
              <h4 className="text-sm font-medium">{ext.name}</h4>
              <p className="text-xs text-gray-400">{ext.id}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={ext.enabled}
                onChange={() => toggleExtension(ext.id)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vscode-accent"></div>
            </label>
          </div>
        ))}

        <button className="w-full p-3 border-2 border-dashed border-vscode-border rounded-lg text-sm text-gray-400 hover:border-vscode-accent hover:text-vscode-accent transition-colors">
          + Install Extension
        </button>
      </div>
    </div>
  )
}

function AboutSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">About</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <img src="/vscode-icon.svg" alt="VS Code AI" className="w-16 h-16" />
          <div>
            <h4 className="text-xl font-bold gradient-text">VS Code AI Client</h4>
            <p className="text-sm text-gray-400">Version 1.0.0</p>
          </div>
        </div>

        <p className="text-sm text-gray-400">
          A powerful IDE with integrated AI chat for real-time assistance.
          Built with React, Monaco Editor, and Framer Motion.
        </p>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {['React 18', 'Vite', 'Monaco Editor', 'Framer Motion', 'Tailwind CSS', 'Zustand', 'Anthropic API'].map((tech) => (
              <span key={tech} className="px-2 py-1 bg-vscode-editor rounded text-xs">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Keyboard Shortcuts</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between"><span>Quick Open</span><kbd className="px-2 py-0.5 bg-vscode-sidebar rounded">Ctrl+P</kbd></div>
            <div className="flex justify-between"><span>Command Palette</span><kbd className="px-2 py-0.5 bg-vscode-sidebar rounded">Ctrl+Shift+P</kbd></div>
            <div className="flex justify-between"><span>Find</span><kbd className="px-2 py-0.5 bg-vscode-sidebar rounded">Ctrl+F</kbd></div>
            <div className="flex justify-between"><span>Replace</span><kbd className="px-2 py-0.5 bg-vscode-sidebar rounded">Ctrl+H</kbd></div>
            <div className="flex justify-between"><span>Save</span><kbd className="px-2 py-0.5 bg-vscode-sidebar rounded">Ctrl+S</kbd></div>
            <div className="flex justify-between"><span>New Tab</span><kbd className="px-2 py-0.5 bg-vscode-sidebar rounded">Ctrl+T</kbd></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal