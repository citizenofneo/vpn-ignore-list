<template>
  <q-page class="row justify-evenly">
    Здесь будут ссылки по которым можно будет подтянуть списки
    <!-- <q-list bordered separator class="full-width">
      <q-item clickable v-ripple :active="active">
        <q-item-section avatar>
          <q-icon name="signal_wifi_off" />
        </q-item-section>
        <q-item-section>XXX</q-item-section>
        <q-item-section side>Side</q-item-section>
      </q-item>
    </q-list> -->
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HostItem',
})
</script>