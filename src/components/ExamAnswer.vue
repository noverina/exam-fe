<template>
  <div class="flex gap-2 p-2 text-sm">
    <input
      type="radio"
      id="radio"
      :value="answer.answerId"
      :checked="answerValue === answer.answerId"
      @change="onClick"
    />
    <label for="radio">{{ answer.text }}</label> {{ answer.answerId }}
  </div>
</template>
<script setup lang="ts">
import type { Answer } from '@/types/types'

interface Props {
  answer: Answer
  answerValue: number | null
}
const props = defineProps<Props>()

const emit = defineEmits<{ 'select-answer': [id: number] }>()

const onClick = () => {
  emit('select-answer', props.answer.answerId)
}
</script>
