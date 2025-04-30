<template>
  <main class="cursor-auto text-gray-800 text-sm">
    <div v-if="loading">
      <LoadingSpinner />
    </div>
    <div v-else>
      <div v-if="data.length > 0">
        <div class="flex justify-end">
          <button
            @click="toggleAll"
            class="px-8 py-2 m-4 rounded-full cursor-pointer bg-indigo-200 shadow font-semibold"
          >
            {{ anyExpanded ? 'Collapse All' : 'Expand All' }}
          </button>
        </div>

        <div class="flex flex-wrap items-start gap-4 p-2">
          <CardItem
            v-for="(course, index) in data"
            :key="index"
            :course="course.name"
            :teacher="course.teacherName"
            :course-teacher-id="course.courseTeacherId"
            :exams="course.exams"
            :is-expanded="anyComponentsExpanded[index]"
            @update-expanded="updateComponentExpandedArr(index, $event)"
            class="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]"
          />
        </div>
      </div>
      <div v-else class="p-4 m-4 border text-gray-400">No data found</div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Course, CourseExam, HttpResponse } from '@/types/types.ts'
import { fetchCourses } from '@/utils/API/course.ts'
import { handleError } from '@/utils/format.ts'
import CardItem from '@/components/CardItem.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const res = ref<HttpResponse<Course[] | string>>({ isError: false, message: '', data: [] })
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

onMounted(async () => {
  loading.value = true
  try {
    res.value = await fetchCourses()
    if (res.value != null) {
      const courses = res.value.data as Course[]
      for (const course of courses) {
        course.exams = sortExams(course.exams)
      }
      data.value = courses
      anyComponentsExpanded.value = data.value.map(() => false)
    }
  } catch (err) {
    if (err instanceof Error) {
      handleError('Error fetching: ' + err.message)
    } else {
      handleError("Thrown error isn't an error: " + err)
    }
  } finally {
    loading.value = false
  }
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
</script>
