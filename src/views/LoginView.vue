<template>
  <div class="flex justify-center items-center h-screen w-full text-sm">
    <div class="relative w-3/12 h-5/12 border border-gray-300 rounded-sm overflow-hidden">
      <Transition name="fade">
        <div
          v-if="isManual"
          class="absolute inset-0 flex flex-col gap-4 justify-center items-center px-8"
        >
          <div class="flex flex-col gap-2 w-full">
            <label for="email">E-mail</label>
            <input
              type="email"
              name="email"
              class="border border-gray-400 rounded-sm px-2 py-1"
              placeholder="Type here..."
            />
          </div>
          <div class="flex flex-col gap-2 w-full">
            <label for="password">Password</label>
            <input
              type="password"
              name="password"
              class="border border-gray-400 rounded-sm px-2 py-1"
              placeholder="Type here..."
            />
          </div>
          <div
            c
            class="text-center cursor-pointer rounded-full bg-indigo-200 py-2 w-full"
            @click="isManual = !isManual"
          >
            Login via preselected account
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <div
          v-if="!isManual"
          class="absolute inset-0 flex flex-col gap-8 justify-center items-center px-8"
        >
          <div class="flex flex-col gap-4 w-full">
            <label for="email" class="flex items-center gap-4">
              Login as
              <span
                class="material-symbols-outlined cursor-pointer small-icon"
                title="these are pre-selected accounts for demonstration purpose, please contact me for specific accounts"
              >
                help
              </span>
            </label>
            <select class="border border-gray-400 rounded-sm px-2 py-1">
              <option>test</option>
            </select>
          </div>
          <div
            @click="isManual = !isManual"
            class="text-center cursor-pointer rounded-full bg-yellow-300 py-2 w-full"
          >
            Login manually
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isManual = ref(false)
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
