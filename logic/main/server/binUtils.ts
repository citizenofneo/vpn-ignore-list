
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
    // return [
    //   '-s',
    //   config.host,
    //   '-p',
    //   config.port.toString(),
    //   //   '-l',
    //   //   this.settings.localPort.toString(),
    //   '-k',
    //   config.password,
    //   '-m',
    //   config.method,
    //   //   config.udp ? '-u' : '',
    //   //   config.fastOpen ? '--fast-open' : '',
    //   //   config.noDelay ? '--no-delay' : '',
    //   //   config.plugin ? '--plugin' : '',
    //   //   config.plugin ?? '',
    //   //   config.pluginOpts ? '--plugin-opts' : '',
    //   //   config.pluginOpts ?? '',
    //   //   this.settings.verbose ? '-v' : '',
    //   //   '-t',
    // //   (config.timeout ?? '600').toString()
    // ].filter(arg => arg !== '')
  }
}