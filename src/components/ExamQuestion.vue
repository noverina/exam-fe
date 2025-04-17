<template>
  <div class="flex flex-col border m-4 p-4 gap-2">
    <span class="font-semibold">{{ index + 1 }}. {{ text }}</span>
    <AnswerComponent
      v-for="answer in answers"
      :key="answer.answerId"
      :answer-id="answer.answerId"
      :text="answer.text"
      :is-correct="answer.isCorrect"
      :model-value="selectedAnswer"
      @update:model-value="handleAnswerSelection($event)"
      :class="['odd:bg-white', 'even:bg-gray-200']"
    ></AnswerComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import AnswerComponent from '@/components/ExamAnswer.vue'
import type { Answer } from '@/types/types.ts'
import type { Ref } from 'vue'

defineOptions({
  name: 'QuestionItem',
})

interface Props {
  index: number
  questionId: number
  text: string
  answers: Answer[]
}
const props = defineProps<Props>()

const selectedAnswer = ref<number | null>(null)
const answeredQuestions = inject('answeredQuestions') as Ref<Record<number, boolean>>

function handleAnswerSelection(answerId: number) {
  selectedAnswer.value = answerId
  if (!answeredQuestions.value.hasOwnProperty(props.questionId)) {
    answeredQuestions.value[props.questionId] = true
  }
}
</script>
