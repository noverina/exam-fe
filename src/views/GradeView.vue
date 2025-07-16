<template>
  <main class="cursor-auto text-sm text-gray-800 mt-5">
    <ModalError ref="errorModal" :text="errorText" :code="statusCode" />
    <div v-show="loading">
      <LoadingSpinner />
    </div>
    <div v-show="!loading">
      <div class="flex flex-col gap-4 p-4 m-5 rounded-md bg-white">
        <div class="flex justify-between items-center border-b border-black p-4">
          <div>
            <div class="font-bold">{{ data?.courseName }}</div>
            <div>{{ data?.examType }}</div>
          </div>
          <div>
            <div>
              <span class="font-bold">Pass rate</span> {{ data.passRate }}% ({{ data.passAmt }}/{{
                data.students.length
              }})
            </div>
            <div><span class="font-bold">Average grade</span> {{ data.average }}</div>
          </div>
        </div>

        <div class="flex justify-end py-4">
          <div
            class="flex gap-4 border border-gray-400 px-4 py-2 rounded-md items-center justify-center"
          >
            <label for="search">Search</label>
            <input
              type="text"
              class="border-b border-gray-400 focus:outline-1 focus:outline-gray-400"
              placeholder="type here..."
              v-model="searchTerm"
            />
            <label for="search">Show</label>
            <select
              class="focus:outline-none focus:ring-0 focus:shadow-none border border-gray-400 rounded-sm px-2 py-1"
              id="filter-select"
              v-model="searchFilter"
            >
              <option value="all">All</option>
              <option value="true">Passed</option>
              <option value="false">Failed</option>
            </select>
          </div>
        </div>

        <Transition name="fade" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-if="filteredStudents.length > 0">
            <div v-for="student in filteredStudents" :key="student.studentId">
              <div
                class="flex gap-4 p-4 border rounded-sm cursor-pointer justify-between cursor-pointer transition-colors duration-300"
                :class="
                  student.isPass
                    ? 'border-emerald-500 hover:border-green-700'
                    : 'border-rose-400 hover:border-red-700'
                "
                @click="toExamView(student.studentId)"
              >
                <div class="font-semibold">{{ student.studentName }}</div>
                <div
                  :class="
                    student.isPass
                      ? 'text-emerald-700 hover:text-green-800'
                      : 'text-red-700 hover:text-rose-800'
                  "
                >
                  {{ student.grade == null ? 0 : student.grade }}
                </div>
              </div>
            </div>
          </div>
          <div v-else><NoDataFound /></div>
        </Transition>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModalError from '@/components/ModalError.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import NoDataFound from '@/components/NoDataFound.vue'
import type { Grade, HttpResponse } from '@/types/types'
import { ExamType } from '@/types/enums'
import { handleError } from '@/utils/error'
import { useAuthStore } from '@/stores/auth'
import { originalFetch } from '@/main'

const loading = ref(true)
const route = useRoute()
const router = useRouter()
const examId = route.params.examId
const courseTeacherId = route.params.courseTeacherId
const authStore = useAuthStore()

const statusCode = ref('')
const errorText = ref('')
const data = ref<Grade>({
  examId: '',
  examType: ExamType.MID,
  courseName: '',
  passingGrade: 0,
  passRate: 0,
  passAmt: 0,
  average: 0,
  students: [],
})
const errorModal = ref<InstanceType<typeof ModalError> | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    await authStore.ensureToken(originalFetch)
    if (typeof courseTeacherId != 'string' || typeof examId != 'string')
      throw new Error('Missing required URL param')
    const res = (await (
      await fetch(`exam/grade/data?examId=${examId}&courseTeacherId=${courseTeacherId}`)
    ).json()) as unknown as HttpResponse<Grade | string>
    data.value = res.data as Grade
  } catch (err) {
    if (err instanceof Error) handleError(err, errorModal, statusCode)
  } finally {
    loading.value = false
  }
})

const searchTerm = ref('')
const searchFilter = ref('all')
const filteredStudents = computed(() => {
  let result = data.value.students

  if (searchFilter.value === 'true')
    result = data.value.students.filter((student) => student.isPass === true)
  if (searchFilter.value === 'false')
    result = data.value.students.filter((student) => student.isPass === false)

  const query = searchTerm.value.trim().toLowerCase()

  if (!query) return result

  return result.filter((item) =>
    Object.values(item).some((val) => {
      const searchTermLowercase = val == null ? '' : String(val).toLowerCase()
      return searchTermLowercase.includes(query)
    }),
  )
})

const toExamView = (studentId: string) => {
  router.push({
    name: 'ExamView',
    params: { id: data.value.examId },
    query: { studentId: studentId },
  })
}
</script>
