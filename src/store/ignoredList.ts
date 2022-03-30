import { Ref, ref } from 'vue'
import api from 'app/logic/UI/apiUI'

const ignoredHostsList: Ref<Host[]> = ref([])

const state = {
  ignoredHostsList,
  updateHostList () {
    const blockedList = getBlockedList()
    ignoredHostsList.value = getLocalList().map(host => {
    // ignoredHostsList.value = this.getFullList().map(host => {
      return {
        host,
        isActive: !blockedList.includes(host)
      }
    })
    this.sendToIgnoreList()
  },
  getFullList () {
    const blockedList = getBlockedList()
    return localHosts.concat(getLocalList().filter(h => !blockedList.includes(h)))
  },
  saveToLocal (list: string[]) {
    localStorage.setItem(nameSaved, JSON.stringify(list))
    this.updateHostList()
  },
  addHost (host: string) {
    const local = getLocalList()
    local.unshift(host)
    this.saveToLocal(local)
  },
  toggleBlockHost (host: string) {
    const blockedList = getBlockedList()
    if (blockedList.includes(host)) {
      blockedList.splice(blockedList.findIndex(h => h === host), 1)
    } else {
      blockedList.unshift(host)
    }
    localStorage.setItem(nameBlocked, JSON.stringify(blockedList))
    this.sendToIgnoreList()
  },
  rmHost (host: string) {
    const list = getLocalList()
    list.splice(list.findIndex(h => h === host), 1)
    this.saveToLocal(list)
  },
  sendToIgnoreList () {
    api.sendTo('ignoreList', this.getFullList())
  }
}
api.onFrom('getList', () => state.sendToIgnoreList())

const nameSaved = '_localList'
const nameBlocked = '_localListBlock'

const getLocalList = () => JSON.parse(localStorage.getItem(nameSaved) || '["*avito.ru", "*youtube.com"]') as string[]
const getBlockedList = () => JSON.parse(localStorage.getItem(nameBlocked) || '[]') as string[]
const localHosts = ['localhost', '127.*', '10.*', '172.16.*', '172.17.*', '172.18.*', '172.19.*', '172.20.*', '172.21.*', '172.22.*', '172.23.*', '172.24.*', '172.25.*', '172.26.*', '172.27.*', '172.28.*', '172.29.*', '172.30.*', '172.31.*', '192.168.*']

type Host = { host: string, isActive: boolean }
state.updateHostList()

export default state