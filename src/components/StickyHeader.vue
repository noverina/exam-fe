<template>
  <nav
    id="header"
    class="bg-white flex justify-between px-8 py-3 h-12 sticky top-0 z-50 border border-gray-300"
  >
    <div class="flex gap-4">
      <router-link to="/" class="material-symbols-outlined">home</router-link>
    </div>
    <div class="flex gap-4 justify-center items-center">
      <div class="material-symbols-outlined base-icon">account_circle</div>
      <div>{{ authStore.user?.name }}</div>
      <ButtonBase
        class="text-xs flex justify-center items-center cursor-pointer px-4! py-1!"
        @click="authStore.logout(originalFetch)"
        >Logout</ButtonBase
      >
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { originalFetch } from '@/main'
import ButtonBase from './buttons/ButtonBase.vue'
const authStore = useAuthStore()
</script>
