import { ref, provide, inject } from 'vue'
import type { Ref } from 'vue'

const examStateSymbol = Symbol('examState')

export function provideExamState() {
  const answeredQuestions = ref<number[]>([])
  provide(examStateSymbol, answeredQuestions)
  return answeredQuestions
}

export function useExamState(): Ref<number[]> {
  const answeredQuestions = inject<Ref<number[]>>(examStateSymbol)
  console.log(answeredQuestions)
  if (!answeredQuestions) {
    throw new Error('useExamState must be used within a provider.')
  }
  return answeredQuestions
}
