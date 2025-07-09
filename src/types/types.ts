import type { ExamType } from './enums'

export interface HttpResponse<T> {
  isError: boolean
  message: string
  data: T
}

export interface Course {
  courseTeacherId: string
  courseName: string
  teacherName: string
  exams: CourseExam[]
}

export interface CourseExam {
  examId: string
  type: ExamType
  grade: number
  passingGrade: number
  startDate: string
  endDate: string
  submitDate: string
  isGraded: boolean
}

export interface ExamDetail {
  isFinal: boolean
  examId: string
  examType: ExamType
  courseName: string
  endDate: string
  grade: number
  questions: Question[]
}

export interface Question {
  questionId: string
  selectedAnswerId: string
  text: string
  answers: Answer[]
}

export interface Answer {
  answerId: string
  text: string
  isCorrect: boolean
}

export interface ErrorInfo {
  code: string
  message: string
}

export interface Grade {
  examId: string
  examType: ExamType
  courseName: string
  passingGrade: number
  passRate: number
  passAmt: number
  average: number
  students: GradeDetail[]
}

export interface GradeDetail {
  studentId: string
  studentName: string
  grade: number
  isPass: boolean
}

export interface Auth {
  email: string
  password: string
}

export interface User {
  id: string
  role: string
  name: string
}
