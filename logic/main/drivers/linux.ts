import { SsConfig } from 'app/logic/UI/helpers/ss-link'
import asyncExec from '../asyncExec'
import server from '../server'

// unset all_proxy && unset ALL_PROXY
export default {
  async enable (config: SsConfig, list: string[]) {
    const proxyRes = await this.setProxy(list)
    server.start(config)
    return proxyRes
  },
  async setProxy (ignoreList: string[]) {
    try {
      console.log('Set proxy Linux', ignoreList)
      const cmd = `gsettings set org.gnome.system.proxy ignore-hosts "${JSON.stringify(ignoreList).replace(/"/g, '\'')}"`.trim()
      console.log(cmd)
      const bypassSet = await asyncExec(cmd)
      console.log('bypassSet', bypassSet)
      return bypassSet.code === 0
    } catch (error) {
      console.log('Linux enable error:', error)
      return false
    }
  },
  async disable () {
    const bypassSet = await asyncExec(
      'gsettings set org.gnome.system.proxy ignore-hosts "[]"'
    )
    console.log('Linux disable:', bypassSet.code === 0)
    return bypassSet.code === 0
  }
}