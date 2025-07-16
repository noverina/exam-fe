<template>
  <main class="cursor-auto text-sm text-gray-800">
    <ModalSuccess ref="successModal" :on-close="onClose" />
    <ModalConfirmation ref="confirmModal" @confirm-action="submit" :text="confirmText" />
    <ModalError ref="errorModal" :text="errorText" :code="statusCode" />
    <div v-show="loading">
      <LoadingSpinner />
    </div>
    <div v-show="!loading">
      <div
        v-if="saving"
        class="fixed inset right-5 bottom-5 py-2 px-8 shadow border border-gray-200 bg-white rounded-full saving z-41 opacity-80"
      >
        saving
      </div>
      <div v-if="examData && examData.questions.length > 0" class="flex">
        <div class="flex-1 m-5 bg-white p-6 rounded-md">
          <div
            class="flex justify-between px-4 py-2 sticky top-12 h-10 bg-white w-full font-semibold"
          >
            <div>{{ examData.courseName }} - {{ examData.examType }}</div>
            <div v-if="remainingTime.seconds > 0" class="flex gap-2 items-center">
              <div>Time remaining</div>
              <div :class="{ 'text-red-500': remainingTime.hours < 1 }">
                {{ remainingTime.hours }} hours {{ remainingTime.minutes }} minutes
                {{ remainingTime.seconds }} seconds
              </div>
            </div>
            <div v-else class="flex gap-2 items-center">
              <div>Grade:</div>
              <div v-if="examData.isGraded && examData.grade">{{ examData.grade }}</div>
              <div v-if="examData.isGraded && !examData.grade">0</div>
            </div>
          </div>
          <ExamQuestion
            v-for="(question, index) in examData.questions"
            :id="`question-${question.questionId}`"
            :key="question.questionId"
            :index="index"
            :can-change-answer="!examData.isFinal && new Date(examData.endDate) > new Date()"
            :question="question"
            class="scroll-mt-29"
            @answer-question="answerQuestion"
          ></ExamQuestion>
        </div>
        <ExamSheet
          :can-change-answer="!examData.isFinal && new Date(examData.endDate) > new Date()"
          :questions="examData.questions"
          :answered-questions="answeredQuestions"
          @on-save="save"
          @on-submit="onSubmit"
          z-40
        ></ExamSheet>
      </div>
      <div v-else><NoDataFound /></div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import type { ExamDetail, HttpResponse } from '../types/types.ts'
import ExamQuestion from '../components/ExamQuestion.vue'
import ExamSheet from '../components/ExamSheet.vue'
import ModalConfirmation from '@/components/ModalConfirmation.vue'
import ModalError from '@/components/ModalError.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import NoDataFound from '@/components/NoDataFound.vue'
import type { FormSubmitExam } from '@/types/formTypes.ts'
import { ExamType } from '@/types/enums.ts'
import { pinia } from '@/pinia'
import { useAuthStore } from '@/stores/auth.ts'
import { handleError } from '@/utils/error.ts'
import ModalSuccess from '@/components/ModalSuccess.vue'
import { originalFetch } from '@/main'

const route = useRoute()
const examId = route.params.id
const examData = ref<ExamDetail>()
const form = ref<FormSubmitExam>({
  examId: '',
  studentId: '',
  isFinal: false,
  choices: [],
})
const loading = ref(false)
const authStore = useAuthStore(pinia)

let intervalId: number
const studentId = route.query.studentId ? route.query.studentId : authStore.user?.id
const errorModal = ref<InstanceType<typeof ModalError> | null>(null)
const errorText = ref('')
const statusCode = ref('')

onMounted(async () => {
  loading.value = true
  try {
    await authStore.ensureToken(originalFetch)
    if (typeof examId !== 'string') throw new Error('Missing required URL param')
    await populate()
    calculateTimeLeft()
    intervalId = setInterval(calculateTimeLeft, 1000)
  } catch (err) {
    if (err instanceof Error) handleError(err, errorModal, statusCode)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  clearInterval(intervalId)
})

const populate = async () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const res = await fetch(
    `exam/answer/data?examId=${examId}&studentId=${studentId}&timezone=${timezone}`,
  )
  const resJson = (await res.json()) as unknown as HttpResponse<ExamDetail>
  const data = resJson.data
  data.examType = ExamType[data.examType as unknown as keyof typeof ExamType]
  examData.value = data
  // populate the answered/unanswered indicator
  for (const question of data.questions) {
    answeredQuestions.value.set(question.questionId, question.selectedAnswerId)
  }
}

const answeredQuestions = ref<Map<string, string>>(new Map())
const answerQuestion = (data: { questionId: string; answerId: string }) => {
  answeredQuestions.value.set(data.questionId, data.answerId)
}

const saving = ref(false)
const save = async () => {
  saving.value = true
  try {
    form.value.examId = String(examId)
    form.value.studentId = String(studentId)
    form.value.isFinal = false
    form.value.choices = Array.from(answeredQuestions.value, ([key, value]) => ({
      questionId: key,
      answerId: value,
    }))
    const [res, _delay] = await Promise.all([
      (await fetch('exam/answer', {
        method: 'POST',
        body: JSON.stringify(form.value),
      })) as unknown as HttpResponse<null>,
      new Promise((res) => setTimeout(res, 2000)),
    ])
    if (res.isError) throw new Error(res.message)
  } catch (err) {
    if (err instanceof Error) handleError(err, errorModal, statusCode)
  } finally {
    saving.value = false
  }
}

const confirmText = ref('')
const confirmModal = ref<InstanceType<typeof ModalConfirmation> | null>(null)
const onSubmit = () => {
  if (
    answeredQuestions.value.size != examData.value!.questions.length ||
    Array.from(answeredQuestions.value.values()).some((value) => value === null)
  ) {
    confirmText.value =
      'You still have unanswered questions! Do you really want to finalize your answers?'
  } else {
    confirmText.value = 'Do you really want to finalize your answers?'
  }
  confirmModal.value?.open()
}

const onClose = async () => {
  await populate()
}

const successModal = ref<InstanceType<typeof ModalSuccess> | null>(null)
const submit = async () => {
  try {
    loading.value = true
    form.value.examId = String(examId)
    form.value.studentId = String(studentId)
    form.value.isFinal = true
    form.value.choices = Array.from(answeredQuestions.value, ([key, value]) => ({
      questionId: key,
      answerId: value,
    }))
    const res = (await fetch('exam/answer', {
      method: 'POST',
      body: JSON.stringify(form.value),
    })) as unknown as HttpResponse<string | null>
    if (res.isError) throw new Error(res.message)
    else successModal.value?.open()
  } catch (err) {
    if (err instanceof Error) handleError(err, errorModal, statusCode)
  } finally {
    loading.value = false
  }
}

const remainingTime = ref({
  hours: 0,
  minutes: 0,
  seconds: 0,
})

const calculateTimeLeft = () => {
  const now = new Date().getTime()
  const timeRemaining = new Date(examData.value!.endDate).getTime() - now

  if (timeRemaining < 0) {
    clearInterval(intervalId)
    remainingTime.value = { hours: 0, minutes: 0, seconds: 0 }
    return
  }

  remainingTime.value.hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  remainingTime.value.minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
  remainingTime.value.seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)
}
</script>

<style scoped>
.saving::after {
  content: '';
  animation: dots 1s steps(4, end) infinite;
}

@keyframes dots {
  0% {
    content: '';
  }
  25% {
    content: '.';
  }
  50% {
    content: '..';
  }
  75% {
    content: '...';
  }
  100% {
    content: '';
  }
}
</style>
