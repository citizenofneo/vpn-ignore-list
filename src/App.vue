<template>
  <router-view />
</template>

<script lang="ts">
import api from '../logic/UI/apiUI'
import { useQuasar } from 'quasar'
import { defineComponent } from 'vue'

export default defineComponent({
  beforeCreate () {
    const $q = useQuasar()
    $q.dark.set('auto') // or false or "auto"
    api.emit('platform', { platform: $q.platform.is.platform })
    console.log('Platform', $q.platform.is.platform)
  },
  name: 'App',
})
</script>
<style>
body.body--dark {
  background: rgb(36, 35, 35);
}
</style>