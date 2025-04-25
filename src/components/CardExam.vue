<template>
  <div
    class="m-2 p-2 border"
    :class="{
      'bg-green-200': role == 'STUDENT' && isPassed && examStatus == 'FINISH',
      'bg-red-200': role == 'STUDENT' && !isPassed && examStatus == 'FINISH',
      'cursor-pointer': role == 'STUDENT',
    }"
  >
    <div class="flex justify-between items-center" @click="role == 'STUDENT' && toExamView(examId)">
      <div>{{ typeText }}</div>

      <div class="flex flex-col gap-2">
        <div class="flex gap-2 justify-end items-center">
          <span
            v-if="examStatus != 'UPCOMING' && role == 'STUDENT'"
            class="text-xs"
            :class="{ 'material-symbols-outlined small-icon': grade == null }"
            >{{ grade != null ? grade : hasSubmitted ? 'check' : 'close' }}</span
          >
          <span
            v-if="examStatus == 'UPCOMING' && role == 'TEACHER'"
            class="material-symbols-outlined small-icon cursor-pointer"
            @click="toUpsertView(courseTeacherId, examId)"
            >edit</span
          >
          <span
            class="material-symbols-outlined small-icon"
            :class="{ spin: examStatus == 'ONGOING' }"
            >{{ examIcon }}</span
          >
        </div>
        <span v-if="examStatus == 'UPCOMING'" class="text-xs">{{
          startDate.toLocaleString()
        }}</span>
        <span v-if="examStatus == 'ONGOING'" class="text-xs">{{ timeLeft }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ExamType } from '@/types/enums'
defineOptions({
  name: 'CardExam',
})

interface Props {
  examId: number
  courseTeacherId: number
  type: ExamType
  grade: number | null
  passingGrade: number
  startDate: string
  endDate: string
  submitDate: string | null
}
const props = defineProps<Props>()

const router = useRouter()

const toExamView = (id: number) => {
  router.push({ name: 'ExamView', params: { id } })
}

const toUpsertView = (courseTeacherId: number, examId?: number) => {
  if (examId) {
    router.push({
      name: 'UpsertView',
      params: { courseTeacherId: courseTeacherId },
      query: { examId: examId },
    })
  } else {
    router.push({
      name: 'UpsertView',
      params: { courseTeacherId: courseTeacherId },
    })
  }
}

const authStore = useAuthStore()
const role = authStore.role

const hasTaken = computed(() => props.grade !== null)
const hasSubmitted = computed(() => props.submitDate !== null)
const isPassed = computed(() => hasTaken.value && props.grade! > props.passingGrade)
const startDate = computed(() => new Date(props.startDate))
const endDate = computed(() => new Date(props.endDate))
const examStatus = ref<'ONGOING' | 'FINISH' | 'UPCOMING'>('ONGOING')
const typeText = computed(() => ExamType[props.type as unknown as keyof typeof ExamType])
const examIcon = ref<string>()

const now = new Date()
if (now > startDate.value && now < endDate.value) {
  examStatus.value = 'ONGOING'
  examIcon.value = 'timer'
} else if (now < startDate.value) {
  examStatus.value = 'UPCOMING'
  examIcon.value = 'calendar_clock'
} else {
  examStatus.value = 'FINISH'
  examIcon.value = 'timer_off'
}

const timeLeft = ref<string>('')
let timer: number

const updateCountdown = (): void => {
  const parsedEnd = computed(() => new Date(props.endDate))
  const difference = parsedEnd.value.getTime() - new Date().getTime()

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((difference / 1000 / 60) % 60)
    const seconds = Math.floor((difference / 1000) % 60)

    timeLeft.value = `${days}d ${hours}h ${minutes}m ${seconds}s`
  } else {
    timeLeft.value = ''
    clearInterval(timer)
  }
}

onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.small-icon {
  font-size: 0.75rem;
}

.spin {
  animation: spinPause 2s infinite;
}

@keyframes spinPause {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
