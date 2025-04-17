<template>
  <main class="cursor-auto">
    <div v-if="questions.length > 0">
      <ExamSheet :questions="questions" :exam-id="+examId"></ExamSheet>
      <ExamQuestion
        v-for="(question, index) in questions"
        :key="index"
        :id="'question-' + question.questionId"
        :index="index"
        :text="question.text"
        :question-id="question.questionId"
        :answers="question.answers"
        class="scroll-mt-14"
      >
      </ExamQuestion>
    </div>
    <div v-else class="text-gray-400">No data found</div>
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import { fetchQuestions } from '../utils/API/exam.ts'
import { handleError } from '../utils/format.ts'
import type { Question, HttpResponse } from '../types/types.ts'
import ExamQuestion from '../components/ExamQuestion.vue'
import ExamSheet from '../components/ExamSheet.vue'

const route = useRoute()
const examId = route.params.id

const res = ref<HttpResponse<Question[] | string>>({ isError: false, message: '', data: [] })
const questions = ref<Question[]>([])

onMounted(async () => {
  try {
    if (typeof examId !== 'string') {
      throw new Error('Exam id undefined')
    }
    res.value = await fetchQuestions(examId)
    if (res.value != null) {
      questions.value = res.value.data as Question[]
    }
  } catch (err) {
    if (err instanceof Error) {
      handleError('Error fetching: ' + err.message)
    } else {
      handleError("Thrown error isn't an error: " + err)
    }
  }
})

const answeredQuestions = ref<Record<number, boolean>>({})
provide('answeredQuestions', answeredQuestions)
</script>
