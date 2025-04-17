<template>
  <div class="flex flex-col gap-4 rounded p-4 bg-indigo-100" :id="`upsert-question-${index}`">
    <div class="w-full rounded-full bg-indigo-300 px-4 py-2 flex justify-between">
      <div>
        No. <span>{{ index + 1 }}</span>
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
        @input="onInput('text', $event)"
        type="text"
        class="border-b px-2 flex-1"
        placeholder="type here..."
        required
      />
    </div>
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
        <TransitionGroup name="fade" tag="div" class="flex flex-col gap-4 overflow-y-auto">
          <UpsertAnswer
            v-for="(answer, index) in props.question.answers"
            :key="answer.answerId"
            :index="index"
            :answer="answer"
            :selected="selected"
            @update-answer="updateAnswer"
          ></UpsertAnswer>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UpsertAnswer from '@/components/UpsertAnswer.vue'
import type { Answer, Question } from '@/types/types'

defineOptions({
  name: 'UpsertQuestion',
})

interface Props {
  index: number
  question: Question
}
const props = defineProps<Props>()

onMounted(() => {
  createAnswer()
})

const emit = defineEmits<{
  'update-question': [data: { id: number; field: string; value: string }]
  'delete-question': [questionId: number]
  'create-answer': [data: { questionId: number; answer: Answer }]
  'update-answer': [data: { questionIndex: number; index: number; field: string; value: string }]
}>()

const onInput = (field: string, event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update-question', { id: props.question.questionId, field, value: target.value })
}

const deleteQuestion = (questionId: number) => {
  emit('delete-question', questionId)
}

const createAnswer = () => {
  const answer: Answer = {
    answerId: props.index + Math.floor(Date.now() / 1000) + 1,
    text: '',
    isCorrect: false,
  }
  emit('create-answer', { questionId: props.question.questionId, answer: answer })
}

const selected = ref<'A' | 'B' | 'C' | 'D' | 'E' | null>(null)
const updateAnswer = (data: { index: number; field: string; value: string }) => {
  if (data.field == 'isCorrect') {
    selected.value = data.value as 'A' | 'B' | 'C' | 'D' | 'E' | null
  }

  emit('update-answer', {
    questionIndex: props.question.questionId,
    index: data.index,
    field: data.field,
    value: data.value,
  })
}
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
