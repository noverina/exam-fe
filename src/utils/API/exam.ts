import type { Question, HttpResponse, FormExam } from '@/types/types'

export async function fetchQuestions(examId: string): Promise<HttpResponse<Question[] | string>> {
  //TODO FETCH LINK CHANGE
  const response = await fetch('http://localhost:8085/exam/question?examId=' + examId)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  const output = (await response.json()) as HttpResponse<Question[]>
  if (output != null) {
    return output
  } else {
    throw new Error('Output is null')
  }
}

export async function fetchUpdateData(examId: number): Promise<HttpResponse<FormExam[] | string>> {
  //TODO FETCH LINK CHANGE
  const response = await fetch('http://localhost:8085/exam/upsert/data?examId=' + examId)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  const output = (await response.json()) as HttpResponse<FormExam[]>
  if (output != null) {
    return output
  } else {
    throw new Error('Output is null')
  }
}

export async function submitFormExam(data: FormExam): Promise<HttpResponse<string>> {
  //TODO FETCH LINK CHANGE
  const response = await fetch('http://localhost:8085/exam/upsert', {
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
