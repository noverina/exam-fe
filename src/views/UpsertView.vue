<template>
  <main class="cursor-auto text-gray-800">
    <form novalidate @submit.prevent="handleSubmit" class="flex gap-5 p-4 h-[calc(100vh-4rem)]">
      <div class="sticky top-14">
        <h1 class="font-semibold text-lg text-indigo-800">
          {{ create ? 'Create' : 'Update' }} exam
        </h1>
        <div class="flex flex-col gap-4 justify-center items-start sticky top-30 self-start">
          <div class="flex items-center gap-2">
            <label for="type" class="w-30 rounded-full bg-indigo-200 px-4 py-2">Type</label>
            <select id="type" v-model="form.type" class="border-b px-2 w-50">
              <option v-for="option in examTypeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <label for="start-date" class="w-30 rounded-full bg-indigo-200 px-4 py-2"
              >Start date</label
            >
            <input
              id="start-date"
              v-model="form.startDate"
              type="date"
              class="border-b px-2 w-50"
              required
            />
          </div>
          <div class="flex items-center gap-2">
            <label for="end-date" class="w-30 rounded-full bg-indigo-200 px-4 py-2">End date</label>
            <input
              id="end-date"
              v-model="form.endDate"
              type="date"
              class="border-b px-2 w-50"
              required
            />
          </div>
          <div class="flex bg-indigo-200 rounded-full w-full px-4 py-2 justify-between">
            <div>
              <div>Add new questions</div>
            </div>
            <div
              @click="createQuestion"
              class="text-indigo-800 bg-white rounded-full w-6 h-6 material-symbols-outlined cursor-pointer"
            >
              add
            </div>
          </div>

          <div class="flex bg-indigo-200 rounded-full w-full px-4 py-2 justify-between">
            <div>
              <div>Jump to question no.</div>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="number"
                class="text-indigo-800 bg-white rounded-full w-15 px-4"
                placeholder="0"
                v-model.number="jumpInput"
              />
              <div
                class="text-indigo-800 bg-white rounded-full w-6 h-6 material-symbols-outlined cursor-pointer"
                @click="scrollToQuestion"
                title="go"
              >
                arrow_right
              </div>
            </div>
          </div>
          <div class="flex bg-indigo-200 rounded-full w-full px-4 py-2 justify-between">
            <div>Submit</div>
            <button
              class="text-indigo-800 bg-white rounded-full w-6 h-6 material-symbols-outlined cursor-pointer"
              title="go"
              type="submit"
            >
              arrow_right
            </button>
          </div>
        </div>
      </div>

      <div class="flex gap-4 items-start overflow-y-scroll w-full">
        <div class="flex flex-col px-4 py-2 items-start w-full">
          <TransitionGroup name="fade" tag="div" class="flex flex-col gap-4 overflow-y-auto w-full">
            <UpsertQuestion
              v-for="(question, index) in form.questions"
              :key="question.questionId"
              :index="index"
              class="scroll-mt-108"
              :question="question"
              @update-question="updateQuestion"
              @delete-question="deleteQuestion"
              @create-answer="createAnswer"
              @update-answer="updateAnswer"
              @delete-answer="deleteAnswer"
            ></UpsertQuestion>
          </TransitionGroup>
        </div>
      </div>
    </form>
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Answer, FormExam } from '@/types/types.ts'
import { ExamType } from '../types/enums.ts'
import UpsertQuestion from '@/components/UpsertQuestion.vue'

onMounted(() => {
  createQuestion()
})

const route = useRoute()
const examId = route.query.id
const create = examId == null ? true : false

const form = ref<FormExam>({
  examId: 0,
  type: ExamType.MID,
  startDate: '2025-04-16T00:00:00Z',
  endDate: '2025-04-16T00:00:00Z',
  questions: [],
  new: true,
})

const maxQuestion = Number(import.meta.env.VITE_MAX_QUESTION)
const createQuestion = () => {
  //TODO error handling
  if (form.value.questions.length < maxQuestion) {
    form.value.questions.push({
      questionId: form.value.questions.length + Math.floor(Date.now() / 1000),
      text: '',
      answers: [],
    })
  }
}

const updateQuestion = (data: { id: number; field: string; value: string }) => {
  const question = form.value.questions.find((question) => question.questionId == data.id)
  if (question) {
    switch (data.field) {
      case 'text':
        question.text = data.value
        break
    }
  }
}

const deleteQuestion = (questionId: number) => {
  if (form.value.questions.find((question) => question.questionId === questionId)) {
    const index = form.value.questions.findIndex((q) => q.questionId === questionId)
    if (index !== -1) {
      form.value.questions.splice(index, 1)
    }
  }
}

const maxAnswer = Number(import.meta.env.VITE_MAX_ANSWER)
const createAnswer = (data: { answer: Answer; questionId: number }) => {
  const index = form.value.questions.findIndex((q) => q.questionId === data.questionId)
  if (form.value.questions[index] && form.value.questions[index].answers.length < maxAnswer) {
    form.value.questions[index].answers.push(data.answer)
  }
}

const updateAnswer = (data: {
  questionIndex: number
  index: number
  field: string
  value: string
}) => {
  const questionIndex = form.value.questions.findIndex((q) => q.questionId === data.questionIndex)
  if (questionIndex != -1) {
    const answerIndex = form.value.questions[questionIndex].answers.findIndex(
      (a) => a.answerId === data.index,
    )
    switch (data.field) {
      case 'text':
        form.value.questions[questionIndex].answers[answerIndex].text = data.value
        break
      case 'isCorrect':
        // set selected answer to true
        // set every item but the selected answer to false
        const choiceCharCode = data.value.charCodeAt(0) - 65
        for (let i = 0; i < form.value.questions[questionIndex].answers.length; i++) {
          form.value.questions[questionIndex].answers[i].isCorrect = i == choiceCharCode
        }
    }
  }
}

const deleteAnswer = (questionId: number, answerId: number) => {
  const questionIndex = form.value.questions.findIndex((q) => q.questionId === questionId)
  if (form.value.questions[questionIndex]) {
    const answerIndex = form.value.questions[questionIndex].answers.findIndex(
      (answer) => answer.answerId === answerId,
    )
    if (answerIndex !== -1) {
      form.value.questions[questionIndex].answers.splice(answerIndex, 1)
    }
  }
}

const examTypeOptions = Object.values(ExamType).map((value) => ({
  label: value,
  value: value,
}))

const handleSubmit = () => {
  console.log('submit')
  console.log(form)
}

// const validate = (formData: FormExam) => {}

const jumpInput = ref(0)
const scrollToQuestion = () => {
  console.log(scroll, jumpInput.value)
  const element = document.getElementById(`upsert-question-${jumpInput.value + 1}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
