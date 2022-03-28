import { app, BrowserWindow, nativeTheme } from 'electron'
import path from 'path'
import os from 'os'
import init from '../logic/main/init'
// needed in case process is undefined under Linux
const platform = process.platform || os.platform()
const ENV = process.env as any

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
}
catch (_) { }

export let mainWindow: BrowserWindow | null

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: process.env.DEBUGGING ? 700 : 350,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, ENV.QUASAR_ELECTRON_PRELOAD)
    }
  })
  console.log('ENV', process.env.DEBUGGING)
  mainWindow.loadURL(ENV.APP_URL)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  }
  else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools()
    })
  }
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  init(mainWindow)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})