<template>
  <div
    class="flex gap-2 p-2 text-sm border border-gray-300"
    :class="{ 'bg-green-100': answer.isCorrect }"
  >
    <input
      type="radio"
      id="radio"
      :value="answer.answerId"
      :checked="answerValue === answer.answerId"
      :disabled="!canChangeAnswer"
      @change="onClick"
    />

    <label for="radio">{{ answer.text }}</label>
  </div>
</template>
<script setup lang="ts">
import type { Answer } from '@/types/types'

interface Props {
  answer: Answer
  answerValue: string | null
  canChangeAnswer: boolean
}
const props = defineProps<Props>()

const emit = defineEmits<{ 'select-answer': [id: string] }>()

const onClick = () => {
  emit('select-answer', props.answer.answerId)
}
</script>
