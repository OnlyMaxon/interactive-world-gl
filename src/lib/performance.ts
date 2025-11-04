export function logPerformance(label: string, fn: () => void) {
  if (import.meta.env.DEV) {
    const start = performance.now()
    fn()
    const end = performance.now()
    console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`)
  } else {
    fn()
  }
}

export function measureRender(componentName: string) {
  if (import.meta.env.DEV) {
    const start = performance.now()
    return () => {
      const end = performance.now()
      const duration = end - start
      if (duration > 16.67) {
        console.warn(`[Performance] ${componentName} render took ${duration.toFixed(2)}ms (>16.67ms threshold)`)
      }
    }
  }
  return () => {}
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
