<template>
  <Transition name="fade">
    <div
      v-show="showCondition"
      class="flex text-red-500 text-xs font-semibold border px-4 py-1 rounded-sm"
    >
      <slot></slot>
    </div>
  </Transition>
</template>
<script setup lang="ts">
interface Props {
  showCondition: string | undefined
}
defineProps<Props>()
</script>
