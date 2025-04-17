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
  type: ExamType
  startDate: string
  endDate: string
  questions: Question[]
  new: boolean
}
