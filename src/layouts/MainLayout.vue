<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <!-- <q-toolbar-title></q-toolbar-title> -->
        <q-space />
        <q-tabs inline-label>
          <q-route-tab icon="link" label="Hosts" to="/" exact />
          <q-route-tab icon="reorder" label="Urls" to="/urls" exact />
        </q-tabs>
        <q-space />
        <div>
          <q-toggle
            v-model="isEnabled"
            checked-icon="check"
            color="green"
            :label="isEnabled ? 'On' : 'Off'"
            unchecked-icon="clear"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import mainState from 'src/store/mainState'
const linksList = [
  {
    title: 'Docs',
    caption: 'some link',
    icon: 'school',
    link: '#',
  },
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      isEnabled: mainState.isEnabled,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
    }
  },
})
</script>