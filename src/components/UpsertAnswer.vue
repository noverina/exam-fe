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
          class="p-1 cursor-pointer material-symbols-outlined cursor-pointer rounded-full transition-colors duration-300 bg-white small-icon w-5 h-5"
          :class="
            selected == indexChar || (!answer.isNew && answer.isCorrect)
              ? 'text-green-600'
              : 'text-red-600'
          "
        >
          <div>
            {{ selected == indexChar || (!answer.isNew && answer.isCorrect) ? 'check' : 'close' }}
          </div>
        </div>
        <div
          @click="onDelete"
          class="p-1 cursor-pointer material-symbols-outlined cursor-pointer rounded-full bg-white text-red-600 small-icon w-5 h-5"
        >
          <div>delete</div>
        </div>
      </div>
    </div>
    <Transition name="fade">
      <div
        v-if="errors.get('answer-text-' + answer.answerId)"
        class="flex bg-red-300 rounded-full w-full px-4 py-2"
      >
        {{ errors.get('answer-text-' + answer.answerId) }}
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import type { FormAnswer } from '@/types/types'
import { computed } from 'vue'

defineOptions({
  name: 'UpsertAnswer',
})

interface Props {
  index: number
  answer: FormAnswer
  selected: 'A' | 'B' | 'C' | 'D' | 'E' | null
  errors: Map<string, string>
}
const props = defineProps<Props>()

const emit = defineEmits<{
  'update-answer': [data: { id: number; field: string; value: string }]
  'delete-answer': [id: number]
}>()

const onInput = (field: string, event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update-answer', { id: props.answer.answerId, field: field, value: target.value })
}

const onSelect = (choice: 'A' | 'B' | 'C' | 'D' | 'E') => {
  emit('update-answer', { id: props.answer.answerId, field: 'isCorrect', value: choice })
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
