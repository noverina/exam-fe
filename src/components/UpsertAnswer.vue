<template>
  <div class="flex gap-4 py-2 items-center">
    <label for="text" class="">{{ indexChar }}</label>
    <input
      id="text"
      v-model="form.text"
      type="text"
      class="border-b px-2 flex-1"
      placeholder="type here..."
      @input="onInput('text', $event)"
    />
    <div class="flex gap-2">
      <div
        @click="onClick(indexChar)"
        class="p-1 cursor-pointer material-symbols-outlined cursor-pointer rounded-full transition-colors duration-300 bg-white small-icon w-5 h-5"
        :class="selected == indexChar ? 'text-green-600' : 'text-red-600'"
      >
        <div>{{ selected == indexChar ? 'check' : 'close' }}</div>
      </div>
      <div
        @click="onClick(indexChar)"
        class="p-1 cursor-pointer material-symbols-outlined cursor-pointer rounded-full bg-white text-red-600 small-icon w-5 h-5"
      >
        <div>delete</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Answer } from '@/types/types'
import { reactive } from 'vue'

defineOptions({
  name: 'UpsertAnswer',
})

interface Props {
  index: number
  answer: Answer
  selected: 'A' | 'B' | 'C' | 'D' | 'E' | null
}
const props = defineProps<Props>()

interface FormData {
  text: string
  isCorrect: boolean
}

const form = reactive<FormData>({
  text: '',
  isCorrect: false,
})

const emit = defineEmits<{
  'update-answer': [data: { index: number; field: string; value: string }]
}>()

const onInput = (field: string, event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update-answer', { index: props.answer.answerId, field: field, value: target.value })
}

const onClick = (choice: 'A' | 'B' | 'C' | 'D' | 'E') => {
  emit('update-answer', { index: props.answer.answerId, field: 'isCorrect', value: choice })
}

const indexChar = String.fromCharCode(props.index + 65) as 'A' | 'B' | 'C' | 'D' | 'E'
</script>
