<template>
  <main class="cursor-auto text-sm text-gray-800">
    <ModalConfirmation ref="confirmModal" @confirm-action="submit" :text="confirmText" />
    <ModalError ref="errorModal" :text="errorText" :code="statusCode" />
    <div v-if="isLoading">
      <LoadingSpinner />
    </div>
    <div v-else>
      <div
        v-if="isSaving"
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
              <div>Time remaining:</div>
              <div :class="{ 'text-red-500': remainingTime.hours < 1 }">
                {{ remainingTime.hours }} hours {{ remainingTime.minutes }} minutes
                {{ remainingTime.seconds }} seconds
              </div>
            </div>
            <div v-else class="flex gap-2 items-center">
              <div>Grade:</div>
              <div>{{ examData.grade ? examData.grade : 'Pending' }}</div>
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
      <div v-else class="p-4 m-4 border text-gray-400 rounded-md bg-white">No data found</div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { logError } from '../utils/error.ts'
import type { ExamDetail } from '../types/types.ts'
import ExamQuestion from '../components/ExamQuestion.vue'
import ExamSheet from '../components/ExamSheet.vue'
import ModalConfirmation from '@/components/ModalConfirmation.vue'
import ModalError from '@/components/ModalError.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { FormSubmitExam } from '@/types/formTypes.ts'
import { fetchExamData, submitForm } from '@/utils/API/exam.ts'
import { ExamType } from '@/types/enums.ts'

const route = useRoute()
const examId = route.params.id
const examData = ref<ExamDetail>()
const form = ref<FormSubmitExam>({
  examId: '',
  studentId: '',
  isFinal: false,
  choices: [],
})
const isLoading = ref(false)

let intervalId: number
//TODO change it to get from authstore later
const studentId = '0196eca2-1646-7856-84b4-982aa268444a'
const errorModal = ref<InstanceType<typeof ModalError> | null>(null)
const errorText = ref('')
const statusCode = ref('')
onMounted(async () => {
  if (typeof examId !== 'string') throw new Error('Exam id is undefined')

  isLoading.value = true

  await fetchExamData(examId, studentId)
    .then((res) => {
      const data = res.data as unknown as ExamDetail
      data.examType = ExamType[data.examType as unknown as keyof typeof ExamType]
      examData.value = data
      // populate the answered/unanswered indicator
      for (const question of data.questions) {
        answeredQuestions.value.set(question.questionId, question.selectedAnswerId)
      }

      calculateTimeLeft()
      intervalId = setInterval(calculateTimeLeft, 1000)
    })
    .catch((err) => {
      if (err instanceof DOMException && err.name === 'AbortError') {
        nextTick()
        errorModal.value?.open()
        statusCode.value = 'E01A'
        logError(err)
      }
      if (err instanceof Error) {
        nextTick()
        errorModal.value?.open()
        statusCode.value = 'E01'
        logError(err)
      } else {
        nextTick()
        errorModal.value?.open()
      }
    })
    .finally(() => (isLoading.value = false))
})

onUnmounted(() => {
  clearInterval(intervalId)
})

const answeredQuestions = ref<Map<string, string>>(new Map())
const answerQuestion = (data: { questionId: string; answerId: string }) => {
  answeredQuestions.value.set(data.questionId, data.answerId)
}

const isSaving = ref(false)
const save = async () => {
  try {
    isSaving.value = true
    form.value.examId = String(examId)
    form.value.studentId = studentId
    form.value.isFinal = false
    form.value.choices = Array.from(answeredQuestions.value, ([key, value]) => ({
      questionId: key,
      answerId: value,
    }))
    console.log(form.value)
    const res = await submitForm(form.value)
    if (res.isError) throw new Error(res.message)
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      errorModal.value?.open()
      statusCode.value = 'E01A'
      logError(err)
    }
    if (err instanceof Error) {
      errorModal.value?.open()
      statusCode.value = 'E01'
      logError(err)
    } else {
      errorModal.value?.open()
    }
  } finally {
    isSaving.value = false
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
      "You still have unanswered questions; you can't change your answers once you submit"
  } else {
    confirmText.value = "You can't change your answers once you submit"
  }
  confirmModal.value?.open()
}

const submit = async () => {
  try {
    form.value.examId = String(examId)
    form.value.studentId = studentId
    form.value.isFinal = true
    form.value.choices = Array.from(answeredQuestions.value, ([key, value]) => ({
      questionId: key,
      answerId: value,
    }))
    const res = await submitForm(form.value)
    if (res.isError) throw new Error(res.message)
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      errorModal.value?.open()
      statusCode.value = 'E01A'
      logError(err)
    }
    if (err instanceof Error) {
      errorModal.value?.open()
      statusCode.value = 'E01'
      logError(err)
    } else {
      errorModal.value?.open()
    }
  } finally {
    window.location.reload()
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
