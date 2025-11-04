import { useState, useEffect } from 'react'
import type { Topology } from 'topojson-specification'

export function useGlobeData() {
  const [worldData, setWorldData] = useState<Topology | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then((data: Topology) => {
        if (mounted) {
          setWorldData(data)
          setIsLoading(false)
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err)
          setIsLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return { worldData, isLoading, error }
}
