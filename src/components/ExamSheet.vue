<template>
  <div class="h-[calc(100vh-3rem)] sticky top-12 px-2 py-4">
    <div class="flex h-full gap-2">
      <button
        class="material-symbols-outlined hover:bg-indigo-100 cursor-pointer"
        @click="isContentVisible = !isContentVisible"
      >
        {{ isContentVisible ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left' }}
      </button>
      <Transition name="slide">
        <div v-if="isContentVisible" class="flex flex-col gap-4 justify-between">
          <div class="grid grid-cols-3 gap-1">
            <button
              v-for="(question, index) in questions"
              :key="question.questionId"
              class="cursor-pointer w-8 h-8"
              :class="answeredQuestions.get(question.questionId) ? 'bg-green-300' : 'bg-red-300'"
              @click="scrollToQuestion(question.questionId)"
            >
              {{ index + 1 }}
            </button>
          </div>
          <div class="flex flex-col gap-2 text-sm font-semibold">
            <button
              class="rounded-sm py-2 px-4 cursor-pointer bg-indigo-200"
              @click="emit('on-save')"
            >
              save
            </button>
            <button
              class="rounded-sm py-2 px-4 cursor-pointer bg-indigo-200"
              @click="emit('on-submit')"
            >
              submit
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { Question } from '@/types/types.ts'

interface Props {
  questions: Question[]
  answeredQuestions: Map<number, number>
}
defineProps<Props>()

const emit = defineEmits<{
  'on-save': []
  'on-submit': []
}>()

const scrollToQuestion = (questionId: number) => {
  const element = document.getElementById(`question-${questionId}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const isContentVisible = ref(false)
</script>

<style scoped>
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
