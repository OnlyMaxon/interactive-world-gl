import { useState, useEffect } from 'react'
import type { Topology } from 'topojson-specification'

let cachedData: Topology | null = null
let dataPromise: Promise<Topology> | null = null

export function useGlobeData() {
  const [worldData, setWorldData] = useState<Topology | null>(cachedData)
  const [isLoading, setIsLoading] = useState(!cachedData)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    if (cachedData) {
      setWorldData(cachedData)
      setIsLoading(false)
      return
    }

    if (!dataPromise) {
      dataPromise = fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.json()
        })
        .then((data: Topology) => {
          cachedData = data
          return data
        })
    }

    dataPromise
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
        dataPromise = null
      })

    return () => {
      mounted = false
    }
  }, [])

  return { worldData, isLoading, error }
}
