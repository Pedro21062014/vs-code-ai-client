// API utilities for connecting to AI providers

export const anthropicApi = {
  async sendMessage(apiKey, model, messages, onChunk) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        messages,
        stream: true,
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6))
          if (data.type === 'content_block_delta' && data.delta?.text) {
            onChunk(data.delta.text)
          }
        }
      }
    }
  },

  async testConnection(apiKey) {
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
          model: 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'test' }]
        })
      })
      return response.ok
    } catch {
      return false
    }
  }
}

export const openaiApi = {
  async sendMessage(apiKey, model, messages, onChunk) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ') && !line.includes('[DONE]')) {
          const data = JSON.parse(line.slice(6))
          if (data.choices?.[0]?.delta?.content) {
            onChunk(data.choices[0].delta.content)
          }
        }
      }
    }
  },

  async testConnection(apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      })
      return response.ok
    } catch {
      return false
    }
  }
}

// Tool definitions for AI to use
export const tools = [
  {
    name: 'read_file',
    description: 'Read the contents of a file',
    input: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'The path to the file' }
      },
      required: ['path']
    }
  },
  {
    name: 'write_file',
    description: 'Write content to a file',
    input: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'The path to the file' },
        content: { type: 'string', description: 'The content to write' }
      },
      required: ['path', 'content']
    }
  },
  {
    name: 'execute_command',
    description: 'Execute a terminal command',
    input: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'The command to execute' }
      },
      required: ['command']
    }
  },
  {
    name: 'list_files',
    description: 'List files in a directory',
    input: {
      type: 'object',
      properties: {
        directory: { type: 'string', description: 'The directory path' }
      },
      required: ['directory']
    }
  },
  {
    name: 'search_files',
    description: 'Search for files matching a pattern',
    input: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'The search pattern' }
      },
      required: ['pattern']
    }
  },
  {
    name: 'create_subagent',
    description: 'Create a new subagent to handle a task',
    input: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'The name of the subagent' },
        task: { type: 'string', description: 'The task for the subagent' }
      },
      required: ['name', 'task']
    }
  }
]

// Build context for AI
export function buildContext({ currentFile, fileContent, openFiles, selectedText, projectStructure }) {
  return {
    currentFile,
    currentFileContent: fileContent || '',
    openFiles,
    selectedText,
    projectStructure,
    timestamp: new Date().toISOString()
  }
}