<template>
  <div class="flex gap-2 p-2 text-sm">
    <input
      type="radio"
      id="radio"
      :value="answerId"
      :checked="modelValue === answerId"
      @change="$emit('update:model-value', answerId)"
    />
    <label for="radio">{{ text }}</label>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'ExamAnswer',
})

interface Props {
  answerId: number
  text: string
  isCorrect: boolean
  modelValue: number | null
}
defineProps<Props>()

defineEmits(['update:model-value'])
</script>
