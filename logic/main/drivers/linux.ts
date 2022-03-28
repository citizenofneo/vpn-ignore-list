import asyncExec from '../asyncExec'

// unset all_proxy && unset ALL_PROXY
export default {
  async enable (list: string[]) {
    try {
      const cmd = `gsettings set org.gnome.system.proxy ignore-hosts "${JSON.stringify(list).replace(/"/g, '\'')}"`.trim()
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