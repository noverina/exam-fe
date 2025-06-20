<script setup lang="ts">
import { RouterView } from 'vue-router'
import StickyHeader from '@/components/StickyHeader.vue'

//TODO role management
import { useAuthStore } from './stores/auth.ts'
const authStore = useAuthStore()
authStore.setRole('TEACHER')
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <StickyHeader v-if="authStore != null" />
    <RouterView />
  </div>
</template>
