export interface FormUpsertExam {
  examId: string
  courseTeacherId: string
  type: string
  startDate: string
  endDate: string
  passingGrade: number
  questions: FormUpsertQuestion[]
  isNew: boolean
  formDelete: FormUpsertDelete[]
}

export interface FormUpsertQuestion {
  questionId: string
  text: string
  answers: FormUpsertAnswer[]
  isNew: boolean
}

export interface FormUpsertAnswer {
  answerId: string
  text: string
  isCorrect: boolean
  isNew: boolean
}

export interface FormUpsertDelete {
  entityId: string
  type: 'QUESTION' | 'ANSWER'
}

export interface FormUpsertError {
  field: string
  message: string
}

export interface FormSubmitExam {
  examId: string
  studentId: string
  isFinal: boolean
  choices: Choice[]
}

export interface Choice {
  questionId: string
  answerId: string
}

export interface UpsertPrefill {
  examId: string
  courseTeacherId: string
  type: string
  startDate: string
  endDate: string
  passingGrade: number
  questions: UpsertPrefillQuestion[]
}

export interface UpsertPrefillQuestion {
  questionId: string
  questionText: string
  answers: UpsertPrefillAnswer[]
}

export interface UpsertPrefillAnswer {
  answerId: string
  answerText: string
  isCorrect: boolean
}
