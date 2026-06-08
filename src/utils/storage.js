// Storage utilities for localStorage management

const STORAGE_KEYS = {
  API_KEY: 'vscode_ai_api_key',
  SETTINGS: 'vscode_ai_settings',
  THEME: 'vscode_ai_theme',
  EXTENSIONS: 'vscode_ai_extensions',
  RECENT_FILES: 'vscode_ai_recent_files',
  CHAT_HISTORY: 'vscode_ai_chat_history',
}

export const storage = {
  // Generic methods
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Storage set error:', error)
      return false
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Storage get error:', error)
      return defaultValue
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Storage remove error:', error)
      return false
    }
  },

  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error('Storage clear error:', error)
      return false
    }
  },

  // Specific methods
  saveApiKey(key) {
    // Note: In production, consider encrypting this
    return this.set(STORAGE_KEYS.API_KEY, key)
  },

  getApiKey() {
    return this.get(STORAGE_KEYS.API_KEY, '')
  },

  clearApiKey() {
    return this.remove(STORAGE_KEYS.API_KEY)
  },

  saveSettings(settings) {
    return this.set(STORAGE_KEYS.SETTINGS, settings)
  },

  getSettings() {
    return this.get(STORAGE_KEYS.SETTINGS, {
      model: 'claude-3-5-sonnet-20240620',
      autoSave: true,
      fontSize: 14,
      tabSize: 2,
    })
  },

  saveTheme(theme) {
    return this.set(STORAGE_KEYS.THEME, theme)
  },

  getTheme() {
    return this.get(STORAGE_KEYS.THEME, 'dark')
  },

  saveRecentFile(path) {
    const recent = this.get(STORAGE_KEYS.RECENT_FILES, [])
    const updated = [path, ...recent.filter(p => p !== path)].slice(0, 10)
    return this.set(STORAGE_KEYS.RECENT_FILES, updated)
  },

  getRecentFiles() {
    return this.get(STORAGE_KEYS.RECENT_FILES, [])
  },

  saveChatHistory(messages) {
    // Only save last 100 messages
    const trimmed = messages.slice(-100)
    return this.set(STORAGE_KEYS.CHAT_HISTORY, trimmed)
  },

  getChatHistory() {
    return this.get(STORAGE_KEYS.CHAT_HISTORY, [])
  },

  clearChatHistory() {
    return this.remove(STORAGE_KEYS.CHAT_HISTORY)
  },

  // Extension storage
  saveExtensions(extensions) {
    return this.set(STORAGE_KEYS.EXTENSIONS, extensions)
  },

  getExtensions() {
    return this.get(STORAGE_KEYS.EXTENSIONS, [])
  },
}

// File system simulation (in-browser)
export const virtualFS = {
  files: {},
  
  read(path) {
    return this.files[path] || null
  },
  
  write(path, content) {
    this.files[path] = content
    return true
  },
  
  delete(path) {
    delete this.files[path]
    return true
  },
  
  list(dir) {
    return Object.keys(this.files).filter(f => f.startsWith(dir))
  },
  
  exists(path) {
    return path in this.files
  },
  
  clear() {
    this.files = {}
  }
}

// Export keys for external use
export { STORAGE_KEYS }