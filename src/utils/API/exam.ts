import type { FormSubmitExam, FormUpsertExam } from '@/types/formTypes'
import type { HttpResponse, ExamDetail } from '@/types/types'

export async function fetchExamData(examId: string): Promise<HttpResponse<ExamDetail[] | string>> {
  //TODO FETCH LINK CHANGE
  const response = await fetch(
    'http://localhost:8085/exam/answer/data?examId=' + examId + '&studentId=1',
  )
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  const output = (await response.json()) as HttpResponse<ExamDetail[]>
  if (output != null) {
    return output
  } else {
    throw new Error('Output is null')
  }
}

export async function fetchUpdateData(
  examId: number,
): Promise<HttpResponse<FormUpsertExam[] | string>> {
  //TODO FETCH LINK CHANGE
  const response = await fetch('http://localhost:8085/exam/data?examId=' + examId)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  const output = (await response.json()) as HttpResponse<FormUpsertExam[]>
  if (output != null) {
    return output
  } else {
    throw new Error('Output is null')
  }
}

export async function upsertExam(data: FormUpsertExam): Promise<HttpResponse<null | string>> {
  //TODO FETCH LINK CHANGE
  const response = await fetch('http://localhost:8085/exam', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  const output = await response.json()
  if (output != null) {
    return output
  } else {
    throw new Error('Output is null')
  }
}

export async function submitExam(data: FormSubmitExam): Promise<HttpResponse<null | string>> {
  //TODO FETCH LINK CHANGE
  const response = await fetch('http://localhost:8085/exam/answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  const output = await response.json()
  if (output != null) {
    return output
  } else {
    throw new Error('Output is null')
  }
}
