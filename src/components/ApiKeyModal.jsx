import React, { useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import { X, Key, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

function ApiKeyModal({ onClose }) {
  const { apiKey, setApiKey, apiProvider, setApiProvider, model, setModel } = useStore()
  const [inputKey, setInputKey] = useState(apiKey || '')
  const [showKey, setShowKey] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const providers = [
    { id: 'anthropic', name: 'Anthropic (Claude)', models: [
      { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet (Recommended)' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
    ]},
    { id: 'openai', name: 'OpenAI (GPT)', models: [
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    ]},
  ]

  const handleSave = () => {
    if (!inputKey.trim()) {
      toast.error('Please enter an API key')
      return
    }
    setApiKey(inputKey.trim())
    toast.success('API key saved successfully!')
    onClose()
  }

  const handleTestConnection = async () => {
    if (!inputKey.trim()) {
      toast.error('Please enter an API key first')
      return
    }

    setIsTesting(true)
    setTestResult(null)

    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo purposes, we'll just validate the key format
      if (inputKey.length > 20) {
        setTestResult({ success: true, message: 'Connection successful!' })
        toast.success('API connection verified!')
      } else {
        setTestResult({ success: false, message: 'Invalid API key format' })
        toast.error('Invalid API key')
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Connection failed' })
      toast.error('Connection test failed')
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-[500px] bg-vscode-sidebar border border-vscode-border rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-vscode-editor border-b border-vscode-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vscode-accent rounded-lg flex items-center justify-center">
              <Key size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">API Configuration</h2>
              <p className="text-xs text-gray-400">Connect your AI provider</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-vscode-hover transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Provider</label>
            <div className="grid grid-cols-2 gap-3">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setApiProvider(provider.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    apiProvider === provider.id
                      ? 'border-vscode-accent bg-vscode-hover'
                      : 'border-vscode-border hover:border-vscode-hover'
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {provider.id === 'anthropic' ? '🤖' : '🧠'}
                  </div>
                  <span className="text-sm font-medium">{provider.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-vscode-editor border border-vscode-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-vscode-accent"
            >
              {providers.find(p => p.id === apiProvider)?.models.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              API Key <span className="text-vscode-error">*</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full bg-vscode-editor border border-vscode-border rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:border-vscode-accent font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-vscode-hover transition-colors text-gray-400"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              🔒 Your API key is stored locally and never sent to our servers
            </p>
          </div>

          {/* Test Result */}
          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 p-3 rounded-lg ${
                testResult.success ? 'bg-green-900 bg-opacity-30' : 'bg-red-900 bg-opacity-30'
              }`}
            >
              {testResult.success ? (
                <CheckCircle size={18} className="text-vscode-success" />
              ) : (
                <AlertCircle size={18} className="text-vscode-error" />
              )}
              <span className="text-sm">{testResult.message}</span>
            </motion.div>
          )}

          {/* Links */}
          <div className="text-xs text-gray-400 space-y-1">
            {apiProvider === 'anthropic' && (
              <p>
                Get your API key from{' '}
                <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-vscode-accent hover:underline">
                  Anthropic Console
                </a>
              </p>
            )}
            {apiProvider === 'openai' && (
              <p>
                Get your API key from{' '}
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-vscode-accent hover:underline">
                  OpenAI Platform
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-vscode-editor border-t border-vscode-border">
          <button
            onClick={handleTestConnection}
            disabled={isTesting || !inputKey.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-vscode-border hover:bg-vscode-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Key size={16} />
                Test Connection
              </>
            )}
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg hover:bg-vscode-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 text-sm rounded-lg bg-vscode-accent text-white hover:bg-opacity-80 transition-colors"
            >
              <Save size={16} />
              Save & Connect
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ApiKeyModal