function toCamelCase(snakeStr: string): string {
  return snakeStr.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', ''),
  )
}

export function jsonToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => jsonToCamelCase(v))
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = toCamelCase(key)
      acc[camelKey] = jsonToCamelCase(obj[key])
      return acc
    }, {} as any)
  } else if (typeof obj === 'string') {
    return obj
  }
  return obj
}

export function handleError(msg: string): void {
  if (import.meta.env.DEV) {
    console.error(msg)
  }
}
