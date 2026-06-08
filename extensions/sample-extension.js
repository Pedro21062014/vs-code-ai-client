/**
 * Sample VS Code AI Client Extension
 * 
 * This extension demonstrates how to create custom extensions
 * for the VS Code AI Client.
 * 
 * To use this extension:
 * 1. Enable it in Settings > Extensions
 * 2. The commands will be available in the chat
 */

export function activate(context) {
  console.log('Sample Extension activated!')
  
  // Register a custom command
  context.subscriptions.push(
    context.commands.registerCommand('sample.greet', () => {
      context.outputChannel.appendLine('Hello from Sample Extension! 👋')
      context.vscode.window.showInformationMessage('Hello from Sample Extension!')
    })
  )
  
  // Register another command
  context.subscriptions.push(
    context.commands.registerCommand('sample.timestamp', () => {
      const now = new Date().toLocaleString()
      context.outputChannel.appendLine(`Current time: ${now}`)
    })
  )
  
  // Register an AI helper command
  context.subscriptions.push(
    context.commands.registerCommand('sample.analyze', () => {
      context.outputChannel.appendLine('Running code analysis...')
      // This could analyze the currently open file
    })
  )
  
  // Register a formatting command
  context.subscriptions.push(
    context.commands.registerCommand('sample.format', () => {
      context.outputChannel.appendLine('Formatting code...')
      // This could format the currently open file
    })
  )
  
  context.outputChannel.appendLine('✅ Sample Extension loaded successfully!')
}

export function deactivate() {
  console.log('Sample Extension deactivated')
  // Clean up any resources
}

// Extension metadata
export const metadata = {
  id: 'sample-extension',
  name: 'Sample Extension',
  description: 'A sample extension demonstrating the extension API',
  version: '1.0.0',
  author: 'Developer',
  repository: 'https://github.com/example/sample-extension',
  keywords: ['sample', 'demo', 'example'],
}