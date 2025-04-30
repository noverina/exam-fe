<template>
  <main class="cursor-auto text-sm text-gray-800">
    <div v-if="isLoading">
      <LoadingSpinner />
    </div>
    <div v-else>
      <!-- form submit confirmation -->
      <ModalConfirmation ref="confirmModal" @confirm-action="submit" :text="confirmText" />
      <div
        v-if="isSaving"
        class="fixed inset right-5 bottom-5 py-2 px-8 shadow bg-white rounded-full saving z-41"
        title="please don't close or refresh the page"
      >
        saving
      </div>
      <div v-if="examData && examData.questions.length > 0" class="flex">
        <div class="flex-1">
          <div
            class="flex justify-between px-4 py-2 sticky top-12 h-10 bg-white w-full font-semibold"
          >
            <div>{{ examData.courseName }} - {{ examData.examType }}</div>
            <div class="flex gap-2 items-center">
              <div>Time remaining:</div>
              <div :class="{ 'text-red-500': remainingTime.hours < 1 }">
                {{ remainingTime.hours }} hours {{ remainingTime.minutes }} minutes
                {{ remainingTime.seconds }} seconds
              </div>
            </div>
          </div>
          <ExamQuestion
            v-for="(question, index) in examData.questions"
            :id="`question-${question.questionId}`"
            :key="question.questionId"
            :index="index"
            :question="question"
            class="scroll-mt-24"
            @answer-question="answerQuestion"
          ></ExamQuestion>
        </div>
        <ExamSheet
          :questions="examData.questions"
          :answered-questions="answeredQuestions"
          @on-save="save"
          @on-submit="submit"
          z-40
        ></ExamSheet>
      </div>
      <div v-else class="p-4 m-4 border text-gray-400">No data found</div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { handleError } from '../utils/format.ts'
import type { ExamDetail } from '../types/types.ts'
import ExamQuestion from '../components/ExamQuestion.vue'
import ExamSheet from '../components/ExamSheet.vue'
import ModalConfirmation from '@/components/ModalConfirmation.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { FormSubmitExam } from '@/types/formTypes.ts'
import { fetchExamData, submitExam } from '@/utils/API/exam.ts'
import { ExamType } from '@/types/enums.ts'

const route = useRoute()
const examId = route.params.id
const examData = ref<ExamDetail>()
const form = ref<FormSubmitExam>({
  examId: 0,
  studentId: 0,
  isFinal: false,
  formSubmitSelected: [],
})

const isLoading = ref(false)

let intervalId: number
onMounted(async () => {
  try {
    isLoading.value = true
    if (typeof examId !== 'string') {
      throw new Error('Exam id undefined')
    }
    const res = await fetchExamData(examId)
    if (res != null) {
      const data = res.data as unknown as ExamDetail
      data.examType = ExamType[data.examType as unknown as keyof typeof ExamType]
      examData.value = data
    } else {
      throw Error('Fetched data is null')
    }

    calculateTimeLeft()
    intervalId = setInterval(calculateTimeLeft, 1000)
  } catch (err) {
    if (err instanceof Error) {
      handleError('Error fetching: ' + err.message)
    } else {
      handleError("Thrown error isn't an error: " + err)
    }
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  clearInterval(intervalId)
})

const answeredQuestions = ref<Map<number, number>>(new Map())
const answerQuestion = (data: { questionId: number; answerId: number }) => {
  answeredQuestions.value.set(data.questionId, data.answerId)
}

const confirmText = ref('')
const confirmModal = ref<InstanceType<typeof ModalConfirmation> | null>(null)
const isSaving = ref(false)
const save = async () => {
  try {
    isSaving.value = true
    form.value.examId = +examId
    form.value.studentId = 1 // TODO CHANGE THIS LATER
    form.value.isFinal = false
    form.value.formSubmitSelected = Array.from(answeredQuestions.value, ([key, value]) => ({
      questionId: key,
      selectedAnswerId: value,
    }))
    const res = await submitExam(form.value)
    if (res.isError) throw new Error(res.message)
  } catch (err) {
    if (err instanceof Error) {
      handleError('Error fetching: ' + err.message)
    } else {
      handleError("Thrown error isn't an error: " + err)
    }
  } finally {
    isSaving.value = false
  }
}

const submit = () => {
  if (answeredQuestions.value.size != examData.value!.questions.length) {
    confirmText.value =
      "You still have unanswered questions; you can't change your answers once submited"
  } else {
    confirmText.value = "Your answers will be finalized and can't be changed"
  }
  confirmModal.value?.open()
  form.value.examId = +examId
  form.value.studentId = 1 // TODO CHANGE THIS LATER
  form.value.isFinal = false
  form.value.formSubmitSelected = Array.from(answeredQuestions.value, ([key, value]) => ({
    questionId: key,
    selectedAnswerId: value,
  }))
  console.log(form.value)
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
