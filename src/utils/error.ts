export function logError(err: Error): void {
  if (import.meta.env.DEV) {
    console.error(err.message)
  }
  const errorLog = {
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
  }
  const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]')
  existingLogs.push(errorLog)
  localStorage.setItem('errorLogs', JSON.stringify(existingLogs))
}
