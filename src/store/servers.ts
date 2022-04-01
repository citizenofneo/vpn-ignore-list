import { computed, Ref, ref } from 'vue'
// import { Notify } from 'quasar'
import { ServerConfig } from '../../logic/types'
import ssLink from '../../logic/UI/helpers/ss-link'
// import api from 'app/logic/UI/apiUI'

const savedServers: Ref<ServerConfig[]> = ref([])
const enabledServer = computed(() => savedServers.value.find(s => s.isActivated))
const servers = {
  savedServers,
  enabledServer,
  updStateSavedServers () {
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
    this.updStateSavedServers()
  },
  rmServer (removedServer: ServerConfig) {
    const { ssUrls } = this
    const i = ssUrls.findIndex(s => {
      const conf = ssLink.parseSS(s) as ServerConfig
      return removedServer.host === conf.host && removedServer.port === conf.port
    })
    ssUrls.splice(i, 1)
    console.log('ssUrls', ssUrls)
    localStorage.setItem(fieldName, JSON.stringify(ssUrls))
    this.updStateSavedServers()
  },
}
const fieldName = '_savedSSUrls'
servers.updStateSavedServers()

export default servers