<template>
  <nav
    id="header"
    class="bg-white flex justify-between px-8 py-3 shadow mb-2 h-12 sticky top-0 z-50 border-b border-gray-400"
  >
    <div class="flex gap-4">
      <router-link to="/" class="material-symbols-outlined">home</router-link>
      <router-link to="/test">test</router-link>
    </div>
    <div>User</div>
  </nav>
</template>
<script setup lang="ts">
defineOptions({
  name: 'StickyHeader',
})

// interface Props {
//   index: number
// }
// const props = defineProps<Props>()
</script>
