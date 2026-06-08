import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      // Settings
      apiKey: '',
      apiProvider: 'anthropic',
      model: 'claude-3-5-sonnet-20240620',
      theme: 'dark',
      
      // Files
      files: [],
      currentFile: null,
      openFiles: [],
      fileContent: {},
      
      // Chat
      messages: [],
      isThinking: false,
      streamingContent: '',
      
      // Subagents
      subagents: [],
      activeSubagentId: null,
      
      // Extensions
      extensions: [],
      activeExtensions: [],
      
      // Terminal
      terminalHistory: [],
      
      // Actions
      setApiKey: (apiKey) => set({ apiKey }),
      setModel: (model) => set({ model }),
      setTheme: (theme) => set({ theme }),
      
      // File actions
      setFiles: (files) => set({ files }),
      setCurrentFile: (file) => set({ currentFile: file }),
      addOpenFile: (file) => set((state) => ({
        openFiles: state.openFiles.includes(file) ? state.openFiles : [...state.openFiles, file]
      })),
      closeFile: (file) => set((state) => ({
        openFiles: state.openFiles.filter(f => f !== file),
        currentFile: state.currentFile === file ? null : state.currentFile
      })),
      setFileContent: (path, content) => set((state) => ({
        fileContent: { ...state.fileContent, [path]: content }
      })),
      
      // Chat actions
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      updateLastMessage: (content) => set((state) => ({
        messages: state.messages.map((msg, i) => 
          i === state.messages.length - 1 ? { ...msg, content } : msg
        )
      })),
      setThinking: (isThinking) => set({ isThinking }),
      setStreamingContent: (content) => set({ streamingContent: content }),
      clearChat: () => set({ messages: [], streamingContent: '' }),
      
      // Subagent actions
      addSubagent: (subagent) => set((state) => ({
        subagents: [...state.subagents, subagent]
      })),
      removeSubagent: (id) => set((state) => ({
        subagents: state.subagents.filter(s => s.id !== id),
        activeSubagentId: state.activeSubagentId === id ? null : state.activeSubagentId
      })),
      setActiveSubagent: (id) => set({ activeSubagentId: id }),
      updateSubagentMessage: (id, message) => set((state) => ({
        subagents: state.subagents.map(s => 
          s.id === id ? { ...s, messages: [...s.messages, message] } : s
        )
      })),
      
      // Extension actions
      loadExtensions: () => {
        // Load extensions from localStorage or default
        const defaultExtensions = [
          { id: 'theme-dark', name: 'Dark Theme', enabled: true },
          { id: 'syntax-highlight', name: 'Syntax Highlighting', enabled: true },
        ]
        set({ extensions: defaultExtensions })
      },
      toggleExtension: (id) => set((state) => ({
        extensions: state.extensions.map(ext => 
          ext.id === id ? { ...ext, enabled: !ext.enabled } : ext
        )
      })),
      
      // Terminal actions
      addTerminalOutput: (output) => set((state) => ({
        terminalHistory: [...state.terminalHistory.slice(-100), { 
          timestamp: Date.now(), 
          output 
        }]
      })),
    }),
    {
      name: 'vscode-ai-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        model: state.model,
        theme: state.theme,
        extensions: state.extensions,
      }),
    }
  )
)

export default useStore