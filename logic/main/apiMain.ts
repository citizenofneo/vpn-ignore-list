import { ipcMain, BrowserWindow } from 'electron'

let mainWin: BrowserWindow
export default {
  setMainWin (mainWin_: BrowserWindow) {
    mainWin = mainWin_
  },
  sendToUI (cmd: string, data = {}) {
    mainWin.webContents.send(cmd, data)
  },
  onFromUI (cmd: string, cb: (data: any) => void) {
    ipcMain.on(cmd, (e, data) => cb && cb(data))
  }
}