<template>
  <div>
    <div class="flex gap-4 py-2 items-center">
      <label for="radio w-5" class="">{{ indexChar }}</label>
      <input
        id="radio"
        :value="answer.text"
        type="text"
        class="border-b px-2 flex-1"
        placeholder="Type here..."
        @input="onInput('text', $event)"
      />

      <div class="flex gap-2">
        <div
          @click="onSelect(indexChar)"
          class="p-1 cursor-pointer material-symbols-outlined cursor-pointer rounded-full bg-white small-icon w-5 h-5 border transition-colors duration-300"
          :class="
            selected == indexChar || (!answer.isNew && answer.isCorrect)
              ? 'text-green-500 border-green-500 hover:text-green-900 hover:border-green-700'
              : 'text-red-500 border-red-500 hover:text-red-900 hover:border-red-700'
          "
        >
          <div title="mark as correct">
            {{ selected == indexChar || (!answer.isNew && answer.isCorrect) ? 'check' : 'close' }}
          </div>
        </div>
        <div
          title="delete"
          @click="onDelete"
          class="p-1 cursor-pointer material-symbols-outlined cursor-pointer rounded-full bg-white text-red-500 small-icon w-5 h-5 hover:text-red-700 transition-colors duration-300"
        >
          <div>delete</div>
        </div>
      </div>
    </div>
    <ErrorForm :show-condition="errors.get(`answer-text-${answer.answerId}`)">
      {{ errors.get(`answer-text-${answer.answerId}`) }}</ErrorForm
    >
  </div>
</template>
<script setup lang="ts">
import type { FormUpsertAnswer } from '@/types/formTypes'
import ErrorForm from '@/components/ErrorForm.vue'
import { computed } from 'vue'

interface Props {
  index: number
  answer: FormUpsertAnswer
  selected: 'A' | 'B' | 'C' | 'D' | 'E' | null
  errors: Map<string, string>
}
const props = defineProps<Props>()

const emit = defineEmits<{
  'update-answer': [data: { answerId: string; field: string; value: string }]
  'delete-answer': [answerId: string]
}>()

const onInput = (field: string, event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update-answer', { answerId: props.answer.answerId, field: field, value: target.value })
}

const onSelect = (choice: 'A' | 'B' | 'C' | 'D' | 'E') => {
  emit('update-answer', { answerId: props.answer.answerId, field: 'isCorrect', value: choice })
}

const onDelete = () => {
  emit('delete-answer', props.answer.answerId)
  String.fromCharCode(props.index + 65) as 'A' | 'B' | 'C' | 'D' | 'E'
}

const indexChar = computed(
  () => String.fromCharCode(props.index + 65) as 'A' | 'B' | 'C' | 'D' | 'E',
)
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
