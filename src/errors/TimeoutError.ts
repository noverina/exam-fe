export class TimeoutError extends Error {
  constructor(message: string) {
    super('Timeout ' + message)
    this.name = 'TimeoutError'
    Object.setPrototypeOf(this, TimeoutError.prototype)
  }
}
