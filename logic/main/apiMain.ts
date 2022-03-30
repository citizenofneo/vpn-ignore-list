import { ipcMain, BrowserWindow } from 'electron'

let mainWin: BrowserWindow
export default {
  setMainWin (mainWin_: BrowserWindow) {
    mainWin = mainWin_
  },
  sendTo (cmd: string, data = {}) {
    mainWin.webContents.send(cmd, data)
  },
  onFrom (cmd: string, cb?: (data: any) => void) {
    ipcMain.on(cmd, (e, data) => cb && cb(data))
  },
  onceFrom (cmd: string, cb?: (data: any) => void) {
    ipcMain.once(cmd, (e, data) => cb && cb(data))
  }
}