
import drv from './drivers'
import api from './apiMain'
import storage from './memoryStorage'
import { BrowserWindow } from 'electron'
import { Platform } from './drivers/types'

export default (mainWindow: BrowserWindow) => {
  let isEnabled = false
  api.setMainWin(mainWindow)
  api.onFromUI('platform', (platform: Platform) => storage.platform = platform)
  api.onFromUI('toggleEnable', (isEnabled_: boolean) => {
    isEnabled = isEnabled_
    isEnabled ? api.sendToUI('getList') : drv[storage.platform].disable()

  })

  api.onFromUI('ignoreList', async (list: string[]) => {
    if (!isEnabled) { return }
    const success = await drv[storage.platform].enable(list)
    api.sendToUI('resultEnable', { success })
    console.log('Enable or upadte:', { success })
  })
}