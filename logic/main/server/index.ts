import { SsConfig } from '../../UI/helpers/ss-link'
import binUtils from './binUtils'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import asyncExec from '../asyncExec'

const isEnabled = false
let ssLocalPs: ChildProcessWithoutNullStreams | null = null
const port = 1080
export default {
  async start (config: SsConfig) {
    await this.stop()
    return new Promise(r => {
      console.log('Start server:', binUtils.ssLocal, binUtils.getLaunchSsArgh(config, port))
      ssLocalPs = spawn(binUtils.ssLocal, binUtils.getLaunchSsArgh(config, port))
      ssLocalPs.stdout.on('data', (data: string) => {
        console.log(`Server stdout: ${data}`)
        r(true)
      })
      ssLocalPs.stderr.on('data', (data: string) => {
        console.error(`Server stderr: ${data}`)
        r(false)
      })
    })
  },
  async stop () {
    if (!ssLocalPs) { return }
    try {
      await wait(1)
      ssLocalPs.kill('SIGHUP')
      console.log('Server closed')
      ssLocalPs = null
      return true
    } catch (e) {
      return false
    }
  },
  get isEnabled () {
    return isEnabled
  }
}
const wait = (s: number) => new Promise(r => setTimeout(r, s * 1000))