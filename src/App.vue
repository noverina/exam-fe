<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

//TODO role management
import { useAuthStore } from './stores/auth.ts'
const authStore = useAuthStore()
authStore.setRole('TEACHER')
</script>

<template>
  <nav class="bg-indigo-200 flex justify-between px-8 py-4 shadow mb-2 h-14 sticky top-0">
    <div class="flex gap-4">
      <router-link to="/">Home</router-link>
    </div>
    <div>User</div>
  </nav>
  <RouterView />
</template>
