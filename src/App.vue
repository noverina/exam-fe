<template>
  <div class="min-h-screen bg-gray-100">
    <StickyHeader v-if="showHeader" />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import StickyHeader from '@/components/StickyHeader.vue'

const route = useRoute()
const showHeader = computed(() => {
  const hiddenRoutes = ['/unauthorized', '/not-found', '/auth']
  return !hiddenRoutes.includes(route.path)
})
</script>

<style>
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

.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.1s ease,
    opacity 0.1s ease;
  transform-origin: top;
  will-change: transform, opacity;
}

.slide-enter-from,
.slide-leave-to {
  transform: scaleY(0);
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  transform: scaleY(1);
  opacity: 1;
}

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
