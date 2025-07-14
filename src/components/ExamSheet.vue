<template>
  <div
    class="h-[calc(100vh-3rem)] sticky top-12 bg-white z-52"
    :class="isContentVisible ? 'p-4' : 'px-3 py-4'"
  >
    <div class="flex h-full gap-2">
      <ButtonYellow
        class="material-symbols-outlined p-1! border-none!"
        @click="isContentVisible = !isContentVisible"
        :is-border="false"
      >
        {{ isContentVisible ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left' }}
      </ButtonYellow>
      <Transition name="slide">
        <div v-if="isContentVisible" class="flex flex-col gap-4 justify-between">
          <div class="grid grid-cols-3 gap-1">
            <template v-for="(question, index) in questions" :key="question.questionId">
              <ButtonGreen
                v-if="answeredQuestions.get(question.questionId)"
                @click="scrollToQuestion(question.questionId)"
                :is-border="false"
                class="w-8 h-8 flex items-center justify-center"
                >{{ index + 1 }}</ButtonGreen
              >
              <ButtonRed
                class="w-8 h-8 flex items-center justify-center"
                v-else
                @click="scrollToQuestion(question.questionId)"
                :is-border="false"
                >{{ index + 1 }}</ButtonRed
              >
            </template>
          </div>
          <div>
            <div v-if="canChangeAnswer" class="flex flex-col gap-2 text-sm">
              <ButtonBase @click="emit('on-save')"> save </ButtonBase>
              <ButtonYellow @click="emit('on-submit')" :is-border="false" class="font-semibold">
                submit
              </ButtonYellow>
            </div>
            <div v-else class="flex flex-col gap-2 text-sm">
              <ButtonRed
                @click="emit('on-save')"
                disabled
                :title="'Submitted already, can\'t make changes'"
                :is-border="true"
                class="cursor-not-allowed!"
              >
                save
              </ButtonRed>
              <ButtonRed
                @click="emit('on-submit')"
                disabled
                :title="'Submitted already, can\'t make changes'"
                :is-border="false"
                class="cursor-not-allowed! font-semibold"
              >
                submit
              </ButtonRed>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { Question } from '@/types/types.ts'
import ButtonYellow from './buttons/ButtonYellow.vue'
import ButtonRed from './buttons/ButtonRed.vue'
import ButtonGreen from './buttons/ButtonGreen.vue'
import ButtonBase from './buttons/ButtonBase.vue'

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
