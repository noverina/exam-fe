<template>
  <ModalBase ref="modal" :header-icon="'check_circle'" :header-text="'Success'" :is-header="false">
    <div class="flex flex-col justify-center gap-2 w-full items-center">
      <Transition name="pop" appear>
        <div class="flex items-center justify-center bg-green-300 w-10 h-10 rounded-full">
          <span class="material-symbols-outlined"> check </span>
        </div>
      </Transition>
      <div>Success</div>
    </div>
  </ModalBase>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import ModalBase from './ModalBase.vue'

const modal = ref<InstanceType<typeof ModalBase> | null>(null)
const open = () => {
  modal.value?.open()
}

defineExpose({ open })
</script>

<style scoped>
.pop-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.pop-enter-active {
  transition:
    transform 0.3s ease-out,
    opacity 0.3s ease-out;
}

.pop-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
