<template>
  <div
    class="h-[calc(100vh-3rem)] sticky top-12 bg-white"
    :class="isContentVisible ? 'p-4' : 'px-3 py-4'"
  >
    <div class="flex h-full gap-2">
      <button
        class="material-symbols-outlined hover:bg-amber-300 transition-colors duration-300 cursor-pointer rounded-md"
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
              class="cursor-pointer w-8 h-8 rounded-sm transition-colors duration-300"
              :class="
                answeredQuestions.get(question.questionId)
                  ? 'bg-green-300 hover:bg-emerald-400'
                  : 'bg-red-300 hover:bg-rose-400'
              "
              @click="scrollToQuestion(question.questionId)"
            >
              {{ index + 1 }}
            </button>
          </div>
          <div class="flex flex-col gap-2 text-sm">
            <button
              class="rounded-sm py-2 px-4 cursor-pointer border border-gray-400 hover:border-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-300 disabled:border-red-400 disabled:hover:bg-red-100"
              @click="emit('on-save')"
              :disabled="!canChangeAnswer"
              :title="canChangeAnswer ? '' : 'Submitted already, can\'t make changes'"
            >
              save
            </button>
            <button
              class="rounded-sm py-2 px-4 cursor-pointer bg-amber-300 border border-orange-500 font-semibold hover:border-orange-700 hover:bg-amber-400 disabled:cursor-not-allowed transition-colors duration-300 disabled:bg-red-300 disabled:border-red-400 disabled:hover:bg-rose-400 disabled:hover:border-rose-500"
              @click="emit('on-submit')"
              :disabled="!canChangeAnswer"
              :title="canChangeAnswer ? '' : 'Submitted already, can\'t make changes'"
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
  canChangeAnswer: boolean
  questions: Question[]
  answeredQuestions: Map<string, string>
}
defineProps<Props>()

const emit = defineEmits<{
  'on-save': []
  'on-submit': []
}>()

const scrollToQuestion = (questionId: string) => {
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
