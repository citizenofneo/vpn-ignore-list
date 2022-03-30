<template>
  <q-page class="column start">
    <div class="full-width center">
      <q-list bordered separator class="full-width">
        <q-item
          clickable
          v-ripple
          v-for="s in servers"
          :active="s.isActived"
          :key="s.host"
        >
          <q-item-section avatar>
            <q-icon
              :name="s.isActived ? 'wifi' : 'wifi_off'"
              :color="s.isActived ? 'green' : 'grey'"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="ellipsis">{{ s.host }}</q-item-label>
            <q-item-label caption lines="1" class="ellipsis">{{ s.host }}:{{s.port}}</q-item-label>
          </q-item-section>
           <q-item-section>
            <q-item-label class="ellipsis">{{ s.host }}</q-item-label>
            <q-item-label caption lines="1" class="ellipsis">{{ s.host }}:{{s.port}}</q-item-label>
          </q-item-section>
       </q-item>
      </q-list>
      <div class="row justify-center">
        <q-btn
          @click="addVpnDialog"
          class="q-mt-lg"
          color="green"
          icon="vpn_key"
          label="Add vpn"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import servers from '../store/servers'
import ssLink from '../../logic/UI/helpers/ss-link'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'HostsList',
  setup () {
    const $q = useQuasar()
    return {
      addVpnDialog () {
        $q.dialog({
          dark: true,
          title: 'Add VPN',
          message: 'Push "ss:xxx" url:',
          prompt: {
            model: 'ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpyb2h5bWJvazQ5ZDE2YmN2@87.236.146.25:8000',
            type: 'text'
          },
          cancel: true,
          persistent: true,
          position: 'bottom',
        }).onOk((url) => {
          if (servers.ssUrls.includes(url)) {
            return $q.notify({ type: 'error', message: 'Server alredy exist', color: 'red' })
          }
          const config = ssLink.parseSS(url)
          if (!config) {
            return $q.notify({ type: 'error', message: 'Invalid config', color: 'red' })
          }
          servers.addSsUrl(url)
          console.log('config', config)
        })
      },
      toggleBlock () {
        console.log()
      },
      rmHost () {
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to turn on the wifi?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          console.log()
        })
      },
      servers: servers.savedServers,
    }
  },
})
</script>
<style scoped>
.q-item {
  opacity: 0.5 !important;
  /* color: gray; */
}
.q-item--active {
  opacity: 1 !important;
}
.added-host {
  font-size: 1.4em;
  text-align: center;
}
.right-buttons {
  flex-direction: inherit !important;
  align-items: center;
}
</style>