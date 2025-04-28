<template>
  <main class="cursor-auto text-gray-800 text-sm">
    <div v-if="loading">
      <LoadingSpinner />
    </div>
    <div v-else>
      <form novalidate @submit.prevent class="flex px-6 gap-4">
        <div class="w-1/3 flex flex-col gap-4 sticky top-14 h-[calc(100vh-4rem)] overflow-auto">
          <div class="font-semibold text-lg text-indigo-800">
            {{ form.isNew ? 'Create' : 'Update' }} exam
          </div>
          <div class="flex items-center gap-2">
            <label for="type" class="w-40 rounded-full bg-indigo-200 px-4 py-2">Type</label>
            <select id="type" v-model="form.type" class="border-b px-2 w-50 flex-1">
              <option v-for="option in examTypeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <label for="start-date" class="w-40 rounded-full bg-indigo-200 px-4 py-2"
              >Start date</label
            >

            <VueDatePicker
              id="start-date"
              v-model="form.startDate"
              class="border-b flex flex-1"
              placeholder="Select here..."
              year-first
              :min-date="new Date()"
              :clearable="false"
              :format="dateInputFormat"
              :month-change-on-scroll="false"
              auto-apply
              time-picker-inline
            />
          </div>
          <Transition name="fade">
            <div
              v-if="errors.get('start-date')"
              class="flex bg-red-300 rounded-full w-full px-4 py-2"
            >
              {{ errors.get('start-date') }}
            </div>
          </Transition>
          <div class="flex items-center gap-2">
            <label for="end-date" class="w-40 rounded-full bg-indigo-200 px-4 py-2">End date</label>
            <VueDatePicker
              id="end-date"
              v-model="form.endDate"
              class="border-b flex flex-1"
              placeholder="Select here..."
              year-first
              :min-date="new Date()"
              :clearable="false"
              :format="dateInputFormat"
              :month-change-on-scroll="false"
              auto-apply
              time-picker-inline
            />
          </div>
          <Transition name="fade">
            <div
              v-if="errors.get('end-date')"
              class="flex bg-red-300 rounded-full w-full px-4 py-2"
            >
              {{ errors.get('end-date') }}
            </div>
          </Transition>
          <div class="flex items-center gap-2">
            <label for="end-date" class="w-40 rounded-full bg-indigo-200 px-4 py-2"
              >Passing grade</label
            >
            <input
              type="number"
              v-model.number="form.passingGrade"
              class="border-b flex flex-1 px-4"
            />
          </div>
          <Transition name="fade">
            <div
              v-if="errors.get('passing-grade')"
              class="flex bg-red-300 rounded-full w-full px-4 py-2"
            >
              {{ errors.get('passing-grade') }}
            </div>
          </Transition>
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
          <Transition name="fade">
            <div
              v-if="instantErrors.get('create-question')"
              class="flex bg-red-300 rounded-full w-full px-4 py-2"
            >
              {{ instantErrors.get('create-question') }}
            </div>
          </Transition>
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
          <Transition name="fade">
            <div
              v-if="instantErrors.get('jump-input')"
              class="flex bg-red-300 rounded-full w-full px-4 py-2"
            >
              {{ instantErrors.get('jump-input') }}
            </div>
          </Transition>
          <div class="flex bg-indigo-200 rounded-full w-full px-4 py-2 justify-between">
            <div>Submit</div>
            <button
              class="text-indigo-800 bg-white rounded-full w-6 h-6 material-symbols-outlined cursor-pointer"
              title="go"
              @click="onSubmit"
            >
              arrow_right
            </button>
          </div>
          <Transition name="fade">
            <div v-if="errors.get('overall')" class="flex bg-red-300 rounded-full w-full px-4 py-2">
              {{ errors.get('overall') }}
            </div>
          </Transition>
        </div>

        <div class="flex gap-4 items-start w-2/3">
          <div class="flex flex-col px-4 py-2 items-start w-full">
            <div
              v-if="errors.get('questions')"
              class="flex bg-red-300 rounded-full w-full px-4 py-2"
            >
              {{ errors.get('questions') }}
            </div>
            <TransitionGroup
              v-if="form.questions.length > 0"
              name="fade"
              tag="div"
              class="flex flex-col gap-4 w-full"
            >
              <UpsertQuestion
                v-for="(question, index) in form.questions"
                :key="question.questionId"
                :index="index"
                :question="question"
                :errors="errors"
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
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import type { FormAnswer, FormExam } from '@/types/types.ts'
import { ExamType } from '../types/enums.ts'
import UpsertQuestion from '@/components/UpsertQuestion.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { handleError } from '@/utils/format.ts'
import { generateRandomNumber } from '@/utils/number.ts'
import { fetchUpdateData, submitFormExam } from '@/utils/API/exam.ts'

const route = useRoute()
const examId = route.query.examId
const courseTeacherId = route.params.courseTeacherId
const loading = ref(false)
const form = reactive<FormExam>({
  examId: 0,
  courseTeacherId: 0,
  type: 'QUIZ',
  startDate: '',
  endDate: '',
  passingGrade: 0,
  questions: [],
  isNew: examId == null || examId == undefined,
  formDelete: [],
})

onMounted(() => {
  if (examId != null || examId != undefined) prefill(Number(examId))
  if (form.questions.length == 0) createQuestion()
})

const prefill = async (examId: number) => {
  try {
    loading.value = true
    const res = await fetchUpdateData(examId)
    if (res != null) {
      const data = res.data as unknown as FormExam
      form.examId = data.examId
      form.courseTeacherId = data.courseTeacherId
      form.type = data.type
      form.startDate = data.startDate
      form.endDate = data.endDate
      form.passingGrade = data.passingGrade
      form.questions = data.questions
      data.questions.forEach((dataQuestion, index) => {
        const targetQuestion = form.questions[index]
        if (targetQuestion) {
          targetQuestion.answers = structuredClone(dataQuestion.answers)
        }
      })
      console.log(form)
      form.isNew = false
    }
  } catch (err) {
    if (err instanceof Error) {
      handleError('Error fetching: ' + err.message)
    } else {
      handleError("Thrown error isn't an error: " + err)
    }
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  const errorsResult = validate(form)
  errors.value = errorsResult
  if (errors.value.size == 0) {
    try {
      normalize()
      console.log(form)
      await submitFormExam(form)
    } catch (err) {
      if (err instanceof Error) {
        handleError('Error submiting: ' + err.message)
      } else {
        handleError("Thrown error isn't an error: " + err)
      }
    } finally {
      window.location.reload()
    }
  }
}

const errors = ref(new Map<string, string>())
const instantErrors = ref(new Map<string, string>())
const validate = (data: FormExam): Map<string, string> => {
  errors.value.clear()
  const output = new Map<string, string>()
  const startDateValid = data.startDate != ''
  const endDateValid = data.startDate != ''
  if (!startDateValid) output.set('start-date', 'Start date must be filled')
  if (!endDateValid) output.set('end-date', 'End date must be filled')
  if (startDateValid && endDateValid && data.startDate > data.endDate)
    output.set('end-date', 'Start date is after end date')
  const passingGradeValid = data.passingGrade != 0
  if (!passingGradeValid) output.set('passing-grade', 'Passing grade must be filled')
  if (passingGradeValid && (data.passingGrade < 0 || data.passingGrade > 100))
    output.set('passing-grade', 'Passing grade must be between (0 - 100)')

  const questionsExist = data.questions.length != 0
  if (questionsExist) {
    for (const question of data.questions) {
      if (!question.text?.trim())
        output.set('question-text-' + question.questionId, 'Question must be filled')
      const answersExist = question.answers.length != 0

      if (answersExist) {
        for (const answer of question.answers) {
          if (!answer.text?.trim())
            output.set('answer-text-' + answer.answerId, 'Answer must be filled')
        }
        const anyCorrectAnswer = question.answers.filter((answer) => answer.isCorrect)
        if (anyCorrectAnswer.length == 0)
          output.set('answers', 'Question must have one correct answer')
      } else {
        output.set('answers', 'Minimum 1 answer required')
      }
    }
  } else {
    output.set('questions', 'Minimum 1 question required')
  }

  if (output.size != 0) {
    output.set('overall', 'Error detected, please recheck form')
  }
  return output
}

const normalize = () => {
  form.courseTeacherId = Number(courseTeacherId)
  if (!form.isNew) form.examId = Number(examId)
  form.startDate = new Date(form.startDate).toISOString()
  form.endDate = new Date(form.endDate).toISOString()
  // this is because the generated temp id can exceed int range (the data type for id in backen)
  for (const question of form.questions) {
    if (question.isNew) question.questionId = 0
    for (const answer of question.answers) {
      if (answer.isNew) answer.answerId = 0
    }
  }
}

//TODO change this later
const maxQuestion = 3 //Number(import.meta.env.VITE_MAX_QUESTION)
const createQuestion = () => {
  instantErrors.value.clear()

  if (form.questions.length < maxQuestion) {
    form.questions.push({
      questionId: generateRandomNumber(form.questions.length),
      text: '',
      answers: [],
      isNew: true,
    })
  } else {
    instantErrors.value.set('create-question', 'Max questions (' + maxQuestion + ') reached')
  }
}

const updateQuestion = (data: { id: number; field: string; value: string }) => {
  const question = form.questions.find((question) => question.questionId == data.id)
  if (question) {
    switch (data.field) {
      case 'text':
        question.text = data.value
        break
    }
  }
}

const deleteQuestion = (questionId: number) => {
  if (form.questions.find((question) => question.questionId === questionId)) {
    const index = form.questions.findIndex((q) => q.questionId === questionId)
    if (index !== -1) {
      if (!form.questions[index].isNew) form.formDelete.push({ id: questionId, type: 'QUESTION' })
      form.questions.splice(index, 1)
    }
  }
}

const maxAnswer = Number(import.meta.env.VITE_MAX_ANSWER)
const createAnswer = (questionId: number) => {
  const index = form.questions.findIndex((q) => q.questionId == questionId)
  if (form.questions[index] && form.questions[index].answers.length < maxAnswer) {
    const answer: FormAnswer = {
      answerId: generateRandomNumber(questionId),
      text: '',
      isCorrect: false,
      isNew: true,
    }
    form.questions[index].answers.push(answer)
  }
}

const updateAnswer = (data: {
  questionId: number
  answerId: number
  field: string
  value: string
}) => {
  const questionIndex = form.questions.findIndex((q) => q.questionId === data.questionId)
  if (questionIndex != -1) {
    const answerIndex = form.questions[questionIndex].answers.findIndex(
      (a) => a.answerId === data.answerId,
    )
    switch (data.field) {
      case 'text':
        form.questions[questionIndex].answers[answerIndex].text = data.value
        break
      case 'isCorrect':
        // set selected answer to true
        // set every item but the selected answer to false
        const choiceCharCode = data.value.charCodeAt(0) - 65
        for (let i = 0; i < form.questions[questionIndex].answers.length; i++) {
          form.questions[questionIndex].answers[i].isCorrect = i == choiceCharCode
        }
    }
  }
}

const deleteAnswer = (data: { questionId: number; answerId: number }) => {
  const questionIndex = form.questions.findIndex((q) => q.questionId === data.questionId)
  if (form.questions[questionIndex]) {
    const answerIndex = form.questions[questionIndex].answers.findIndex(
      (answer) => answer.answerId === data.answerId,
    )
    if (answerIndex !== -1) {
      if (!form.questions[questionIndex].answers[answerIndex].isNew)
        form.formDelete.push({ id: data.answerId, type: 'ANSWER' })
      form.questions[questionIndex].answers.splice(answerIndex, 1)
    }
  }
}

const examTypeOptions = Object.entries(ExamType).map(([key, value]) => ({
  value: key,
  label: value,
}))

const jumpInput = ref(0)
const scrollToQuestion = () => {
  instantErrors.value.clear()
  const element = document.getElementById(`upsert-question-${jumpInput.value - 1}`)
  const header = document.getElementById('header')
  if (header && element) {
    const headerHeight = header.offsetHeight
    window.scrollTo({
      top: element.offsetTop - headerHeight - 10,
      behavior: 'smooth',
    })
  } else {
    instantErrors.value.set('jump-input', 'Invalid question number')
  }
}

const dateInputFormat = (date: Date) => {
  return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
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

:deep(.dp__theme_light) {
  --dp-text-color: #2d3748; /* gray-800 */
  --dp-menu-border-color: #9ca3af; /* gray-400 */
  --dp-primary-color: #7f9cf5; /* indigo-400 */
  --dp-icon-color: #2d3748; /* gray-800 */
  --dp-border-color: transparent;
  --dp-border-color-hover: transparent;
  --dp-border-color-focus: transparent;
}

:deep(dp__input_wrap) {
  flex: 1 1 auto;
}

.dp__main {
  --dp-font-family: 'Poppins', sans-serif;
  --dp-input-icon-padding: 40px;
  --dp-input-padding: 0px;
  --dp-font-size: 0.875rem;
  --dp-preview-font-size: 0.875rem;
  --dp-time-font-size: 1rem;
  --dp-cell-size: 30px;
  --dp-cell-padding: 3px;
}
</style>
