import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { join } from 'path'
import Store from 'electron-store'

// Keep a global reference of the window object
let mainWindow

// Initialize electron store
const store = new Store({
  defaults: {
    openRouterApiKey: '',
    defaultModel: 'openai/gpt-4',
    theme: 'dark',
    audioDevice: 'default',
    midiDevice: 'none',
    defaultInstruments: {
      melody: 'piano',
      bass: 'bass',
      chords: 'electric-piano',
      drums: 'drums'
    },
    generation: {
      defaultBars: 8,
      defaultKey: 'C',
      includeChordSymbols: true,
      humanizeVelocity: true,
      humanizeTiming: true
    },
    ui: {
      pianoRollZoom: 1,
      showVelocity: true,
      snapToGrid: true,
      gridSubdivision: 16
    }
  }
})

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    frame: false, // We'll create custom title bar
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load the index.html
  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../../index.html'))
  }

  // Open devtools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  // Set app user model id for windows
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.fibble.llmidi')
  }

  // IPC handlers
  ipcMain.handle('app:get-version', () => app.getVersion())
  ipcMain.handle('app:get-platform', () => process.platform)
  
  // Settings handlers
  ipcMain.handle('settings:get', (event, key) => {
    return store.get(key)
  })
  
  ipcMain.handle('settings:set', (event, key, value) => {
    store.set(key, value)
    return true
  })

  // Window control handlers
  ipcMain.on('window:minimize', () => {
    if (mainWindow) mainWindow.minimize()
  })

  ipcMain.on('window:maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
      } else {
        mainWindow.maximize()
      }
    }
  })

  ipcMain.on('window:close', () => {
    if (mainWindow) mainWindow.close()
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process code
