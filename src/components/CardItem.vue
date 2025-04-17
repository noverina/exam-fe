<template>
  <div class="bg-white text-sm rounded-t border">
    <div
      class="flex justify-between items-end w-full gap-4 px-4 py-3 rounded-t"
      :class="{
        'bg-red-200': isOngoingAndNotSubmitted && role == 'STUDENT',
        'border-b': isContentVisible,
      }"
    >
      <div>
        <div class="font-semibold">{{ course }}</div>
        <div>Teacher: {{ teacher }}</div>
      </div>
      <div class="flex">
        <div
          v-if="role == 'TEACHER'"
          class="material-symbols-outlined cursor-pointer"
          @click="toUpsertView"
        >
          add
        </div>
        <div
          v-if="isOngoingAndNotSubmitted && role == 'STUDENT'"
          class="material-symbols-outlined text-red-600"
          title="you have ongoing exam with unsubmitted answers"
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
        <div v-if="exams.length > 0">
          <CardExam
            v-for="exam in exams"
            :key="exam.examId"
            :exam-id="exam.examId"
            :course-teacher-id="courseTeacherId"
            :type="exam.type"
            :grade="exam.grade"
            :passing-grade="exam.passingGrade"
            :start-date="exam.startDate"
            :end-date="exam.endDate"
            :submit-date="exam.submitDate"
          />
        </div>
        <div v-else class="text-gray-400 px-4 py-2">No data found</div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Exam } from '@/types/types.ts'
import CardExam from '@/components/CardExam.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'CardItem',
})

interface Props {
  course: string
  teacher: string
  courseTeacherId: number
  isExpanded: boolean
  exams: Exam[]
}
const props = defineProps<Props>()

const router = useRouter()

const toUpsertView = () => {
  router.push({ name: 'UpsertView' })
}

const emit = defineEmits(['update:expanded'])

const isContentVisible = ref(props.isExpanded)

function toggleContent() {
  isContentVisible.value = !isContentVisible.value
  emit('update:expanded', isContentVisible.value)
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
  return props.exams.some((exam) => {
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
