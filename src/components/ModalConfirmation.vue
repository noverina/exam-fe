<template>
  <ModalBase
    ref="modal"
    :header-icon="'warning'"
    :header-text="'Confirmation'"
    :is-header="true"
    :is-outside-closable="true"
  >
    <div class="flex flex-col justify-center gap-2 w-full">
      <div class="text-center">
        {{ text }}
      </div>
      <div class="flex gap-4 pt-4 font-semibold">
        <ButtonYellow :is-border="false" @click="confirm" class="w-full"> confirm </ButtonYellow>
        <ButtonBase @click="modal?.close()" class="w-full"> cancel </ButtonBase>
      </div>
    </div>
  </ModalBase>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import ModalBase from './ModalBase.vue'
import ButtonYellow from './buttons/ButtonYellow.vue'
import ButtonBase from './buttons/ButtonBase.vue'

interface Props {
  text: string
}

defineProps<Props>()

const modal = ref<InstanceType<typeof ModalBase> | null>(null)
const open = () => {
  modal.value?.open()
}

defineExpose({ open })

const emit = defineEmits(['confirm-action'])

const confirm = () => {
  emit('confirm-action')
  modal.value?.close()
}
</script>
