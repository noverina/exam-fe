<template>
  <Transition name="fade">
    <div
      v-show="isVisible"
      class="bg-black/30 h-screen w-screen fixed inset top-0 z-50 flex justify-center items-center"
      :class="{ 'cursor-pointer': isOutsideClosable }"
      @click="isOutsideClosable && close()"
    >
      <div
        class="bg-white rounded-md flex flex-col shadow-xl min-w-1/4 max-w-10/12 lg:max-w-5/12 cursor-default"
        @click.stop
      >
        <div
          v-if="isHeader"
          class="flex justify-between gap-10 py-4 border-b border-gray-400 items-center rounded-t-md"
        >
          <div class="flex px-4 gap-2 justify-center items-center">
            <div class="flex">
              <div class="material-symbols-outlined base-icon">{{ headerIcon }}</div>
            </div>
            <div class="font-semibold">{{ headerText }}</div>
          </div>
          <div class="px-4 flex cursor-pointer" @click="close">
            <div
              class="p-1 bg-white rounded-lg material-symbols-outlined base-icon transform transition duration-200 hover:scale-120"
            >
              close
            </div>
          </div>
        </div>
        <div class="flex p-4"><slot></slot></div>
      </div>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  headerIcon: string
  headerText: string
  isHeader: boolean
  isOutsideClosable: boolean
}

defineProps<Props>()

const isVisible = ref(false)

const open = () => {
  isVisible.value = true
}

const close = () => {
  isVisible.value = false
}

defineExpose({ open, close })
</script>
