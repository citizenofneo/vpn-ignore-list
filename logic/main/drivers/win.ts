
import path from 'path'
import { app } from 'electron'
import asyncExec from '../asyncExec'
// https://github.com/Noisyfox/sysproxy
export default {
  async enable (list: string[]) {
    try {
      const manualSet = await asyncExec(
        `${getPathRuntime('bin/win32/x64/sysproxy.exe')} global ${''}:${0} ${list.join(';')}`
      )
      return manualSet.code === 0
    } catch (error) {
      console.log('Mac enable error:', error)
      return false
    }
  },
  disable
}

async function disable () {
  const result = await asyncExec(
    `${getPathRuntime('bin/win32/x64/sysproxy.exe')} set 1 - -`
  )
  return result.code === 0
}

// export const setPacProxy = async (url: string) => {
//   const autoSet = await asyncExec(
//     `${getPathRuntime('bin/win32/x64/sysproxy.exe')} pac ${url}`
//   )
//   return autoSet.code === 0
// }

export const setGlobalProxy = async (host: string, port: number) => {
  const manualSet = await asyncExec(
    `${getPathRuntime('bin/win32/x64/sysproxy.exe')} global ${''}:${0} ${1}`
  )
  return manualSet.code === 0
}

const appDataPath = path.join(app.getPath('appData'), 'vpn-ignore-list')
const pathRuntime = path.join(appDataPath, 'runtime/')

// const getPathRoot = (p: string) => path.join(appDataPath, p)
const getPathRuntime = (p: string) => path.join(pathRuntime, p)