<template>
  <div class="bg-white text-sm rounded-t border border-gray-400">
    <div
      class="flex justify-between items-end w-full gap-4 px-4 py-3 rounded-t"
      :class="{
        'bg-red-200': isOngoingAndNotSubmitted && role == 'STUDENT',
        'border-b border-gray-600': isContentVisible,
      }"
    >
      <div>
        <div class="font-semibold">{{ course.courseName }}</div>
        <div>Teacher: {{ course.teacherName }}</div>
      </div>
      <div class="flex">
        <div
          v-if="role == 'TEACHER'"
          class="material-symbols-outlined cursor-pointer"
          @click="toUpsertView()"
        >
          add
        </div>
        <div
          v-if="isOngoingAndNotSubmitted && role == 'STUDENT'"
          class="material-symbols-outlined text-red-600"
          title="There exist ongoing exam with unsubmitted answers"
        >
          exclamation
        </div>
        <button
          class="material-symbols-outlined cursor-pointer"
          @click="toggleContent"
          :aria-pressed="isContentVisible"
        >
          {{ isContentVisible ? 'arrow_drop_up' : 'arrow_drop_down' }}
        </button>
      </div>
    </div>

    <Transition @enter="enter" @after-enter="afterEnter" @leave="leave">
      <div v-if="isContentVisible">
        <div v-if="course.exams.length > 0">
          <CardExam
            v-for="exam in course.exams"
            :key="exam.examId"
            :exam="exam"
            :course-teacher-id="course.courseTeacherId"
            @grade="grade"
          />
        </div>
        <div v-else class="px-4 py-2 m-2 border text-gray-400 rounded-md">No data found</div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Course } from '@/types/types.ts'
import CardExam from '@/components/CardExam.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

interface Props {
  course: Course
  isExpanded: boolean
}
const props = defineProps<Props>()

const router = useRouter()

const toUpsertView = () => {
  router.push({
    name: 'UpsertView',
    params: { courseTeacherId: props.course.courseTeacherId },
  })
}

// const emit = defineEmits<{
//   'update-expanded': [isContentVisible: boolean]
//   grade: []
// }>()

const emit = defineEmits<{
  'update-expanded': [isContentVisible: boolean]
  grade: [examId: string]
}>()

const isContentVisible = ref(props.isExpanded)

const toggleContent = () => {
  isContentVisible.value = !isContentVisible.value
  emit('update-expanded', isContentVisible.value)
}

const grade = (examId: string) => {
  emit('grade', examId)
}

watch(
  () => props.isExpanded,
  (newVal) => {
    isContentVisible.value = newVal
  },
)

const authStore = useAuthStore()
const role = authStore.role

const isOngoingAndNotSubmitted = computed(() => {
  const now = new Date()
  return props.course.exams.some((exam) => {
    const startDate = new Date(exam.startDate)
    const endDate = new Date(exam.endDate)
    return now > startDate && now < endDate && exam.submitDate === null
  })
})

function enter(e: Element) {
  const element = e as HTMLElement
  element.style.maxHeight = '0'
  element.style.overflow = 'hidden'
  requestAnimationFrame(() => {
    element.style.transition = 'max-height 0.2s ease-in-out'
    element.style.maxHeight = `${element.scrollHeight}px`
  })
}

function afterEnter(e: Element) {
  const element = e as HTMLElement
  element.style.maxHeight = ''
  element.style.overflow = ''
}

function leave(e: Element) {
  const element = e as HTMLElement
  element.style.maxHeight = `${element.scrollHeight}px`
  element.style.overflow = 'hidden'
  requestAnimationFrame(() => {
    element.style.transition = 'max-height 0.2s ease-in-out'
    element.style.maxHeight = '0'
  })
}
</script>
