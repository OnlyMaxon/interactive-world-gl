import { useState, useEffect, RefObject, useCallback } from 'react'
import { throttle } from '@/lib/performance'

export function useDimensions(ref: RefObject<SVGSVGElement | HTMLElement | null>) {
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 })

  const updateDimensions = useCallback(() => {
    if (ref.current) {
      const container = ref.current.parentElement
      if (container) {
        const width = container.clientWidth
        const height = container.clientHeight
        setDimensions(prev => {
          if (prev.width !== width || prev.height !== height) {
            return { width, height }
          }
          return prev
        })
      }
    }
  }, [ref])

  const throttledUpdate = useCallback(
    throttle(updateDimensions, 100),
    [updateDimensions]
  )

  useEffect(() => {
    updateDimensions()

    const resizeObserver = new ResizeObserver(throttledUpdate)
    if (ref.current?.parentElement) {
      resizeObserver.observe(ref.current.parentElement)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [ref, updateDimensions, throttledUpdate])

  return dimensions
}
