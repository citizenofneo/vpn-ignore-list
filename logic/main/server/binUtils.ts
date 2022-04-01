
const rootPath = require('electron-root-path').rootPath as string
import os from 'os'
import { SsConfig } from '../../UI/helpers/ss-link'
const platform = os.platform()
const arch = os.arch()

const binPath = rootPath + '/bin/' + platform + '/' + arch
export default {
  binPath,
  ssLocal: `${binPath}/ss-local${(platform === 'win32' ? '.exe' : '')}`,
  sysProxyWin: `${binPath}/sysproxy.exe}`,
  getLaunchSsArgh ({ host, method, port, password }: SsConfig, locaPort: number) {
    return ['-s', host, '-p', String(port), '-k', password, '-m', method, '-l', String(locaPort)]
  }
}