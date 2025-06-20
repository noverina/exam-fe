<template>
  <div
    class="m-2 p-2 border border-gray-400 rounded-md"
    :class="{
      'bg-green-200': role == 'STUDENT' && isPassed && examStatus == 'FINISH',
      'bg-red-200': role == 'STUDENT' && !isPassed && examStatus == 'FINISH',
      'cursor-pointer': role == 'STUDENT',
    }"
  >
    <div
      class="flex justify-between items-center"
      @click="role == 'STUDENT' && toExamView(exam.examId)"
    >
      <div>{{ typeText }}</div>

      <div class="flex flex-col gap-2">
        <div class="flex gap-2 justify-end items-center">
          <!-- teacher role -->
          <span
            v-if="examStatus == 'FINISH' && role == 'TEACHER' && !exam.isGraded"
            class="material-symbols-outlined small-icon cursor-pointer"
            @click="emit('grade')"
            >task_alt
          </span>
          <span
            v-if="examStatus == 'FINISH' && role == 'TEACHER' && exam.isGraded"
            class="material-symbols-outlined small-icon cursor-pointer"
            @click="toUpsertView()"
            >menu
          </span>
          <span
            v-if="examStatus == 'UPCOMING' && role == 'TEACHER'"
            class="material-symbols-outlined small-icon cursor-pointer"
            @click="toUpsertView()"
            >edit
          </span>
          <!-- student role -->
          <span
            v-if="examStatus != 'UPCOMING' && role == 'STUDENT'"
            class="text-xs"
            :class="{ 'material-symbols-outlined small-icon': exam.grade == null }"
            >{{ exam.grade != null ? exam.grade : hasSubmitted ? 'check' : 'close' }}
          </span>
          <span
            class="material-symbols-outlined small-icon"
            :class="{ spin: examStatus == 'ONGOING' }"
            >{{ examIcon }}
          </span>
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
import type { CourseExam } from '@/types/types'

interface Props {
  exam: CourseExam
  courseTeacherId: string
}
const props = defineProps<Props>()

const router = useRouter()

const toExamView = (id: string) => {
  router.push({ name: 'ExamView', params: { id } })
}

const toUpsertView = () => {
  if (props.exam.examId) {
    router.push({
      name: 'UpsertView',
      params: { courseTeacherId: props.courseTeacherId },
      query: { examId: props.exam.examId },
    })
  } else {
    router.push({
      name: 'UpsertView',
      params: { courseTeacherId: props.courseTeacherId },
    })
  }
}

const authStore = useAuthStore()
const role = authStore.role

const hasTaken = computed(() => props.exam.grade !== null)
const hasSubmitted = computed(() => props.exam.submitDate !== null)
const isPassed = computed(() => hasTaken.value && props.exam.grade! > props.exam.passingGrade)
const startDate = computed(() => new Date(props.exam.startDate))
const endDate = computed(() => new Date(props.exam.endDate))
const examStatus = ref<'ONGOING' | 'FINISH' | 'UPCOMING'>('ONGOING')
const typeText = computed(() => ExamType[props.exam.type as unknown as keyof typeof ExamType])
const examIcon = ref<string>()

const emit = defineEmits(['grade'])

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
  const parsedEnd = computed(() => new Date(props.exam.endDate))
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
