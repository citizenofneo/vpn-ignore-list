import { SsConfig } from '../UI/helpers/ss-link'

const ssLocalCreator = require('./ss-local')

const isEnabled = false
let ssLocal: any
export default {
  start (config: SsConfig) {
    console.log('Start server:', config)
    ssLocal && ssLocal.close()
    ssLocal = ssLocalCreator(config)
    ssLocal.listen(1088, () => { console.log('serve at 1088') })
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