<template>
  <div class="flex flex-col border border-gray-600 m-4 p-4 gap-2 rounded-sm">
    <span class="font-semibold">{{ index + 1 }}. {{ question.text }}</span>
    <ExamAnswer
      v-for="answer in question.answers"
      :key="answer.answerId"
      :answer="answer"
      :selected-answer="selectedAnswer"
      :correct-answer="question.correctAnswerId"
      :can-change-answer="canChangeAnswer"
      @select-answer="selectAnswer"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ExamAnswer from '@/components/ExamAnswer.vue'
import type { Question } from '@/types/types.ts'

interface Props {
  index: number
  question: Question
  canChangeAnswer: boolean
}
const props = defineProps<Props>()

const selectedAnswer = ref<string | null>(null)
onMounted(() => {
  if (props.question.selectedAnswerId) selectedAnswer.value = props.question.selectedAnswerId
})

const emit = defineEmits<{
  'answer-question': [data: { questionId: string; answerId: string }]
}>()

const selectAnswer = (answerId: string) => {
  selectedAnswer.value = answerId
  emit('answer-question', { questionId: props.question.questionId, answerId: answerId })
}
</script>
