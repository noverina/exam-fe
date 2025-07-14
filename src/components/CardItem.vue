<template>
  <div
    class="bg-white text-sm rounded-t border border-gray-400"
    :class="{
      'border-red-400!': anyExamNotUndertaken() && role == 'STUDENT',
    }"
  >
    <div
      class="flex justify-between items-end w-full gap-4 px-4 py-3 rounded-t"
      :class="{
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
          v-if="anyExamNotUndertaken() && role == 'STUDENT'"
          class="material-symbols-outlined text-red-600 zoom"
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

    <Transition name="slide">
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
        <div v-else><NoDataFound /></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Course } from '@/types/types.ts'
import CardExam from '@/components/CardExam.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import NoDataFound from './NoDataFound.vue'

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
const role = authStore.user?.role

const anyExamNotUndertaken = () => {
  const now = new Date()
  return props.course.exams.some((exam) => {
    const startDate = new Date(exam.startDate)
    const endDate = new Date(exam.endDate)
    return now > startDate && now < endDate && exam.submitDate === null
  })
}
</script>

<style scoped>
.zoom {
  animation: zoom 1.5s infinite;
}

@keyframes zoom {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
