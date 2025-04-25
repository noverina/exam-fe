import type { ExamType } from './enums'

export interface HttpResponse<T> {
  isError: boolean
  message: string
  data: T
}

export interface Course {
  courseTeacherId: number
  name: string
  teacherName: string
  exams: Exam[]
}

export interface Exam {
  examId: number
  type: ExamType
  grade: number
  passingGrade: number
  startDate: string
  endDate: string
  submitDate: string
}

export interface Question {
  questionId: number
  text: string
  answers: Answer[]
}

export interface Answer {
  answerId: number
  text: string
  isCorrect: boolean
}

export interface FormExam {
  examId: number
  courseTeacherId: number
  type: string
  startDate: string
  endDate: string
  passingGrade: number
  questions: FormQuestion[]
  isNew: boolean
  formDelete: FormDelete[]
}

export interface FormQuestion {
  questionId: number
  text: string
  answers: FormAnswer[]
  isNew: boolean
}

export interface FormAnswer {
  answerId: number
  text: string
  isCorrect: boolean
  isNew: boolean
}

export interface FormDelete {
  id: number
  type: 'QUESTION' | 'ANSWER'
}

export interface FormError {
  field: string
  message: string
}
