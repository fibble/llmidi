const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  getPlatform: () => ipcRenderer.invoke('app:get-platform'),
  
  // Window controls
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),
  
  // Settings (to be implemented)
  getSettings: (key) => ipcRenderer.invoke('settings:get', key),
  setSettings: (key, value) => ipcRenderer.invoke('settings:set', key, value),
  
  // MIDI operations (to be implemented)
  // These will be added as we develop the MIDI functionality
})

// Expose some useful constants
contextBridge.exposeInMainWorld('electronConstants', {
  platform: process.platform,
  isDevelopment: process.env.NODE_ENV === 'development'
})
