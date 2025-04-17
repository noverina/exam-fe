import { jsonToCamelCase } from '../format.ts'
import type { Course, HttpResponse } from '../../types/Types.ts'

export async function fetchCourses(): Promise<HttpResponse<Course[] | string>> {
  //TODO FETCH LINK CHANGE
  const response = await fetch('http://localhost:8085/course?studentId=1')
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
