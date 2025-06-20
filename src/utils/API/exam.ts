import type { FormSubmitExam, FormUpsertExam, UpsertPrefill } from '@/types/formTypes'
import type { HttpResponse, ExamDetail } from '@/types/types'

export async function fetchExamData(
  examId: string,
  studentId: string,
): Promise<HttpResponse<ExamDetail[] | string>> {
  //TODO FETCH LINK CHANGE
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const response = await fetch(
    `http://localhost:8085/exam/answer/data?examId=${examId}&studentId=${studentId}&timezone=${timezone}`,
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

export async function fetchUpsertData(
  examId: string,
): Promise<HttpResponse<UpsertPrefill[] | string>> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  //TODO FETCH LINK CHANGE
  const response = await fetch(
    `http://localhost:8085/exam/data?examId=${examId}&timezone=${timezone}`,
  )
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  const output = (await response.json()) as HttpResponse<UpsertPrefill[]>
  if (output != null) {
    return output
  } else {
    throw new Error('Output is null')
  }
}

export async function upsert(data: FormUpsertExam): Promise<HttpResponse<null | string>> {
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

export async function submitForm(data: FormSubmitExam): Promise<HttpResponse<null | string>> {
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

export async function grade(examId: string): Promise<HttpResponse<null | string>> {
  //TODO FETCH LINK CHANGE
  const response = await fetch(`http://localhost:8085/grade?examId=${examId}`)
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
