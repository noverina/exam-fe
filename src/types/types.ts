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
  exams: CourseExam[]
}

export interface CourseExam {
  examId: number
  type: ExamType
  grade: number
  passingGrade: number
  startDate: string
  endDate: string
  submitDate: string
}

export interface ExamDetail {
  studentExamId: number
  examId: number
  examType: ExamType
  courseName: string
  endDate: string
  questions: Question[]
}

export interface Question {
  questionId: number
  selectedAnswerId: number
  text: string
  answers: Answer[]
}

export interface Answer {
  answerId: number
  text: string
  isCorrect: boolean
}
