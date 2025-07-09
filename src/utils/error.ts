import ModalError from '@/components/ModalError.vue'
import type { Ref } from 'vue'

function logError(err: Error): void {
  if (import.meta.env.DEV) {
    console.error(err.message)
  }
  const errorLog = {
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
  }
  const existingLogs = JSON.parse(sessionStorage.getItem('errorLogs') || '[]')
  existingLogs.push(errorLog)
  sessionStorage.setItem('errorLogs', JSON.stringify(existingLogs))
}

export function handleError(
  err: Error,
  errorModal?: Ref<InstanceType<typeof ModalError> | null> | null,
  statusCode?: Ref<string> | null,
): void {
  if (err.message == 'Bad Request') {
    errorModal?.value?.open()
    if (statusCode) statusCode.value = 'E04'
  } else if (err.message == 'Internal Server Error') {
    errorModal?.value?.open()
    if (statusCode) statusCode.value = 'E03'
  } else if (err instanceof DOMException && err.name === 'TimeoutError') {
    errorModal?.value?.open()
    if (statusCode) statusCode.value = 'E01A'
  } else if (err instanceof Error) {
    errorModal?.value?.open()
    if (statusCode) statusCode.value = 'E01A'
  } else {
    errorModal?.value?.open()
  }
  logError(err)
}
