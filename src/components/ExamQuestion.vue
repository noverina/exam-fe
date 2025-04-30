<template>
  <div class="flex flex-col border m-4 p-4 gap-2">
    <span class="font-semibold">{{ index + 1 }}. {{ question.text }}</span>
    <ExamAnswer
      v-for="answer in question.answers"
      :key="answer.answerId"
      :answer="answer"
      :answer-value="selectedAnswer"
      @select-answer="selectAnswer"
      :class="['odd:bg-white', 'even:bg-indigo-100']"
    ></ExamAnswer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ExamAnswer from '@/components/ExamAnswer.vue'
import type { Question } from '@/types/types.ts'

interface Props {
  index: number
  question: Question
}
const props = defineProps<Props>()

onMounted(() => {
  if (props.question.selectedAnswerId) selectedAnswer.value = props.question.selectedAnswerId
})

const selectedAnswer = ref<number | null>(null)
const emit = defineEmits<{
  'answer-question': [data: { questionId: number; answerId: number }]
}>()

function selectAnswer(answerId: number) {
  selectedAnswer.value = answerId
  emit('answer-question', { questionId: props.question.questionId, answerId: answerId })
}
</script>
