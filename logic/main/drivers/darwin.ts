import { SsConfig } from 'app/logic/UI/helpers/ss-link'
import asyncExec from '../asyncExec'
import server from '../server'

export default {
  async enable (config: SsConfig, list: string[]) {
    return await this.setProxy(list) && await server.start(config)
  },
  async setProxy (list: string[]) {
    try {
      const services = await listNetworkServices()
      if (!services) { return false }

      const results = await Promise.all(
        services.map(async service => {
          const autoSet = await asyncExec(`networksetup -setsocksfirewallproxystate '${service}' on`)
          const urlSet = await asyncExec(`networksetup -setsocksfirewallproxy '${service}' '127.0.0.1' 1080`)
          const bypassSet = await asyncExec(`networksetup -setproxybypassdomains '${service}' ${JSON.stringify(list).replace(/"/g, '\'')}'`)
          return autoSet.code === 0 && urlSet.code === 0 && bypassSet.code === 0
        })
      )

      return results.filter(i => i === true).length > 0
    } catch (error) {
      console.log('Mac enable error:', error)
      return false
    }
  },
  async disable () {
    const services = await listNetworkServices()
    if (!services) { return false }
    const results = await Promise.all(services.map(async service => {
      const globalUnset = await asyncExec(`networksetup -setsocksfirewallproxystate '${service}off`)
      return globalUnset.code === 0
    }))
    return results.filter(i => i === true).length > 0
  }
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