<template>
  <main class="cursor-auto text-gray-800 text-sm">
    <ModalError ref="errorModal" :text="errorText" :code="statusCode" />
    <ModalConfirmation ref="confirmModal" @confirm-action="grade" :text="confirmText" />
    <div v-if="loading">
      <LoadingSpinner />
    </div>
    <div v-else>
      <div v-if="data.length > 0" class="flex flex-col gap-4 m-5 p-4 rounded-md bg-white">
        <div class="flex justify-end">
          <button
            @click="toggleAll"
            class="px-4 py-2 rounded-md cursor-pointer border border-gray-400 transition-colors duration-300 hover:bg-gray-100 hover:border-gray-700"
          >
            {{ anyExpanded ? 'Collapse All' : 'Expand All' }}
          </button>
        </div>

        <div class="flex flex-wrap items-start gap-4 p-2">
          <CardItem
            v-for="(course, index) in data"
            :key="index"
            :course="course"
            :is-expanded="anyComponentsExpanded[index]"
            @update-expanded="updateComponentExpandedArr(index, $event)"
            @grade="onGrade"
            class="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]"
          />
        </div>
      </div>
      <div v-else class="p-4 m-4 border text-gray-400 rounded-md bg-white">No data found</div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Course, CourseExam } from '@/types/types.ts'
import { fetchCourses } from '@/utils/API/course.ts'
import { logError } from '@/utils/error'
import CardItem from '@/components/CardItem.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ModalError from '@/components/ModalError.vue'
import ModalConfirmation from '@/components/ModalConfirmation.vue'

const data = ref<Course[]>([])
const loading = ref(true)

const examOrder: Record<string, number> = {
  QUIZ: 1,
  MID: 2,
  FINAL: 3,
}

const sortExams = (exams: CourseExam[]): CourseExam[] => {
  return exams.sort((a, b) => examOrder[a.type] - examOrder[b.type])
}

const errorModal = ref<InstanceType<typeof ModalError> | null>(null)
const errorText = ref('')
const statusCode = ref('')
//TODO change it to get from authstore later
const studentId = '0196eca2-1646-7856-84b4-982aa268444a'
onMounted(async () => {
  loading.value = true
  await fetchCourses(studentId)
    .then((res) => {
      const courses = res.data as Course[]

      for (const course of courses) {
        course.exams = sortExams(course.exams)
      }
      data.value = courses
      anyComponentsExpanded.value = data.value.map(() => false)
    })
    .catch((err) => {
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
    })
    .finally(() => {
      loading.value = false
    })
})

const anyComponentsExpanded = ref<boolean[]>([])
watch(data, (newData) => {
  anyComponentsExpanded.value = newData.map(() => false)
})

const anyExpanded = computed(() => anyComponentsExpanded.value.some((expanded) => expanded))
function toggleAll() {
  const newState = !anyExpanded.value
  anyComponentsExpanded.value.forEach((_, index) => {
    anyComponentsExpanded.value[index] = newState
  })
}

const updateComponentExpandedArr = (index: number, isExpanded: boolean) => {
  anyComponentsExpanded.value[index] = isExpanded
}

const confirmText = ref('')
const confirmModal = ref<InstanceType<typeof ModalConfirmation> | null>(null)
const onGrade = () => {
  confirmText.value = 'Do you really want to grade this exam?'
  confirmModal.value?.open()
}

const grade = async (examId: string) => {
  await grade(examId).catch((err) => {
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
  })
}
</script>
