<template>
  <button
    class="border transition-colors duration-300 p-2 rounded-sm cursor-pointer"
    :class="customClass ? customClass : 'border-gray-400 bg-white hover:border-gray-600'"
  >
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
interface Props {
  customClass?: string
}

defineProps<Props>()
</script>
