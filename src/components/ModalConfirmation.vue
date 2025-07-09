<template>
  <ModalBase
    ref="modal"
    :header-icon="'warning'"
    :header-text="'Are you sure?'"
    :is-header="true"
    :is-outside-closable="true"
  >
    <div class="flex flex-col justify-center gap-2 w-full">
      <div class="text-center">
        {{ text }}
      </div>
      <div class="flex gap-4 pt-4 font-semibold">
        <button
          class="bg-yellow-400 border border-amber-400 transition-colors duration-300 hover:bg-amber-400 hover:border-rose-400 rounded-md flex-1 py-2 cursor-pointer"
          @click="confirm"
        >
          confirm
        </button>
        <button
          class="bg-white border border-gray-400 transition-colors duration-300 hover:border-gray-600 rounded-md flex-1 py-2 cursor-pointer"
          @click="modal?.close()"
        >
          cancel
        </button>
      </div>
    </div>
  </ModalBase>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import ModalBase from './ModalBase.vue'

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
