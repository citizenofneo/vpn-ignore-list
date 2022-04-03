
import drv from './drivers'
import api, { setMainWin } from './apiMain'
import { BrowserWindow } from 'electron'
import { SsConfig } from '../UI/helpers/ss-link'
import os from 'os'
import { Platform } from '../types'
const platform = os.platform() as Platform

export default (mainWindow: BrowserWindow) => {
  let isEnabled = false
  setMainWin(mainWindow)

  api.on('turnOn', async ({ config, list }: { config: SsConfig, list: string[] }, cb) => {
    try {
      const res = await drv[platform].enable(config, list)
      isEnabled = res
      cb({ success: res })
    } catch (error) {
      console.log(error)
      cb({ success: false })
    }
  })
  api.on('turnOff', async (_, cb) => {
    cb({ success: await disableServer() })
  })

  api.on('updIgnoreList', async (list: string[]) => {
    console.log({ isEnabled })
    if (!isEnabled) { return }
    drv[platform].setProxy(list)
  })

  const disableServer = async () => {
    isEnabled = !isEnabled
    const res = await drv[platform].disable()
    isEnabled = !!res
    return isEnabled
  }
  return disableServer
}