<template>
  <q-page class="column start">
    <div class="full-width center">
      <q-list separator class="full-width">
         <transition-group
            appear
            enter-active-class="animated bounceInLeft"
            leave-active-class="animated bounceOutRight"
          >
        <q-item
          clickable
          v-ripple
          v-for="s in servers"
          :active="s.isActivated"
          :key="s.host + s.port"
        >
          <!-- <q-item-section avatar> -->
          <!-- <q-icon
              :name="s.isActived ? 'wifi' : 'wifi_off'"
              :color="s.isActived ? 'green' : 'grey'"
            /> -->
          <!-- </q-item-section> -->
          <q-item-section>
            <q-item-label class="ellipsis">{{ s.host }}</q-item-label>
            <q-item-label caption lines="1" class="ellipsis"
              >{{ s.host }}:{{ s.port }}</q-item-label
            >
          </q-item-section>
          <q-item-section side class="right-buttons">
            <q-btn
              v-if="!s.isWaitConnection"
              size="12px"
              @click="toggleServer(s)"
              class="glossy"
              round
              :color="s.isActivated ? 'green' : 'grey'"
              :icon="s.isActivated ? 'wifi' : 'wifi_off'"
            />
            <q-spinner-radio size="24px" v-else color="primary" />
            <q-btn
                size="12px"
                @click="rmServer(s)"
                class="glossy q-ml-sm"
                round
                color="red"
                icon="delete"
              />
          </q-item-section>
        </q-item>
         </transition-group>
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
import { defineComponent, ref } from 'vue'
import servers from '../store/servers'
import ignoredList from '../store/ignoredList'
import ssLink from '../../logic/UI/helpers/ss-link'
import { useQuasar } from 'quasar'
import { ServerConfig } from '../../logic/types'
import apiUI from 'app/logic/UI/apiUI'

export default defineComponent({
  name: 'HostsList',
  setup () {
    const $q = useQuasar()
    const isWaitConnection = ref(false)
    return {
      isWaitConnection,
      addVpnDialog () {
        $q.dialog({
          dark: true,
          title: 'Add VPN',
          message: 'Push "ss:xxx" url:',
          prompt: {
            model:
              'ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpyb2h5bWJvazQ5ZDE2YmN2@87.236.146.25:8000',
            type: 'text',
          },
          cancel: true,
          persistent: true,
          position: 'bottom',
        }).onOk((url) => {
          if (servers.ssUrls.includes(url)) {
            return $q.notify({
              type: 'error',
              message: 'Server alredy exist',
              color: 'red',
            })
          }
          const config = ssLink.parseSS(url)
          if (!config) {
            return $q.notify({
              type: 'error',
              message: 'Invalid config',
              color: 'red',
            })
          }
          servers.addSsUrl(url)
        })
      },
      toggleServer (config: ServerConfig) {
        config.isWaitConnection = true
        apiUI.emit('turnOn', { config, list: ignoredList.getFullList() }, res => {
          console.log(res)
          setTimeout(() => {
            servers.savedServers.value.forEach(s => s.isActivated = false)
            config.isWaitConnection = false
            config.isActivated = res.success
          }, 500)
        })
      },
      rmServer (s: ServerConfig) {
        $q.dialog({
          title: 'Confirm',
          message: `Would you like to remove ${s.host}:${s.port}?`,
          cancel: true,
          persistent: true,
        }).onOk(() => servers.rmServer(s))
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