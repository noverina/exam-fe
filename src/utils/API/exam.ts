import { jsonToCamelCase } from '../format.ts'
import type { Question, HttpResponse } from '../../types/Types.ts'

export async function fetchQuestions(examId: string): Promise<HttpResponse<Question[] | string>> {
  //TODO FETCH LINK CHANGE
  const response = await fetch('http://localhost:8085/exam/question?examId=' + examId)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  let output = await response.json()
  if (output != null) {
    return jsonToCamelCase(output)
  } else {
    throw new Error('Output is null')
  }
}
