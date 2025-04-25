export function handleError(msg: string): void {
  if (import.meta.env.DEV) {
    console.error(msg)
  }
}
