<template>
  <div class="flex flex-col gap-4 rounded p-4 bg-indigo-100" :id="`upsert-question-${index}`">
    <div class="w-full rounded-full bg-indigo-300 px-4 py-2 flex justify-between">
      <div>
        No. <span>{{ index + 1 }}</span> {{ question.questionId }}
      </div>
      <div class="flex items-center gap-2">
        <div
          class="flex rounded-full px-4 bg-white text-red-600 items-center gap-1 cursor-pointer"
          @click="deleteQuestion(question.questionId)"
        >
          <div>Delete</div>
          <span class="material-symbols-outlined small-icon"> delete </span>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <label for="text" class="w-40 rounded-full bg-indigo-300 px-4 py-2">Question</label>
      <input
        id="text"
        :value="question.text"
        :errors="errors"
        @input="onInput('text', $event)"
        type="text"
        class="border-b px-2 flex-1"
        placeholder="Type here..."
        required
      />
    </div>
    <Transition name="fade">
      <div
        v-if="errors.get('question-text-' + question.questionId)"
        class="flex bg-red-300 rounded-full w-full px-4 py-2"
      >
        {{ errors.get('question-text-' + question.questionId) }}
      </div>
    </Transition>
    <div class="flex items-start gap-4">
      <div class="flex justify-between w-40 rounded-full bg-indigo-300 px-4 py-2">
        <div>Answer</div>
        <div
          @click="createAnswer"
          class="text-indigo-800 bg-white rounded-full w-6 h-6 material-symbols-outlined cursor-pointer"
        >
          add
        </div>
      </div>

      <div class="flex flex-col flex-1 gap-4">
        <Transition name="fade">
          <div
            v-if="createError.get('create-answer')"
            class="flex bg-red-300 rounded-full w-full px-4 py-2"
          >
            {{ createError.get('create-answer') }}
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="errors.get('answers')" class="flex bg-red-300 rounded-full w-full px-4 py-2">
            {{ errors.get('answers') }}
          </div>
        </Transition>
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
import type { FormQuestion } from '@/types/types'

defineOptions({
  name: 'UpsertQuestion',
})

interface Props {
  index: number
  question: FormQuestion
  errors: Map<string, string>
}
const props = defineProps<Props>()

onMounted(() => {
  if (props.question.answers.length == 0) createAnswer()
})

const emit = defineEmits<{
  'update-question': [data: { id: number; field: string; value: string }]
  'delete-question': [questionId: number]
  'create-answer': [questionId: number]
  'update-answer': [data: { questionId: number; answerId: number; field: string; value: string }]
  'delete-answer': [data: { questionId: number; answerId: number }]
}>()

const onInput = (field: string, event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update-question', { id: props.question.questionId, field, value: target.value })
}

const deleteQuestion = (questionId: number) => {
  emit('delete-question', questionId)
}

const maxAnswer = Number(import.meta.env.VITE_MAX_ANSWER)
const createError = ref(new Map<string, string>())
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
    }, 2000)
  }
}

const selected = ref<'A' | 'B' | 'C' | 'D' | 'E' | null>(null)
const updateAnswer = (data: { id: number; field: string; value: string }) => {
  if (data.field == 'isCorrect') {
    selected.value = data.value as 'A' | 'B' | 'C' | 'D' | 'E' | null
  }

  emit('update-answer', {
    questionId: props.question.questionId,
    answerId: data.id,
    field: data.field,
    value: data.value,
  })
}

const deleteAnswer = (id: number) => {
  createError.value.clear()
  emit('delete-answer', { questionId: props.question.questionId, answerId: id })
}

onUnmounted(() => {
  clearTimeout(errorTimeout)
})
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
