export function debounce<T extends (...args: any[]) => any>(func: T, delay: number = 1000) {
  let timeoutId: number | undefined | ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
