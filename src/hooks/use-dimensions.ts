import { useState, useEffect, RefObject } from 'react'

export function useDimensions(ref: RefObject<SVGSVGElement | HTMLElement | null>) {
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 })

  useEffect(() => {
    const updateDimensions = () => {
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
    }

    updateDimensions()

    const resizeObserver = new ResizeObserver(updateDimensions)
    if (ref.current?.parentElement) {
      resizeObserver.observe(ref.current.parentElement)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [ref])

  return dimensions
}
