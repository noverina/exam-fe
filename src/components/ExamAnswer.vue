<template>
  <div
    class="flex gap-2 p-2 text-sm border border-gray-400"
    :class="{
      'bg-green-100': selectedAnswer == answer.answerId && answer.isCorrect == true,
      'bg-red-100': selectedAnswer == answer.answerId && answer.isCorrect == false,
      'border-green-600 font-semibold': answer.answerId == correctAnswer,
    }"
  >
    <input
      type="radio"
      id="radio"
      :value="answer.answerId"
      :checked="selectedAnswer === answer.answerId"
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
  selectedAnswer: string | null
  correctAnswer: string | null
  canChangeAnswer: boolean
}
const props = defineProps<Props>()

const emit = defineEmits<{ 'select-answer': [id: string] }>()

const onClick = () => {
  emit('select-answer', props.answer.answerId)
}
</script>
