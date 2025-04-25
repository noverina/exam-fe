import type { Course, HttpResponse } from '@/types/types.ts'

//TODO delete this is to simulate delay
// function delay(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms))
// }

export async function fetchCourses(): Promise<HttpResponse<Course[] | string>> {
  //TODO FETCH LINK CHANGE
  //await delay(50000)
  const response = await fetch('http://localhost:8085/course?studentId=1&timezone=Asia/Jakarta')
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  const output = (await response.json()) as HttpResponse<Course[]>

  if (output != null) {
    return output
  } else {
    throw new Error('Output is null')
  }
}
