<template>
  <Transition name="fade">
    <div
      v-if="isVisible"
      class="bg-black/30 h-screen w-screen fixed inset top-0 z-50 flex justify-center items-center cursor-pointer"
      @click="close"
    >
      <div
        class="bg-white rounded-md flex flex-col shadow-xl min-w-1/4 max-w-5/12 cursor-default"
        @click.stop
      >
        <div
          v-if="isHeader"
          class="flex justify-between gap-10 py-4 bg-indigo-200 items-center rounded-t-md"
        >
          <div class="flex px-4 gap-2 justify-center items-center">
            <div class="flex">
              <div class="material-symbols-outlined base-icon">{{ headerIcon }}</div>
            </div>
            <div class="font-semibold">{{ headerText }}</div>
          </div>
          <div class="px-4 flex cursor-pointer" @click="close">
            <div class="p-1 bg-white rounded-full material-symbols-outlined base-icon">close</div>
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

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
