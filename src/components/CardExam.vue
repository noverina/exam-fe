<template>
  <div
    class="m-2 p-2 border border-gray-400 rounded-md transition-colors duration-300"
    :class="{
      'border-green-400! hover:border-green-600!':
        role == 'STUDENT' && isPassed && examStatus == 'FINISH',
      'border-red-400! hover:border-red-600!':
        role == 'STUDENT' && !isPassed && examStatus == 'FINISH',
      'cursor-pointer':
        (role == 'STUDENT' && examStatus != 'UPCOMING') ||
        (role == 'TEACHER' && examStatus == 'FINISH' && exam.isGraded),
      'hover:border-gray-600!': role == 'TEACHER' && exam.isGraded && examStatus == 'FINISH',
    }"
  >
    <div
      class="flex justify-between items-center"
      @click="
        role == 'STUDENT' && examStatus != 'UPCOMING'
          ? toExamView(exam.examId)
          : examStatus == 'FINISH' && role == 'TEACHER' && exam.isGraded
            ? toGradeView()
            : null
      "
    >
      <div>{{ typeText }}</div>

      <div class="flex flex-col gap-1 items-end">
        <div class="flex gap-2 justify-end items-center">
          <!-- student role -->
          <span
            v-if="examStatus == 'ONGOING' && role == 'STUDENT' && !exam.submitDate"
            class="material-symbols-outlined small-icon text-red-500"
            >exclamation
          </span>
          <span
            class="text-xs font-semibold px-2 rounded-sm text-white"
            :class="{
              'bg-red-400': examStatus == 'ONGOING',
              'bg-green-400': examStatus == 'FINISH',
              'bg-amber-400': examStatus == 'UPCOMING',
            }"
            >{{ examStatus }}</span
          >
          <span
            class="material-symbols-outlined small-icon"
            :class="{ spin: examStatus == 'ONGOING' }"
            >{{ examIcon }}
          </span>
        </div>
        <div>
          <div v-if="examStatus == 'UPCOMING'" class="text-xs">
            {{
              startDate.toLocaleString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            }}
          </div>
          <div v-if="examStatus == 'ONGOING'" class="text-xs">{{ timeLeft }}</div>
          <div class="flex gap-4 justify-end" v-if="examStatus == 'FINISH' && role == 'STUDENT'">
            <span
              class="text-xs px-2 rounded-sm border"
              :class="[isPassed ? 'border-green-400' : 'border-red-400']"
              >{{ isPassed ? 'PASS' : 'FAIL' }}</span
            >
            <span class="text-xs">{{ exam.grade ? exam.grade : 0 }}</span>
          </div>
        </div>
        <div class="w-auto flex flex-col gap-1">
          <!-- teacher role -->
          <div>
            <div v-if="examStatus == 'FINISH' && role == 'TEACHER'" class="text-xs flex flex-col">
              <span>
                {{ startDate.toLocaleDateString() }} - {{ endDate.toLocaleDateString() }}</span
              >
            </div>
          </div>
          <div
            class="cursor-pointer flex gap-2 items-center justify-end border border-gray-400 px-2 rounded-sm"
            @click="emit('grade', exam.examId)"
            v-if="examStatus == 'FINISH' && role == 'TEACHER' && !exam.isGraded"
          >
            <span class="font-semibold text-xs">GRADE</span>
            <span class="material-symbols-outlined small-icon">task_alt </span>
          </div>
          <div
            class="w-auto cursor-pointer flex px-2 gap-2 items-center justify-end border border-gray-400 rounded-sm"
            @click="toUpsertView()"
            v-if="examStatus == 'UPCOMING' && role == 'TEACHER'"
          >
            <span class="font-semibold text-xs">EDIT</span>
            <span class="material-symbols-outlined small-icon">edit </span>
          </div>
        </div>
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

const toGradeView = () => {
  router.push({
    name: 'GradeView',
    params: { examId: props.exam.examId, courseTeacherId: props.courseTeacherId },
  })
}

const authStore = useAuthStore()
const role = authStore.user?.role

const hasTaken = props.exam.grade !== null
const isPassed = hasTaken && props.exam.grade! >= props.exam.passingGrade
const startDate = new Date(props.exam.startDate)
const endDate = new Date(props.exam.endDate)
const examStatus = ref<'ONGOING' | 'FINISH' | 'UPCOMING'>('ONGOING')
const typeText = ExamType[props.exam.type as unknown as keyof typeof ExamType]
const examIcon = ref<string>()

const emit = defineEmits<{ grade: [id: string] }>()

const now = new Date()
if (now > startDate && now < endDate) {
  examStatus.value = 'ONGOING'
  examIcon.value = 'timer'
} else if (now < startDate) {
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
  animation: spinPause 1.5s infinite;
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
