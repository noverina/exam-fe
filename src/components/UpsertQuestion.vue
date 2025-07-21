<template>
  <div
    class="flex flex-col gap-4 rounded-md p-2 lg:p-4 border border-gray-400 bg-white"
    :id="`upsert-question-${index}`"
  >
    <div class="w-full border-b border-gray-400 px-4 py-2 flex justify-between items-center">
      <div>
        No. <span>{{ index + 1 }}</span>
      </div>
      <div class="flex items-center gap-2">
        <ButtonRed
          class="flex items-center justify-center gap-2 p-1! lg:px-4! text-rose-500 hover:text-red-600"
          @click="deleteQuestion(question.questionId)"
          :is-border="true"
        >
          <div>Delete</div>
          <span class="material-symbols-outlined small-icon"> delete </span>
        </ButtonRed>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <label
        for="text"
        class="w-20 lg:w-40 rounded-lg border border-gray-400 px-2 lg:px-4 py-1 lg:py-2"
        >Question</label
      >
      <input
        id="text"
        :value="question.text"
        :errors="errors"
        @input="onInput('text', $event)"
        type="text"
        class="border-b px-2 flex-1 focus:outline-1 focus:outline-gray-400"
        placeholder="Type here..."
        required
      />
    </div>

    <ErrorForm :show-condition="errors.get(`question-text-${question.questionId}`)">
      {{ errors.get(`question-text-${question.questionId}`) }}</ErrorForm
    >
    <div class="flex items-start gap-4">
      <div
        class="flex justify-between w-30 lg:w-40 rounded-lg border border-gray-400 px-2 lg:px-4 py-1 lg:py-2"
      >
        <div>Answer</div>
        <div class="flex justify-center items-center" @click="createAnswer">
          <div
            title="create new answer"
            class="w-4 h-4 p-1 xs-icon rounded-full material-symbols-outlined cursor-pointer border border-gray-500 hover:text-black hover:border-gray-800 transition-colors duration-300"
          >
            add
          </div>
        </div>
      </div>

      <div class="flex flex-col flex-1 gap-4">
        <ErrorForm :show-condition="createError.get('create-answer')">
          {{ createError.get('create-answer') }}</ErrorForm
        >
        <ErrorForm :show-condition="errors.get(`question-answer-${question.questionId}`)">
          {{ errors.get(`question-answer-${question.questionId}`) }}</ErrorForm
        >
        <TransitionGroup
          v-if="question.answers.length > 0"
          name="fade"
          tag="div"
          class="flex flex-col gap-4 overflow-y-auto"
        >
          <UpsertAnswer
            v-for="(answer, index) in props.question.answers"
            :key="answer.answerId"
            :index="index"
            :answer="answer"
            :selected="selected"
            :errors="errors"
            @update-answer="updateAnswer"
            @delete-answer="deleteAnswer"
          ></UpsertAnswer>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import UpsertAnswer from '@/components/UpsertAnswer.vue'
import type { FormUpsertQuestion } from '@/types/formTypes'
import ButtonRed from './buttons/ButtonRed.vue'
import ErrorForm from '@/components/ErrorForm.vue'

interface Props {
  index: number
  question: FormUpsertQuestion
  errors: Map<string, string>
}
const props = defineProps<Props>()

onMounted(() => {
  if (props.question.answers.length == 0) createAnswer()
})

const emit = defineEmits<{
  'update-question': [data: { questionId: string; field: string; value: string }]
  'delete-question': [questionId: string]
  'create-answer': [questionId: string]
  'update-answer': [data: { questionId: string; answerId: string; field: string; value: string }]
  'delete-answer': [data: { questionId: string; answerId: string }]
}>()

const onInput = (field: string, event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update-question', { questionId: props.question.questionId, field, value: target.value })
}

const deleteQuestion = (questionId: string) => {
  emit('delete-question', questionId)
}

const maxAnswer = +import.meta.env.VITE_MAX_ANSWER
const createError = ref(new Map<string, string>())
const envErrorTimeout = +import.meta.env.VITE_VALIDATION_ERROR_TIMEOUT
let errorTimeout = 0
const createAnswer = () => {
  createError.value.clear()
  if (props.question.answers.length < maxAnswer) {
    emit('create-answer', props.question.questionId)
  } else {
    createError.value.set('create-answer', 'Max answers (' + maxAnswer + ') reached')
    clearTimeout(errorTimeout)
    errorTimeout = setTimeout(() => {
      createError.value.delete('create-answer')
    }, envErrorTimeout)
  }
}

const selected = ref<'A' | 'B' | 'C' | 'D' | 'E' | null>(null)
const updateAnswer = (data: { answerId: string; field: string; value: string }) => {
  if (data.field == 'isCorrect') {
    selected.value = data.value as 'A' | 'B' | 'C' | 'D' | 'E' | null
  }

  emit('update-answer', {
    questionId: props.question.questionId,
    answerId: data.answerId,
    field: data.field,
    value: data.value,
  })
}

const deleteAnswer = (answerId: string) => {
  createError.value.clear()
  emit('delete-answer', { questionId: props.question.questionId, answerId: answerId })
}

onUnmounted(() => {
  clearTimeout(errorTimeout)
})
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
