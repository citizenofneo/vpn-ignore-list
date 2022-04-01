import { SsConfig } from '../UI/helpers/ss-link'

const ssLocalCreator = require('./ss-local')

const isEnabled = false
let ssLocal: any
const port = 1080
export default {
  start (config: SsConfig) {
    console.log('Start server:', config)
    ssLocal && ssLocal.close()
    ssLocal = ssLocalCreator(config)
    ssLocal.listen(port, () => { console.log('serve at ', port) })
  },
  stop () {
    console.log('stop')
    ssLocal.close()
    console.log('Server closed???')
  },
  get isEnabled () {
    return isEnabled
  }
}