<template>
  <ButtonBase :custom-class="isBorder ? borderClass : normalClass"><slot></slot></ButtonBase>
</template>

<script setup lang="ts">
import ButtonBase from './ButtonBase.vue'

interface Props {
  isBorder: boolean
}

defineProps<Props>()

const borderClass = 'border-yellow-500 bg-white hover:border-amber-700'
const normalClass = 'bg-yellow-300 border-yellow-500 hover:bg-amber-400 hover:border-amber-600'
</script>
