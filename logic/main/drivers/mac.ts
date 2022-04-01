import { SsConfig } from 'app/logic/UI/helpers/ss-link'
import asyncExec from '../asyncExec'

export default {
  async enable (config: SsConfig, list: string[]) {
    const proxyRes = await this.setProxy(list)
    return proxyRes
  },
  async setProxy (list: string[]) {
    try {
      const services = await listNetworkServices()
      if (!services) {
        return false
      }
      const results = await Promise.all(
        services.map(async service => {
          const bypassSet = await asyncExec(
            `networksetup -setproxybypassdomains '${service}' ${JSON.stringify(list).replace(/"/g, '\'')}'`
          )
          return bypassSet.code === 0
        })
      )

      return results.filter(i => i === true).length > 0
    } catch (error) {
      console.log('Mac enable error:', error)
      return false
    }
  },
  disable
}

const listNetworkServices = async () => {
  const result = await asyncExec('networksetup -listallnetworkservices')
  if (result.code === 0 && result.stdout) {
    const r = result.stdout.split('\n')
    r.shift()
    return r
  } else {
    return null
  }
}

async function disable () {
  const services = await listNetworkServices()
  if (!services) {
    return false
  }

  const results = await Promise.all(
    services.map(async service => {
      const globalUnset = await asyncExec(
        `networksetup -setsocksfirewallproxystate '${service}' off`
      )
      const pacUnset = await asyncExec(
        `networksetup -setautoproxystate '${service}' off`
      )
      return globalUnset.code === 0 && pacUnset.code === 0
    })
  )
  return results.filter(i => i === true).length > 0
}