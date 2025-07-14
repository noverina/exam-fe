<template>
  <ButtonBase :custom-class="isBorder ? borderClass : normalClass"><slot></slot></ButtonBase>
</template>

<script setup lang="ts">
import ButtonBase from './ButtonBase.vue'

interface Props {
  isBorder: boolean
}

defineProps<Props>()

const borderClass = 'border-green-500 bg-white hover:border-green-700'
const normalClass = 'bg-emerald-300 border-emerald-500 hover:bg-green-400 hover:border-green-600'
</script>
