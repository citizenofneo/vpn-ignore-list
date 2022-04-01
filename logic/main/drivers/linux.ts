import { SsConfig } from 'app/logic/UI/helpers/ss-link'
import asyncExec from '../asyncExec'
import server from '../server'
// gsettings list-recursively org.gnome.system.proxy
// curl -x "socks5://127.0.0.1:1080" "http://httpbin.org/ip"
// unset all_proxy && unset ALL_PROXY
export default {
  async enable (config: SsConfig, list: string[]) {
    return await this.setProxy(list) && await server.start(config)
  },
  async setProxy (ignoreList: string[]) {
    try {
      return (await Promise.all([
        asyncExec(`gsettings set org.gnome.system.proxy ignore-hosts "${JSON.stringify(ignoreList).replace(/"/g, '\'')}"`.trim()),
        asyncExec('gsettings set org.gnome.system.proxy mode manual'),
        asyncExec('gsettings set org.gnome.system.proxy.socks host "127.0.00.1"'),
        asyncExec('gsettings set org.gnome.system.proxy.socks port 1080')
      ])).reduce((res, cur) => {
        return res && cur.code === 0
      }, true)
    }
    catch (e) {
      console.log('[setProxy]:s', e)
      return false
    }

  },
  async disable () {
    try {
      await server.stop()
      return (await Promise.all([
        asyncExec('gsettings set org.gnome.system.proxy ignore-hosts "[]"'),
        asyncExec('gsettings set org.gnome.system.proxy mode auto'),
        asyncExec('gsettings set org.gnome.system.proxy.socks host ""'),
        asyncExec('gsettings set org.gnome.system.proxy.socks port 0'),
        asyncExec('gsettings set org.gnome.system.proxy.http use-authentication false'),
        asyncExec('gsettings set org.gnome.system.proxy.http enabled false'),
        asyncExec('gsettings set org.gnome.system.proxy.http authentication-password ""'),
        asyncExec('gsettings set org.gnome.system.proxy.http port 0'),
        asyncExec('gsettings set org.gnome.system.proxy.http host ""'),
        asyncExec('gsettings set org.gnome.system.proxy.http authentication-user ""'),
        asyncExec('gsettings set org.gnome.system.proxy.https port 0'),
        asyncExec('gsettings set org.gnome.system.proxy.https host ""'),
      ])).reduce((res, cur) => {
        return res && cur.code === 0
      }, true)
    } catch (error) {
      console.log('[Driver disable error]:', error)
      return false
    }
  }
}