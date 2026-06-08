const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),
  listFiles: (dirPath) => ipcRenderer.invoke('list-files', dirPath),
  
  // Event listeners
  onNewFile: (callback) => ipcRenderer.on('new-file', callback),
  onOpenFile: (callback) => ipcRenderer.on('open-file', callback),
  onSaveFile: (callback) => ipcRenderer.on('save-file', callback),
  onOpenSettings: (callback) => ipcRenderer.on('open-settings', callback),
  onNewChat: (callback) => ipcRenderer.on('new-chat', callback),
  onCreateSubagent: (callback) => ipcRenderer.on('create-subagent', callback),
  onAbout: (callback) => ipcRenderer.on('about', callback),
});