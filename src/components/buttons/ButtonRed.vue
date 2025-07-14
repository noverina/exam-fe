<template>
  <ButtonBase :custom-class="isBorder ? borderClass : normalClass"> <slot></slot></ButtonBase>
</template>

<script setup lang="ts">
import ButtonBase from './ButtonBase.vue'

interface Props {
  isBorder: boolean
}

defineProps<Props>()

const borderClass = 'border-red-500 bg-white hover:border-red-700'
const normalClass = 'bg-rose-300 border-rose-500 hover:bg-red-400 hover:border-red-600'
</script>
