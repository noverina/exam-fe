<template>
  <main class="cursor-auto text-gray-800 text-sm">
    <ModalError ref="errorModal" :text="errorText" :code="statusCode" />
    <ModalConfirmation ref="confirmModal" @confirm-action="grade" :text="confirmText" />
    <ModalSuccess ref="successModal" :on-close="populate" />
    <div v-show="loading">
      <LoadingSpinner />
    </div>
    <div v-show="!loading">
      <div v-if="data.length > 0" class="flex flex-col gap-4 m-5 p-4 rounded-md bg-white">
        <div class="flex justify-end gap-4">
          <div class="flex gap-4 items-center">
            <label>Show</label>
            <select
              class="focus:outline-none focus:ring-0 focus:shadow-none border border-gray-400 rounded-sm px-2 py-1"
              v-model="statusFilter"
            >
              <option value="all">All</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="FINISH">Finish</option>
            </select>
            <select
              class="focus:outline-none focus:ring-0 focus:shadow-none border border-gray-400 rounded-sm px-2 py-1"
              v-model="passFilter"
            >
              <option value="all">All</option>
              <option value="true">Pass</option>
              <option value="false">Fail</option>
            </select>
          </div>

          <ButtonBase @click="toggleAll">
            {{ anyExpanded ? 'Collapse All' : 'Expand All' }}
          </ButtonBase>
        </div>
        <div v-if="filteredData.length > 0" class="flex flex-wrap items-start gap-4 p-2">
          <CardItem
            v-for="(course, index) in filteredData"
            :key="index"
            :course="course"
            :is-expanded="anyComponentsExpanded[index]"
            @update-expanded="updateComponentExpandedArr(index, $event)"
            @grade="onGrade"
            class="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]"
          />
        </div>
        <div v-else><NoDataFound /></div>
      </div>
      <div v-else><NoDataFound /></div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Course, CourseExam, HttpResponse } from '@/types/types.ts'
import CardItem from '@/components/CardItem.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ModalError from '@/components/ModalError.vue'
import ModalConfirmation from '@/components/ModalConfirmation.vue'
import { handleError } from '@/utils/error'
import { useAuthStore } from '@/stores/auth'
import { originalFetch } from '@/main'
import ModalSuccess from '@/components/ModalSuccess.vue'
import NoDataFound from '@/components/NoDataFound.vue'
import ButtonBase from '@/components/buttons/ButtonBase.vue'

const data = ref<Course[]>([])
const statusFilter = ref('all')
const passFilter = ref('all')
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
const authStore = useAuthStore()

onMounted(async () => {
  loading.value = true
  try {
    await authStore.ensureToken(originalFetch)
    anyComponentsExpanded.value = data.value.map(() => false)
    await populate()
  } catch (err) {
    if (err instanceof Error) handleError(err, errorModal, statusCode)
  } finally {
    loading.value = false
  }
})

const populate = async () => {
  try {
    loading.value = true
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const response = await fetch(
      `course?userId=${authStore.user?.id}&role=${authStore.user?.role}&timezone=${timezone}`,
    )
    const raw = (await response.json()) as HttpResponse<Course[]>
    const courses = raw.data as Course[]

    for (const course of courses) {
      course.exams = sortExams(course.exams)
    }
    data.value = courses
  } catch (err) {
    if (err instanceof Error) handleError(err, errorModal, statusCode)
  } finally {
    loading.value = false
  }
}

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

const collapseAll = () => {
  anyComponentsExpanded.value = anyComponentsExpanded.value.map(() => false)
}

const confirmText = ref('')
const confirmModal = ref<InstanceType<typeof ModalConfirmation> | null>(null)
const onGrade = (examId: string) => {
  confirmText.value = 'Do you really want to grade this exam?'
  confirmModal.value?.open()
  toGrade.value = examId
}

const successModal = ref<InstanceType<typeof ModalSuccess> | null>(null)
const toGrade = ref('')
const grade = async () => {
  try {
    loading.value = true
    const res = await fetch(`exam/grade?examId=${toGrade.value}`)
    const data = (await res.json()) as HttpResponse<null>
    if (data.isError) throw new Error(data.message)
    successModal.value?.open()
  } catch (err) {
    if (err instanceof Error) handleError(err, errorModal, statusCode)
  } finally {
    loading.value = false
    toGrade.value = ''
  }
}

watch([statusFilter, passFilter], () => {
  collapseAll()
})

const filteredData = computed(() => {
  if (statusFilter.value === 'all' && passFilter.value === 'all') {
    return data.value
  }
  const now = new Date()
  return data.value
    .map((course) => {
      const exams = course.exams.filter((exam) => {
        const start = new Date(exam.startDate)
        const end = new Date(exam.endDate)

        let status = true
        if (statusFilter.value === 'ONGOING') status = now > start && now < end
        else if (statusFilter.value === 'FINISH') status = now > end
        else if (statusFilter.value === 'UPCOMING') status = now < start

        let pass = true
        if (passFilter.value === 'true') {
          pass = exam.submitDate != null && exam.grade != null && exam.grade >= exam.passingGrade
        } else if (passFilter.value === 'false') {
          pass =
            (exam.isGraded && exam.grade == null) ||
            (exam.grade != null && exam.grade < exam.passingGrade)
        }

        return status && pass
      })
      return { ...course, exams }
    })
    .filter((course) => course.exams.length > 0)
})
</script>
