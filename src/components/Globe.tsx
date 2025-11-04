import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import * as d3 from 'd3'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import type { FeatureCollection, GeoJsonProperties } from 'geojson'

interface GlobeProps {
  selectedCountries: string[]
  onCountryClick?: (country: string) => void
  className?: string
}

export interface GlobeHandle {
  zoomIn: () => void
  zoomOut: () => void
  resetView: () => void
}

export const Globe = forwardRef<GlobeHandle, GlobeProps>(({ selectedCountries, onCountryClick, className }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [worldData, setWorldData] = useState<Topology | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 })
  const zoomBehaviorRef = useRef<any>(null)
  const projectionRef = useRef<any>(null)
  const currentScaleRef = useRef<number>(0)

  const labelsUpdateRef = useRef<(() => void) | null>(null)
  const rotationRef = useRef<[number, number]>([0, 0])

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (svgRef.current && zoomBehaviorRef.current) {
        d3.select(svgRef.current)
          .transition()
          .duration(300)
          .call(zoomBehaviorRef.current.scaleBy, 1.3)
          .on('end', () => {
            if (labelsUpdateRef.current) {
              labelsUpdateRef.current()
            }
          })
      }
    },
    zoomOut: () => {
      if (svgRef.current && zoomBehaviorRef.current) {
        d3.select(svgRef.current)
          .transition()
          .duration(300)
          .call(zoomBehaviorRef.current.scaleBy, 0.7)
          .on('end', () => {
            if (labelsUpdateRef.current) {
              labelsUpdateRef.current()
            }
          })
      }
    },
    resetView: () => {
      if (svgRef.current && projectionRef.current && zoomBehaviorRef.current) {
        const svg = d3.select(svgRef.current)
        const projection = projectionRef.current
        const { width, height } = dimensions
        const radius = Math.min(width, height) / 2.2
        
        rotationRef.current = [0, 0]
        projection.rotate([0, 0])
        currentScaleRef.current = radius
        
        svg.transition()
          .duration(800)
          .call(zoomBehaviorRef.current.transform, d3.zoomIdentity.scale(radius))
          .on('end', () => {
            if (labelsUpdateRef.current) {
              labelsUpdateRef.current()
            }
          })
      }
    }
  }))

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement
        if (container) {
          const width = container.clientWidth
          const height = container.clientHeight
          setDimensions({ width, height })
        }
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then((data: Topology) => {
        setWorldData(data)
      })
  }, [])

  useEffect(() => {
    if (!svgRef.current || !worldData) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = dimensions
    const radius = Math.min(width, height) / 2.2

    const projection = d3.geoOrthographic()
      .scale(radius)
      .translate([width / 2, height / 2])
      .clipAngle(90)

    projectionRef.current = projection
    currentScaleRef.current = radius

    const path = d3.geoPath().projection(projection)

    const countriesGeoJSON: any = feature(worldData, worldData.objects.countries as any)

    const sphere = { type: 'Sphere' as const }
    
    svg.append('path')
      .datum(sphere)
      .attr('class', 'ocean')
      .attr('d', path as any)
      .attr('fill', 'var(--ocean)')
      .attr('stroke', 'none')

    const g = svg.append('g')

    g.selectAll('path')
      .data(countriesGeoJSON.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        const countryName = d.properties?.name || ''
        if (selectedCountries.length === 0) {
          return 'var(--land)'
        }
        return selectedCountries.includes(countryName) ? 'var(--color-accent)' : 'var(--land)'
      })
      .attr('stroke', 'var(--land-stroke)')
      .attr('stroke-width', 0.5)
      .attr('opacity', (d: any) => {
        if (selectedCountries.length === 0) return 1
        const countryName = d.properties?.name || ''
        return selectedCountries.includes(countryName) ? 1 : 0.3
      })
      .style('cursor', 'pointer')
      .style('transition', 'all 0.2s ease')
      .on('mouseenter', function(event, d: any) {
        if (selectedCountries.length === 0) {
          d3.select(this)
            .attr('fill', 'var(--color-accent)')
            .attr('opacity', 0.8)
        }
      })
      .on('mouseleave', function(event, d: any) {
        if (selectedCountries.length === 0) {
          d3.select(this)
            .attr('fill', 'var(--land)')
            .attr('opacity', 1)
        }
      })
      .on('click', function(event, d: any) {
        if (onCountryClick) {
          onCountryClick(d.properties?.name || '')
        }
      })
      .append('title')
      .text((d: any) => d.properties?.name || '')

    const labelsGroup = svg.append('g').attr('class', 'labels')

    const updateLabels = () => {
      labelsGroup.selectAll('text').remove()

      labelsGroup.selectAll('text')
        .data(countriesGeoJSON.features)
        .enter()
        .append('text')
        .attr('class', 'country-label')
        .each(function(d: any) {
          const centroid = path.centroid(d)
          const coordinates = d3.geoCentroid(d)
          const distance = d3.geoDistance(coordinates, projection.invert!([width / 2, height / 2]))
          
          if (distance > 1.57) {
            d3.select(this).attr('opacity', 0)
            return
          }

          const countryName = d.properties?.name || ''
          const scale = currentScaleRef.current / radius
          let fontSize = Math.max(8, Math.min(12, 10 * scale))
          
          if (selectedCountries.includes(countryName)) {
            fontSize = Math.max(10, Math.min(16, 14 * scale))
          }

          d3.select(this)
            .attr('x', centroid[0])
            .attr('y', centroid[1])
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', `${fontSize}px`)
            .attr('font-weight', selectedCountries.includes(countryName) ? '600' : '500')
            .attr('fill', selectedCountries.includes(countryName) ? 'var(--color-accent-foreground)' : 'var(--color-foreground)')
            .attr('opacity', selectedCountries.length === 0 ? 0.7 : (selectedCountries.includes(countryName) ? 1 : 0.4))
            .attr('pointer-events', 'none')
            .style('text-shadow', '0 0 3px var(--color-background), 0 0 3px var(--color-background), 0 0 3px var(--color-background)')
            .text(countryName)
        })
    }

    labelsUpdateRef.current = updateLabels
    updateLabels()

    let rotation: [number, number] = rotationRef.current

    const zoom = d3.zoom()
      .scaleExtent([radius * 0.8, radius * 2])
      .on('zoom', (event) => {
        if (event.sourceEvent && event.sourceEvent.type === 'wheel') {
          currentScaleRef.current = event.transform.k
          projection.scale(event.transform.k)
          g.selectAll('path').attr('d', path as any)
          svg.select('.ocean').attr('d', path as any)
          updateLabels()
        }
      })

    zoomBehaviorRef.current = zoom
    svg.call(zoom as any)

    const drag = d3.drag()
      .on('drag', (event) => {
        const rotate = projection.rotate()
        const k = 75 / projection.scale()
        rotation = [rotate[0] + event.dx * k, rotate[1] - event.dy * k]
        rotation[1] = Math.max(-90, Math.min(90, rotation[1]))
        rotationRef.current = rotation
        projection.rotate(rotation)
        g.selectAll('path').attr('d', path as any)
        svg.select('.ocean').attr('d', path as any)
        updateLabels()
      })

    svg.call(drag as any)

    const autoRotate = d3.interval(() => {
      rotation[0] += 0.2
      rotationRef.current = rotation
      projection.rotate(rotation)
      g.selectAll('path').attr('d', path as any)
      svg.select('.ocean').attr('d', path as any)
      updateLabels()
    }, 50)

    let isAutoRotating = true

    svg.on('mousedown.autorotate', () => {
      isAutoRotating = false
      autoRotate.stop()
    })

    return () => {
      autoRotate.stop()
    }
  }, [worldData, dimensions, selectedCountries, onCountryClick])

  return (
    <svg
      ref={svgRef}
      className={className}
      width={dimensions.width}
      height={dimensions.height}
      style={{ cursor: 'grab' }}
    />
  )
})

Globe.displayName = 'Globe'