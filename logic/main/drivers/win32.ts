import asyncExec from '../asyncExec'
import { SsConfig } from 'app/logic/UI/helpers/ss-link'
import binUtils from '../server/binUtils'
import server from '../server'
// https://github.com/Noisyfox/sysproxy
let currentConfig: SsConfig| null = null
export default {
  async enable (config: SsConfig, list: string[]) {
    currentConfig = config
    return await this.setProxy(list) && await server.start(config)
  },
  async setProxy (list: string[]) {
    try {
      return (await asyncExec(`${binUtils.sysProxyWin} global ${currentConfig?.host}:${currentConfig?.port} ${list.join(';')}`)).code === 0
    } catch (error) {
      console.log('Win setProxy error:', error)
      return false
    }
  },
  async disable () {
    return (await asyncExec(`${binUtils.sysProxyWin} set 1 - -`)).code === 0
  }
}