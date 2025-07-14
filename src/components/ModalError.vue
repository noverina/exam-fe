<template>
  <ModalBase
    ref="modal"
    :header-icon="''"
    :header-text="''"
    :is-header="false"
    :is-outside-closable="false"
  >
    <div class="flex flex-col justify-center gap-4 w-full items-center">
      <div class="flex items-center justify-center bg-red-300 w-10 h-10 rounded-full">
        <span class="material-symbols-outlined">exclamation</span>
      </div>

      <div class="text-center">
        <div>{{ code ? errorInfos.get(code)?.code : 'E00: Unspecified Error' }}</div>
        <div>{{ code ? errorInfos.get(code)?.message : 'Please try again later' }}</div>
      </div>
      <ButtonBase class="font-semibold w-full" @click="close"> Close </ButtonBase>
    </div>
  </ModalBase>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import ModalBase from './ModalBase.vue'
import type { ErrorInfo } from '@/types/types'
import ButtonBase from './buttons/ButtonBase.vue'

interface Props {
  code: string
}

const showPop = ref(false)

onMounted(async () => {
  await nextTick()
  showPop.value = true
})

defineProps<Props>()

const modal = ref<InstanceType<typeof ModalBase> | null>(null)
const open = () => {
  modal.value?.open()
}

const close = () => {
  modal.value?.close()
}

const errorInfos: Map<string, ErrorInfo> = new Map([
  ['E01', { code: 'E01: Request failed', message: 'Please try again later' }],
  ['E01A', { code: 'E01A: Request failed: timeout', message: 'Please try again later' }],
  [
    'E01B',
    {
      code: 'E01A: Request failed: unauthorized',
      message: "You're not authorized to make this request",
    },
  ],
  [
    'E02',
    {
      code: 'E02: Authentication failed',
      message: 'Credentials provided are invalid',
    },
  ],
  [
    'E03',
    {
      code: 'E03: Internal server error',
      message: 'Please try again later',
    },
  ],
  [
    'E04',
    {
      code: 'E04: Bad request',
      message: 'Please try again later',
    },
  ],
])

defineExpose({ open })
</script>
