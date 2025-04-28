<template>
  <div class="flex flex-col border m-4 p-4 gap-2">
    <span class="font-semibold">{{ index + 1 }}. {{ text }}</span>
    <ExamAnswer
      v-for="answer in answers"
      :key="answer.answerId"
      :answer-id="answer.answerId"
      :text="answer.text"
      :is-correct="answer.isCorrect"
      :model-value="selectedAnswer"
      @update:model-value="handleAnswerSelection($event)"
      :class="['odd:bg-white', 'even:bg-indigo-100']"
    ></ExamAnswer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ExamAnswer from '@/components/ExamAnswer.vue'
import type { Answer } from '@/types/types.ts'

defineOptions({
  name: 'ExamQuestion',
})

interface Props {
  index: number
  questionId: number
  text: string
  answers: Answer[]
}
const props = defineProps<Props>()

const selectedAnswer = ref<number | null>(null)
const emit = defineEmits<{ 'answer-question': [id: number] }>()

function handleAnswerSelection(answerId: number) {
  selectedAnswer.value = answerId
  emit('answer-question', props.questionId)
}
</script>
