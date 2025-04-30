export interface FormUpsertExam {
  examId: number
  courseTeacherId: number
  type: string
  startDate: string
  endDate: string
  passingGrade: number
  questions: FormUpsertQuestion[]
  isNew: boolean
  formDelete: FormUpsertDelete[]
}

export interface FormUpsertQuestion {
  questionId: number
  text: string
  answers: FormUpsertAnswer[]
  isNew: boolean
}

export interface FormUpsertAnswer {
  answerId: number
  text: string
  isCorrect: boolean
  isNew: boolean
}

export interface FormUpsertDelete {
  id: number
  type: 'QUESTION' | 'ANSWER'
}

export interface FormUpsertError {
  field: string
  message: string
}

export interface FormSubmitExam {
  examId: number
  studentId: number
  isFinal: boolean
  formSubmitSelected: FormSubmitSelected[]
}

export interface FormSubmitSelected {
  questionId: number
  selectedAnswerId: number
}
