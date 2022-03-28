import asyncExec from '../asyncExec'

export default {
  async enable (list: string[]) {
    try {
      const services = await listNetworkServices()
      if (!services) {
        return false
      }
      const results = await Promise.all(
        services.map(async service => {
          // const autoSet = await asyncExec(
          //   `networksetup -setsocksfirewallproxystate '${service}' on`
          // )
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

// export const setGlobalProxy = async (host: string, port: number) => {
//   const services = await listNetworkServices()
//   if (!services) {
//     return false
//   }

//   const results = await Promise.all(
//     services.map(async service => {
//       const autoSet = await asyncExec(
//         `networksetup -setsocksfirewallproxystate '${service}' on`
//       )
//       const urlSet = await asyncExec(
//         `networksetup -setsocksfirewallproxy '${service}' '${host}' ${port}`
//       )
//       const bypassSet = await asyncExec(
//         `networksetup -setproxybypassdomains '${service}' '${ignoredHosts}'`
//       )
//       return autoSet.code === 0 && urlSet.code === 0 && bypassSet.code === 0
//     })
//   )

//   return results.filter(i => i === true).length > 0
// }

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