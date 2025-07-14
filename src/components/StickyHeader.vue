<template>
  <nav
    id="header"
    class="bg-white flex justify-between px-8 py-3 h-12 sticky top-0 z-50 border border-gray-300"
  >
    <div class="flex gap-4">
      <router-link to="/" class="material-symbols-outlined">home</router-link>
    </div>
    <div class="flex gap-4 cursor-pointer" @click="isVisible = !isVisible">
      <div class="material-symbols-outlined">account_circle</div>
      <div>{{ authStore.user?.name }}</div>
    </div>
  </nav>
  <Transition name="slide">
    <div v-if="isVisible" class="fixed right-2 top-12 z-99">
      <ButtonYellow
        @click="authStore.logout(originalFetch)"
        :is-border="false"
        class="text-sm w-50 font-semibold"
      >
        Logout
      </ButtonYellow>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { originalFetch } from '@/main'
import ButtonYellow from './buttons/ButtonYellow.vue'
const authStore = useAuthStore()
const isVisible = ref(false)
</script>
