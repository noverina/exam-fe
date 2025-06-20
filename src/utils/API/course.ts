import type { Course, HttpResponse } from '@/types/types.ts'

// TODO delete this is to simulate delay
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
const fetchTimeout = +import.meta.env.VITE_FETCH_TIMEOUT

export async function fetchCourses(studentId: string): Promise<HttpResponse<Course[] | string>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, fetchTimeout)
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const response = await fetch(
    `http://localhost:8085/course?studentId=${studentId}&timezone=${timezone}`,
    {
      signal: controller.signal,
    },
  )

  clearTimeout(timeoutId)

  return (await response.json()) as HttpResponse<Course[]>
}
