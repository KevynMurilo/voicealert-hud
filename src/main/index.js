import { app, shell, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 460,
    height: 780,
    show: false,
    resizable: false,
    maximizable: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#0a0a0c', symbolColor: '#52525e', height: 40 },
    icon: icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      backgroundThrottling: false
    }
  })

  mainWindow.on('ready-to-show', () => mainWindow.show())

  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
    }
    return false
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.voicealert.app')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Abrir VoiceAlert', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Encerrar', click: () => { app.isQuiting = true; app.quit() } }
  ])
  
  tray.setToolTip('VoiceAlert HUD')
  tray.setContextMenu(contextMenu)
  
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
})

ipcMain.handle('get-autostart', () => {
  return app.getLoginItemSettings().openAtLogin
})

ipcMain.on('set-autostart', (_, enable) => {
  app.setLoginItemSettings({
    openAtLogin: enable,
    path: app.getPath('exe')
  })
})