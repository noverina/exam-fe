export function generateRandomNumber(addedValue?: number) {
  const maxVal = addedValue ? Number.MAX_SAFE_INTEGER - addedValue : Number.MAX_SAFE_INTEGER
  const timestamp = Math.floor(Date.now() / 1000)
  const random = Math.floor(Math.random() * 1000)
  const generatedNumber = timestamp + random

  if (generatedNumber > maxVal) {
    return addedValue ? maxVal - random - addedValue : maxVal - random
  }

  return generatedNumber
}
