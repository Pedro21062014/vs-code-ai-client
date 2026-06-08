// Extension system for VS Code AI Client

const extensionRegistry = new Map()

// Extension context API
export function createExtensionContext(extensionId) {
  return {
    subscriptions: [],
    commands: {
      registerCommand: (commandId, callback) => {
        const disposable = { commandId, dispose: () => {} }
        context.subscriptions.push(disposable)
        return disposable
      }
    },
    workspace: {
      rootPath: '/home/user/project',
    },
    outputChannel: {
      append: (message) => console.log(`[${extensionId}] ${message}`),
      appendLine: (message) => console.log(`[${extensionId}] ${message}`)
    },
    vscode: {
      window: {
        showInformationMessage: (msg) => console.log(msg),
        showWarningMessage: (msg) => console.warn(msg),
        showErrorMessage: (msg) => console.error(msg),
      }
    }
  }
}

// Register an extension
export function registerExtension(extension) {
  if (!extension.id || !extension.name) {
    throw new Error('Extension must have id and name')
  }
  
  extensionRegistry.set(extension.id, {
    ...extension,
    enabled: false,
    context: null,
  })
}

// Enable an extension
export function enableExtension(extensionId) {
  const extension = extensionRegistry.get(extensionId)
  if (!extension) {
    throw new Error(`Extension ${extensionId} not found`)
  }
  
  try {
    const context = createExtensionContext(extensionId)
    if (extension.activate) {
      extension.activate(context)
    }
    extensionRegistry.set(extensionId, {
      ...extension,
      enabled: true,
      context,
    })
    return true
  } catch (error) {
    console.error(`Failed to enable extension ${extensionId}:`, error)
    return false
  }
}

// Disable an extension
export function disableExtension(extensionId) {
  const extension = extensionRegistry.get(extensionId)
  if (!extension) return false
  
  try {
    if (extension.deactivate) {
      extension.deactivate()
    }
    if (extension.context?.subscriptions) {
      extension.context.subscriptions.forEach(sub => sub.dispose?.())
    }
    extensionRegistry.set(extensionId, {
      ...extension,
      enabled: false,
      context: null,
    })
    return true
  } catch (error) {
    console.error(`Failed to disable extension ${extensionId}:`, error)
    return false
  }
}

// Get all registered extensions
export function getExtensions() {
  return Array.from(extensionRegistry.values())
}

// Get enabled extensions
export function getEnabledExtensions() {
  return Array.from(extensionRegistry.values()).filter(ext => ext.enabled)
}

// Example built-in extensions

// Dark Theme Extension
const darkThemeExtension = {
  id: 'theme-dark',
  name: 'Dark Theme',
  description: 'VS Code dark theme',
  version: '1.0.0',
  activate: (context) => {
    context.outputChannel.appendLine('Dark theme extension activated')
    // Apply dark theme styles
    document.documentElement.classList.add('dark')
  },
  deactivate: () => {
    document.documentElement.classList.remove('dark')
  }
}

// Syntax Highlighting Extension
const syntaxHighlightExtension = {
  id: 'syntax-highlight',
  name: 'Syntax Highlighting',
  description: 'Enhanced syntax highlighting',
  version: '1.0.0',
  activate: (context) => {
    context.outputChannel.appendLine('Syntax highlighting extension activated')
    // Add syntax highlighting styles
  },
  deactivate: () => {
    // Cleanup
  }
}

// AI Helper Extension
const aiHelperExtension = {
  id: 'ai-helper',
  name: 'AI Helper',
  description: 'Enhances AI chat with shortcuts',
  version: '1.0.0',
  activate: (context) => {
    context.outputChannel.appendLine('AI helper extension activated')
    
    // Register AI commands
    context.commands.registerCommand('ai-helper.refactor', () => {
      context.outputChannel.appendLine('Refactor command triggered')
    })
    
    context.commands.registerCommand('ai-helper.explain', () => {
      context.outputChannel.appendLine('Explain command triggered')
    })
    
    context.commands.registerCommand('ai-helper.fix', () => {
      context.outputChannel.appendLine('Fix command triggered')
    })
  },
  deactivate: () => {}
}

// Register built-in extensions
registerExtension(darkThemeExtension)
registerExtension(syntaxHighlightExtension)
registerExtension(aiHelperExtension)

// Load extensions from folder (simulated)
export async function loadExtensionsFromFolder(folderPath) {
  // In a real implementation, this would load .js files from the extensions folder
  console.log(`Loading extensions from ${folderPath}`)
  
  // Simulate loading
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'custom-extension-1', name: 'Custom Extension 1', loaded: true }
      ])
    }, 500)
  })
}

// Export default extension system
export default {
  registerExtension,
  enableExtension,
  disableExtension,
  getExtensions,
  getEnabledExtensions,
  loadExtensionsFromFolder,
}