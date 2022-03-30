
import drv from './drivers'
import api from './apiMain'
import storage from './memoryStorage'
import { BrowserWindow } from 'electron'
import { Platform } from './drivers/types'

export default (mainWindow: BrowserWindow) => {
  let isEnabled = false
  api.setMainWin(mainWindow)
  api.onFrom('platform', (platform: Platform) => storage.platform = platform)
  api.onFrom('toggleEnable', (isEnabled_: boolean) => {
    isEnabled = isEnabled_
    isEnabled ? api.sendTo('getList') : drv[storage.platform].disable()

  })

  api.onFrom('ignoreList', async (list: string[]) => {
    if (!isEnabled) { return }
    const success = await drv[storage.platform].enable(list)
    api.sendTo('resultEnable', { success })
    console.log('Enable or upadte:', { success })
  })
}