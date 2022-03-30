import { ipcMain, BrowserWindow } from 'electron'
import Io from '../Io'

let mainWin: BrowserWindow
const api = {
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
export default api

// const io = new Io(api)
// io.on('testOnUi', (data, cb) => {
//   console.log('data', data)
//   cb({ sendBack: 1 })
// })
// io.on('testOnUix', (data, cb) => {
//   console.log('data', data)
//   cb({ sendBack: 2 })
// })