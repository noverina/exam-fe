<template>
  <ModalBase ref="modal" :header-icon="'check_circle'" :header-text="'Success'" :is-header="false">
    <div class="flex flex-col justify-center gap-4 w-full items-center">
      <Transition name="pop" appear>
        <div class="flex items-center justify-center bg-red-300 w-10 h-10 rounded-full">
          <span class="material-symbols-outlined"> exclamation </span>
        </div>
      </Transition>
      <div class="text-center">
        <div>{{ code ? errorInfos.get(code)?.code : 'E00: Unspecified Error' }}</div>
        <div>{{ code ? errorInfos.get(code)?.message : 'Please try again later' }}</div>
      </div>
    </div>
  </ModalBase>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import ModalBase from './ModalBase.vue'
import type { ErrorInfo } from '@/types/types'

interface Props {
  code: string
}

defineProps<Props>()

const modal = ref<InstanceType<typeof ModalBase> | null>(null)
const open = () => {
  modal.value?.open()
}

const errorInfos: Map<string, ErrorInfo> = new Map([
  ['E01', { code: 'E01: Request failed', message: 'Please retry the request' }],
  ['E01A', { code: 'E01A: Request failed: timeout', message: 'Please retry the request' }],
])

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
