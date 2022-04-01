<template>
  <q-page class="column start">
    <div class="full-width">
      <div separator bordered class="full-width">
        <q-input
          class="q-pa-sm block"
          bottom-slots
          v-model="searchText"
          label="Search host"
          dense
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon
              name="close"
              @click="searchText = ''"
              class="cursor-pointer"
            />
          </template>
        </q-input>
      </div>
      <div
        class="full-width added-host q-center q-ma-lg"
        v-if="!hosts.some((h) => h.host.includes(searchText))"
      >
        You wand add host <span class="text-primary">{{ searchText }}</span
        >?
        <br />
        <q-btn
          @click="addHost"
          class="q-mt-lg"
          color="green"
          icon="add_task"
          label="Add host"
        />
      </div>
      <q-scroll-area
        v-else
        style="height: calc(100vh - 120px)"
        class="full-width q-ma-none"
      >
        <q-list separator class="full-width">
          <transition-group
            appear
            enter-active-class="animated bounceInLeft"
            leave-active-class="animated bounceOutRight"
          >
            <q-item
              dense
              clickable
              v-ripple
              v-for="h in hosts"
              :active="h.isActive"
              :key="h.host"
              v-show="h.host.includes(searchText)"
            >
              <q-item-section avatar>
                <q-icon
                  :name="h.isActive ? 'broadcast_on_personal' : 'vpn_key'"
                />
              </q-item-section>
              <q-item-section class="ellipsis">{{ h.host }}</q-item-section>
              <q-item-section side class="right-buttons">
                <q-toggle
                  class="col"
                  v-model="h.isActive"
                  @click="toggleBlock(h.host)"
                  checked-icon="check"
                  unchecked-icon="clear"
                  color="green"
                />
                <q-btn
                  size="8px"
                  @click="rmHost(h.host)"
                  class="glossy"
                  round
                  color="red"
                  icon="delete"
                />
              </q-item-section>
            </q-item>
          </transition-group>
        </q-list>
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ignoredList from '../store/ignoredList'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'HostsList',
  setup () {
    const $q = useQuasar()
    const searchText = ref('')
    return {
      addHost () {
        ignoredList.addHost(searchText.value)
        $q.notify({
          position: 'top',
          icon: 'check',
          message: 'Host added ',
          color: 'green',
        })
        searchText.value = ''
      },
      toggleBlock (host: string) {
        ignoredList.toggleBlockHost(host)
      },
      rmHost (host: string) {
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to turn on the wifi?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          ignoredList.rmHost(host)
        })
      },
      searchText,
      hosts: ignoredList.ignoredHostsList,
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