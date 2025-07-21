<template>
  <ModalBase
    ref="modal"
    :header-icon="''"
    :header-text="''"
    :is-header="false"
    :is-outside-closable="false"
  >
    <div class="flex flex-col justify-center gap-2 w-full items-center">
      <div class="flex items-center justify-center bg-green-300 w-10 h-10 rounded-lg">
        <span class="material-symbols-outlined"> check </span>
      </div>

      <div>Success</div>
      <ButtonBase class="font-semibold w-full" @click="close"> Close </ButtonBase>
    </div>
  </ModalBase>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import ModalBase from './ModalBase.vue'
import ButtonBase from './buttons/ButtonBase.vue'

interface Props {
  onClose: () => void
}

const props = defineProps<Props>()

const modal = ref<InstanceType<typeof ModalBase> | null>(null)
const open = () => {
  modal.value?.open()
}
const close = () => {
  if (typeof props.onClose === 'function') {
    props.onClose()
    modal.value?.close()
  } else {
    modal.value?.close()
  }
}

defineExpose({ open })
</script>
