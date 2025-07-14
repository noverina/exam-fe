<template>
  <main class="cursor-auto text-gray-800 text-sm">
    <ModalConfirmation ref="confirmModal" @confirm-action="submit" :text="confirmText" />
    <ModalSuccess ref="successModal" :on-close="onClose" />
    <ModalError ref="errorModal" :text="errorText" :code="statusCode" />
    <div v-show="loading">
      <LoadingSpinner />
    </div>
    <div v-show="!loading">
      <form novalidate @submit.prevent="onSubmit" class="flex z-10">
        <div
          class="flex gap-4 overflow-auto bg-white sticky top-12 left-0 h-[calc(100vh-3.5rem)]"
          :class="isSidebarVisible ? 'p-4' : 'px-3 py-4'"
        >
          <Transition name="slide">
            <div
              v-show="isSidebarVisible"
              class="flex flex-col justify-between overflow-visible gap-4"
            >
              <div class="flex flex-col gap-4">
                <div class="font-semibold text-lg">{{ form.isNew ? 'Create' : 'Update' }} exam</div>
                <div class="flex items-center gap-2">
                  <label for="type" class="w-40 rounded-full border border-gray-400 px-4 py-2"
                    >Type</label
                  >
                  <select
                    id="type"
                    v-model="form.type"
                    class="border-b px-2 w-50 flex-1 focus:outline-1"
                  >
                    <option
                      v-for="option in examTypeOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
                <div class="flex items-center gap-2">
                  <label for="start-date" class="w-40 rounded-full border border-gray-400 px-4 py-2"
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
                    class="flex border border-red-800 text-red-600 rounded-md px-4 py-2"
                  >
                    {{ errors.get('start-date') }}
                  </div>
                </Transition>
                <div class="flex items-center gap-2">
                  <label for="end-date" class="w-40 rounded-full border border-gray-400 px-4 py-2"
                    >End date</label
                  >
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
                    class="flex border border-red-800 text-red-600 rounded-md px-4 py-2"
                  >
                    {{ errors.get('end-date') }}
                  </div>
                </Transition>
                <div class="flex items-center gap-2">
                  <label for="end-date" class="w-40 rounded-full border border-gray-400 px-4 py-2"
                    >Passing grade</label
                  >
                  <input
                    type="number"
                    max="100"
                    min="0"
                    v-model.number="form.passingGrade"
                    class="border-b flex flex-1 px-4 focus:outline-1"
                  />
                </div>
                <Transition name="fade">
                  <div
                    v-if="errors.get('passing-grade')"
                    class="flex border border-red-800 text-red-600 rounded-md px-4 py-2"
                  >
                    {{ errors.get('passing-grade') }}
                  </div>
                </Transition>
                <div
                  class="flex border border-gray-400 rounded-full w-full px-4 py-2 justify-between"
                >
                  <div>
                    <div>Add new question</div>
                  </div>
                  <div class="flex justify-center items-center" @click="createQuestion">
                    <div
                      title="create new question"
                      class="p-1 rounded-full material-symbols-outlined cursor-pointer border border-gray-500 small-icon hover:text-black hover:border-gray-800 hover:bg-gray-100 transition-colors duration-300"
                    >
                      add
                    </div>
                  </div>
                </div>
                <Transition name="fade">
                  <div
                    v-if="instantErrors.get('create-question')"
                    class="flex border border-red-800 text-red-600 rounded-md px-4 py-2"
                  >
                    {{ instantErrors.get('create-question') }}
                  </div>
                </Transition>
                <div
                  class="flex border border-gray-400 rounded-full w-full px-4 py-2 justify-between"
                >
                  <div>
                    <div>Jump to question no.</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <input
                      type="number"
                      class="bg-white rounded-full w-20 px-4 border border-gray-400 focus:outline-1 focus:outline-gray-400"
                      placeholder="0"
                      v-model.number="jumpInput"
                    />
                    <div class="flex justify-center items-center" @click="scrollToQuestion">
                      <div
                        title="create new question"
                        class="p-1 rounded-full material-symbols-outlined cursor-pointer border border-gray-500 small-icon hover:text-black hover:border-gray-800 hover:bg-gray-100 transition-colors duration-300"
                      >
                        arrow_forward
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Transition name="fade">
                  <div
                    v-if="instantErrors.get('jump-input')"
                    class="flex border border-red-800 text-red-600 rounded-md px-4 py-2"
                  >
                    {{ instantErrors.get('jump-input') }}
                  </div>
                </Transition>
                <div class="flex flex-col gap-4">
                  <Transition name="fade">
                    <div
                      v-if="errors.get('overall')"
                      class="flex border border-red-800 text-red-600 rounded-md px-4 py-2"
                    >
                      {{ errors.get('overall') }}
                    </div>
                  </Transition>
                  <ButtonYellow class="font-semibold" type="submit" :is-border="false">
                    submit
                  </ButtonYellow>
                </div>
              </div>
            </div>
          </Transition>
          <ButtonYellow
            @click="isSidebarVisible = !isSidebarVisible"
            :is-border="false"
            class="p-1! border-none!"
            type="button"
          >
            <div class="material-symbols-outlined">
              {{ isSidebarVisible ? 'keyboard_double_arrow_left' : 'keyboard_double_arrow_right' }}
            </div>
          </ButtonYellow>
        </div>
        <div class="flex-1 flex gap-4 p-6 rounded-md">
          <div class="flex flex-col p-6 items-start w-full bg-white">
            <div
              v-if="errors.get('questions')"
              class="flex border border-red-800 text-red-600 rounded-md px-4 py-2"
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
import { ref, onMounted, reactive, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import type {
  FormUpsertAnswer,
  FormUpsertExam,
  FormUpsertQuestion,
  UpsertPrefill,
} from '@/types/formTypes.ts'
import { ExamType } from '../types/enums.ts'
import UpsertQuestion from '@/components/UpsertQuestion.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ModalConfirmation from '@/components/ModalConfirmation.vue'
import ModalSuccess from '@/components/ModalSuccess.vue'
import ModalError from '@/components/ModalError.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { v6 as uuidv6 } from 'uuid'
import { handleError } from '@/utils/error.ts'
import router from '@/router/index.ts'
import { useAuthStore } from '@/stores/auth.ts'
import type { HttpResponse } from '@/types/types.ts'
import ButtonYellow from '@/components/buttons/ButtonYellow.vue'

const route = useRoute()
const examId = route.query.examId
const courseTeacherId = route.params.courseTeacherId
const loading = ref(false)
const isSidebarVisible = ref(true)
const form = reactive<FormUpsertExam>({
  examId: '',
  courseTeacherId: '',
  type: 'QUIZ',
  startDate: '',
  endDate: '',
  passingGrade: 0,
  questions: [],
  isNew: examId == null || examId == undefined,
  formDelete: [],
})

onMounted(() => {
  try {
    const authStore = useAuthStore()
    authStore.ensureToken()
    if (typeof courseTeacherId != 'string') throw new Error('Missing required URL param')
    if (typeof examId == 'string') prefill()
    if (typeof examId != 'string' && form.questions.length == 0) createQuestion()
  } catch (err) {
    if (err instanceof Error) handleError(err, errorModal, statusCode)
  }
})

onUnmounted(() => {
  clearTimeout(errorTimeout)
})

const confirmModal = ref<InstanceType<typeof ModalConfirmation> | null>(null)
const successModal = ref<InstanceType<typeof ModalSuccess> | null>(null)
const errorModal = ref<InstanceType<typeof ModalError> | null>(null)
const confirmText = ref('Do you really want to submit this data?')
const statusCode = ref('')
const errorText = ref('')
const prefill = async () => {
  try {
    loading.value = true
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const res = (await (
      await fetch(`exam/data?examId=${examId}&timezone=${timezone}`)
    ).json()) as unknown as HttpResponse<UpsertPrefill[] | string>
    if (res != null) {
      const data = res.data as unknown as UpsertPrefill
      form.examId = data.examId
      form.courseTeacherId = data.courseTeacherId
      form.type = data.type
      form.startDate = data.startDate
      form.endDate = data.endDate
      form.passingGrade = data.passingGrade
      data.questions.forEach((dataQuestion) => {
        const answers: FormUpsertAnswer[] = []
        dataQuestion.answers.forEach((dataAnswer) => {
          const answer: FormUpsertAnswer = {
            answerId: dataAnswer.answerId,
            text: dataAnswer.answerText,
            isCorrect: dataAnswer.isCorrect,
            isNew: false,
          }
          answers.push(answer)
        })
        const question: FormUpsertQuestion = {
          questionId: dataQuestion.questionId,
          text: dataQuestion.questionText,
          answers: answers,
          isNew: false,
        }
        form.questions.push(question)
      })
      form.isNew = false
    }
  } catch (err) {
    if (err instanceof Error) handleError(err, errorModal, statusCode)
  } finally {
    loading.value = false
  }
}

const onSubmit = () => {
  const errorsResult = validate(form)
  errors.value = errorsResult
  if (errors.value.size == 0) {
    confirmModal.value?.open()
  }
}

const submit = async () => {
  try {
    loading.value = true
    normalize()
    const res = await fetch('exam', { method: 'POST', body: JSON.stringify(form) })
    const data = (await res.json()) as unknown as HttpResponse<string | null>

    if (data.isError) throw new Error(data.message)
    else successModal.value?.open()
  } catch (err) {
    if (err instanceof Error) handleError(err, errorModal, statusCode)
  } finally {
    loading.value = false
  }
}

const onClose = async () => {
  if (typeof examId == 'string') {
    form.questions = []
    await prefill()
  } else router.push({ name: 'HomeView' })
}

const errors = ref(new Map<string, string>())
const instantErrors = ref(new Map<string, string>())
const validate = (data: FormUpsertExam): Map<string, string> => {
  errors.value.clear()
  const output = new Map<string, string>()
  const startDateValid = data.startDate != ''
  const endDateValid = data.startDate != ''
  if (!startDateValid) output.set('start-date', 'Start date must be filled')
  if (!endDateValid) output.set('end-date', 'End date must be filled')
  if (startDateValid && new Date(data.startDate) < new Date())
    output.set('start-date', 'Start date/time must be in the future')
  if (startDateValid && endDateValid && data.startDate > data.endDate)
    output.set('end-date', 'Exam start date must not end be greater than end date')
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

const normalize = async () => {
  form.courseTeacherId = String(courseTeacherId)
  if (!form.isNew) form.examId = String(examId)
  form.startDate = new Date(form.startDate).toISOString()
  form.endDate = new Date(form.endDate).toISOString()
}

const maxQuestion = +import.meta.env.VITE_MAX_QUESTION
const createQuestion = () => {
  instantErrors.value.clear()

  if (form.questions.length < maxQuestion) {
    form.questions.push({
      questionId: uuidv6(),
      text: '',
      answers: [],
      isNew: true,
    })
  } else {
    instantErrors.value.set('create-question', 'Max questions (' + maxQuestion + ') reached')
    clearTimeout(errorTimeout)
    errorTimeout = setTimeout(() => {
      instantErrors.value.delete('create-question')
    }, envErrorTimeout)
  }
}

const updateQuestion = (data: { questionId: string; field: string; value: string }) => {
  const question = form.questions.find((question) => question.questionId == data.questionId)
  if (question) {
    switch (data.field) {
      case 'text':
        question.text = data.value
        break
    }
  }
}

const deleteQuestion = (questionId: string) => {
  if (form.questions.find((question) => question.questionId === questionId)) {
    const index = form.questions.findIndex((q) => q.questionId === questionId)
    if (index !== -1) {
      if (!form.questions[index].isNew)
        form.formDelete.push({ entityId: questionId, type: 'QUESTION' })
      form.questions.splice(index, 1)
    }
  }
}

const maxAnswer = +import.meta.env.VITE_MAX_ANSWER
const createAnswer = (questionId: string) => {
  const index = form.questions.findIndex((q) => q.questionId == questionId)
  if (form.questions[index] && form.questions[index].answers.length < maxAnswer) {
    const answer: FormUpsertAnswer = {
      answerId: uuidv6(),
      text: '',
      isCorrect: false,
      isNew: true,
    }
    form.questions[index].answers.push(answer)
  }
}

const updateAnswer = (data: {
  questionId: string
  answerId: string
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

const deleteAnswer = (data: { questionId: string; answerId: string }) => {
  const questionIndex = form.questions.findIndex((q) => q.questionId === data.questionId)
  if (form.questions[questionIndex]) {
    const answerIndex = form.questions[questionIndex].answers.findIndex(
      (answer) => answer.answerId === data.answerId,
    )
    if (answerIndex !== -1) {
      if (!form.questions[questionIndex].answers[answerIndex].isNew)
        form.formDelete.push({ entityId: data.answerId, type: 'ANSWER' })
      form.questions[questionIndex].answers.splice(answerIndex, 1)
    }
  }
}

const examTypeOptions = Object.entries(ExamType).map(([key, value]) => ({
  value: key,
  label: value,
}))

const jumpInput = ref(0)
let errorTimeout = 0
const envErrorTimeout = +import.meta.env.VITE_VALIDATION_ERROR_TIMEOUT

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
    clearTimeout(errorTimeout)
    errorTimeout = setTimeout(() => {
      instantErrors.value.delete('jump-input')
    }, envErrorTimeout)
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
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

/* below are date picker styling */
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
