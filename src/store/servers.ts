import { Ref, ref } from 'vue'
// import { Notify } from 'quasar'
import { ServerConfig } from '../../logic/types'
import ssLink from '../../logic/UI/helpers/ss-link'
// import api from 'app/logic/UI/apiUI'

const savedServers: Ref<ServerConfig[]> = ref([])

const servers = {
  savedServers,
  updSavedServers () {
    const activated = savedServers.value.find(s => s.isActivated)
    savedServers.value = this.ssUrls.map(s => {
      const conf = ssLink.parseSS(s) as ServerConfig
      conf.isActivated = activated?.host === conf.host && activated?.port === conf.port
      return conf
    })
  },
  get ssUrls () {
    return JSON.parse(localStorage.getItem(fieldName) || '[]') as string[]
  },
  addSsUrl (url: string) {
    localStorage.setItem(fieldName, JSON.stringify(this.ssUrls.concat([url])))
    this.updSavedServers()
  }
}
const fieldName = '_savedSSUrls'
servers.updSavedServers()

export default servers