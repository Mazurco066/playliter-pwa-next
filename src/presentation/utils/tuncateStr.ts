export const truncateSrt = (value: string, length: number) => {
  if (value.length > length) return value.substring(0, length) + '...'
  return value
}
