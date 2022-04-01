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
    // try {
    console.log('Set proxy Linux', ignoreList)
    return setGlobalProxy('127.0.0.1', 1080)
    //   const cmd = `gsettings set org.gnome.system.proxy ignore-hosts "${JSON.stringify(ignoreList).replace(/"/g, '\'')}"`.trim()
    //   console.log(cmd)
    //   const bypassSet = await asyncExec(cmd)
    //   console.log('bypassSet', bypassSet)
    //   return bypassSet.code === 0
    // } catch (error) {
    //   console.log('Linux enable error:', error)
    //   return false
    // }
    // const manualSet = await asyncExec(
    //   'gsettings set org.gnome.system.proxy mode manual'
    // )
    // const hostSet = await asyncExec(
    //   // `gsettings set org.gnome.system.proxy.socks host '${}'`
    //   'gsettings set org.gnome.system.proxy.socks host http://127.0.1.1'
    // )
    // const portSet = await asyncExec(
    //   'gsettings set org.gnome.system.proxy.socks port 1080'
    // )
    // const bypassSet = await asyncExec(
    //   `gsettings set org.gnome.system.proxy ignore-hosts "${JSON.stringify(ignoreList).replace(/"/g, '\'')}"`.trim()
    // )
    // return (
    //   manualSet.code === 0 &&
    //   hostSet.code === 0 &&
    //   portSet.code === 0 &&
    //   bypassSet.code === 0
    // )
    // try {
    //   return (await Promise.all([
    //     asyncExec(`gsettings set org.gnome.system.proxy ignore-hosts "${JSON.stringify(ignoreList).replace(/"/g, '\'')}"`.trim()),
    //     asyncExec('gsettings set org.gnome.system.proxy mode manual'),
    //     asyncExec('gsettings set org.gnome.system.proxy.socks host "127.0.00.1"'),
    //     asyncExec('gsettings set org.gnome.system.proxy.socks port 1080')
    //   ])).reduce((res, cur) => {
    //     return res && cur.code === 0
    //   }, true)
    // }
    // catch (e) {
    //   console.log('[setProxy]:s', e)
    //   return false
    // }

  },
  async disable () {
    try {
      return (await Promise.all([
        asyncExec('gsettings set org.gnome.system.proxy ignore-hosts "[]"'),
        asyncExec('gsettings set org.gnome.system.proxy mode auto'),
        asyncExec('gsettings set org.gnome.system.proxy.socks host ""'),
        asyncExec('gsettings set org.gnome.system.proxy.socks port 0')
      ])).reduce((res, cur) => {
        return res && cur.code === 0
      }, true)
    } catch (error) {
      console.log('[Driver disable]:', error)
      return false
    }
    //   const bypassSet = await asyncExec('gsettings set org.gnome.system.proxy ignore-hosts "[]"')
    //   const manualSet = await asyncExec('gsettings set org.gnome.system.proxy mode manual')
    //   const hostSet = await asyncExec('gsettings set org.gnome.system.proxy.socks host ""')
    //   const portSet = await asyncExec('gsettings set org.gnome.system.proxy.socks port 0')

    //   return (
    //     manualSet.code === 0 &&
    //   hostSet.code === 0 &&
    //   portSet.code === 0 &&
    //   bypassSet.code === 0
    //   )
    // }
  }
}

const setGlobalProxy = async (host: string, port: number) => {
  console.log(await asyncExec('node  -v'))
  const manualSet = await asyncExec(
    'gsettings set org.gnome.system.proxy mode manual'
  )
  const hostSet = await asyncExec(
    `gsettings set org.gnome.system.proxy.socks host '${host}'`
  )
  const portSet = await asyncExec(
    `gsettings set org.gnome.system.proxy.socks port ${port}`
  )
  // const bypassSet = await asyncExec(
  // `gsettings set org.gnome.system.proxy ignore-hosts "['${ignoredHosts}']"`
  // )
  return (
    manualSet.code === 0 &&
    hostSet.code === 0 &&
    portSet.code === 0
    //  &&
    // bypassSet.code === 0
  )
}