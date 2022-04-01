
import drv from './drivers'
import api, { setMainWin } from './apiMain'
import storage from './memoryStorage'
import { BrowserWindow } from 'electron'
import { Platform } from './drivers/types'
import { SsConfig } from '../UI/helpers/ss-link'

export default (mainWindow: BrowserWindow) => {
  let isEnabled = false
  setMainWin(mainWindow)
  api.on('platform', (data: { platform: Platform }) => storage.platform = data.platform)
  api.on('turnOn', async ({ config, list }: { config: SsConfig, list: string[] }, cb) => {
    try {
      console.log(storage)
      const res = await drv[storage.platform].enable(config, list)
      isEnabled = res
      cb({ success: res })
    } catch (error) {
      console.log(error)
      cb({ success: false })
    }
  })
  api.on('turnOff', async (_, cb) => {
    isEnabled = !isEnabled
    const res = await drv[storage.platform].disable()
    isEnabled = !!res
    cb({ success: res })
  })

  api.on('updIgnoreList', async (list: string[]) => {
    console.log({ isEnabled })
    if (!isEnabled) { return }
    drv[storage.platform].setProxy(list)
  })
}