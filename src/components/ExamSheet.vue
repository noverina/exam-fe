<template>
  <div
    class="fixed top-14 right-0 rounded bg-white opacity-50 hover:opacity-100 m-2 p-1 border transition-opacity duration-300"
  >
    <div class="flex flex-col items-end gap-2">
      <button
        class="material-symbols-outlined small-icon cursor-pointer align-middle"
        :class="{ 'rounded-full border': isContentVisible }"
        @click="toggleContent"
      >
        {{ isContentVisible ? 'close' : 'more_horiz' }}
      </button>
      <Transition @enter="enter" @after-enter="afterEnter" @leave="leave">
        <div v-if="isContentVisible">
          <div class="flex flex-col text-sm">
            <button
              v-for="(question, index) in questions"
              :key="question.questionId"
              class="cursor-pointer"
              :class="answeredQuestions[question.questionId] ? 'bg-green-400' : 'bg-red-400'"
              @click.prevent="scrollToQuestion(question.questionId)"
            >
              {{ index + 1 }}
            </button>
          </div>
          <ExamSheetSave :exam-id="examId"></ExamSheetSave>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, inject } from 'vue'
import type { Ref } from 'vue'
import type { Question } from '@/types/types.ts'
import ExamSheetSave from '@/components/ExamSheetSave.vue'

defineOptions({
  name: 'ExamSheet',
})

interface Props {
  examId: number
  questions: Question[]
}
defineProps<Props>()

const scrollToQuestion = (questionId: number) => {
  const element = document.getElementById(`question-${questionId}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const isContentVisible = ref(false)

function toggleContent() {
  isContentVisible.value = !isContentVisible.value
}

const answeredQuestions = inject('answeredQuestions') as Ref<Record<number, boolean>>

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
