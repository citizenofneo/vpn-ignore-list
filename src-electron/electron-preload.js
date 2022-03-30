/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */

const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('electron', {
  sendTo: (cmd, data) => ipcRenderer.send(cmd, data),
  onFrom: (cmd, cb) => ipcRenderer.on(cmd, (e, data) => cb && cb(data)),
  onceFrom: (cmd, cb) => ipcRenderer.once(cmd, (e, data) => cb && cb(data))
})