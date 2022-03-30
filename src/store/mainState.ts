import { ref, watch } from 'vue'
import { Notify } from 'quasar'

import api from 'app/logic/UI/apiUI'

const isEnabled = ref(false)

watch(isEnabled, state => api.sendTo('toggleEnable', state))
api.onFrom('resultEnable', ({ success }: {success: boolean}) => {
  isEnabled.value = success
  Notify.create({
    icon: success ? 'check' : 'error',
    position: 'top',
    message: success ? 'Successfully' : 'Fail...',
    color: success ? 'green' : 'red'
  })
})
export default {
  isEnabled,
  setEnabled: (state: boolean) => isEnabled.value = state,
  toggleEnable: () => isEnabled.value = !isEnabled.value
}