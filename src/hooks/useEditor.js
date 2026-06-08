import { useState, useCallback, useRef } from 'react'
import useStore from '../store/useStore'

export function useEditor() {
  const { 
    currentFile, 
    setCurrentFile, 
    openFiles, 
    addOpenFile, 
    closeFile,
    fileContent,
    setFileContent,
  } = useStore()

  const editorRef = useRef(null)

  const openFile = useCallback((path) => {
    setCurrentFile(path)
    addOpenFile(path)
  }, [setCurrentFile, addOpenFile])

  const closeTab = useCallback((path) => {
    closeFile(path)
  }, [closeFile])

  const saveFile = useCallback(async (path, content) => {
    setFileContent(path, content)
    // In a real implementation, this would save to disk
    return true
  }, [setFileContent])

  const getContent = useCallback((path) => {
    return fileContent[path] || ''
  }, [fileContent])

  return {
    currentFile,
    openFiles,
    editorRef,
    openFile,
    closeTab,
    saveFile,
    getContent,
  }
}

export function useChat() {
  const {
    messages,
    addMessage,
    isThinking,
    setThinking,
    apiKey,
    model,
    currentFile,
    fileContent,
    openFiles,
  } = useStore()

  const sendMessage = useCallback(async (content) => {
    if (!apiKey) {
      addMessage({
        id: Date.now(),
        role: 'assistant',
        content: '⚠️ Please configure your API key in Settings to use the AI chat.',
        timestamp: Date.now()
      })
      return
    }

    addMessage({
      id: Date.now(),
      role: 'user',
      content,
      timestamp: Date.now()
    })

    setThinking(true)

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
              content: `Current context:\n- Current file: ${currentFile || 'None'}\n- Current file content: ${currentFile ? (fileContent[currentFile] || 'Empty') : 'N/A'}\n- Open files: ${openFiles.join(', ') || 'None'}\n\nUser: ${content}`
            }
          ],
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      setThinking(false)

      addMessage({
        id: Date.now(),
        role: 'assistant',
        content: data.content?.[0]?.text || 'No response received',
        timestamp: Date.now()
      })
    } catch (error) {
      setThinking(false)
      addMessage({
        id: Date.now(),
        role: 'assistant',
        content: `❌ Error: ${error.message}`,
        timestamp: Date.now()
      })
    }
  }, [apiKey, model, currentFile, fileContent, openFiles, addMessage, setThinking])

  return {
    messages,
    isThinking,
    sendMessage,
  }
}

export function useFileSystem() {
  const { files, setFiles } = useStore()

  const createFile = useCallback((path, content = '') => {
    // In a real implementation, this would create the file
    console.log('Creating file:', path, content)
    return true
  }, [])

  const deleteFile = useCallback((path) => {
    console.log('Deleting file:', path)
    return true
  }, [])

  const createFolder = useCallback((path) => {
    console.log('Creating folder:', path)
    return true
  }, [])

  const renameItem = useCallback((oldPath, newPath) => {
    console.log('Renaming:', oldPath, 'to', newPath)
    return true
  }, [])

  return {
    files,
    createFile,
    deleteFile,
    createFolder,
    renameItem,
  }
}

export function useSubagents() {
  const {
    subagents,
    activeSubagentId,
    addSubagent,
    removeSubagent,
    setActiveSubagent,
    updateSubagentMessage,
  } = useStore()

  const createNewAgent = useCallback((name, task) => {
    const id = Date.now().toString()
    addSubagent({
      id,
      name: name || `Agent ${subagents.length + 1}`,
      status: 'idle',
      messages: [
        { role: 'system', content: `You are a specialized AI assistant. Task: ${task}` }
      ]
    })
    return id
  }, [subagents, addSubagent])

  const sendToAgent = useCallback(async (agentId, message) => {
    updateSubagentMessage(agentId, {
      role: 'user',
      content: message,
      timestamp: Date.now()
    })
    // In a real implementation, this would send to the AI
  }, [updateSubagentMessage])

  return {
    subagents,
    activeSubagentId,
    createNewAgent,
    removeSubagent,
    setActiveSubagent,
    sendToAgent,
  }
}