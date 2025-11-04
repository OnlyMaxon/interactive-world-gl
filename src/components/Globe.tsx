import { useRef, useImperativeHandle, forwardRef, useCallback, useEffect, useMemo } from 'react'
import * as d3 from 'd3'
import { feature } from 'topojson-client'
import { useGlobeData } from '@/hooks/use-globe-data'
import { useDimensions } from '@/hooks/use-dimensions'
import { createGeoInterpolator, generateFlightPaths, isPointVisible } from '@/lib/globe-utils'
import { GlobeLoader } from '@/components/GlobeLoader'
import type { FeatureCollection } from 'geojson'

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
  const { worldData, isLoading } = useGlobeData()
  const dimensions = useDimensions(svgRef)
  
  const projectionRef = useRef<d3.GeoProjection | null>(null)
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const scaleRef = useRef<number>(0)
  const rotationRef = useRef<[number, number, number]>([0, 0, 0])
  const autoRotateTimerRef = useRef<d3.Timer | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)
  const isZoomingRef = useRef(false)

  const countriesGeoJSON = useMemo(() => {
    if (!worldData) return null
    const geoJSON = feature(worldData, worldData.objects.countries as any)
    return geoJSON as unknown as FeatureCollection
  }, [worldData])

  const radius = useMemo(() => {
    return Math.min(dimensions.width, dimensions.height) / 2.5
  }, [dimensions])

  const updateGlobe = useCallback((
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    projection: d3.GeoProjection,
    path: d3.GeoPath
  ) => {
    svg.select<SVGPathElement>('.ocean').attr('d', path as any)
    svg.select('g.countries').selectAll<SVGPathElement, any>('path').attr('d', path as any)
  }, [])

  const updateLabels = useCallback((
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    projection: d3.GeoProjection,
    path: d3.GeoPath,
    features: any[]
  ) => {
    const labelsGroup = svg.select('g.labels')
    const center: [number, number] = [dimensions.width / 2, dimensions.height / 2]
    const scale = scaleRef.current / radius

    labelsGroup.selectAll<SVGTextElement, any>('text')
      .data(features)
      .join('text')
      .each(function(d: any) {
        const centroid = path.centroid(d)
        const coordinates = d3.geoCentroid(d)
        const visible = isPointVisible(coordinates, projection, center)
        const countryName = d.properties?.name || ''
        const isSelected = selectedCountries.includes(countryName)
        
        let fontSize = Math.max(8, Math.min(12, 10 * scale))
        if (isSelected) {
          fontSize = Math.max(10, Math.min(16, 14 * scale))
        }

        d3.select(this)
          .attr('x', centroid[0])
          .attr('y', centroid[1])
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', `${fontSize}px`)
          .attr('font-weight', isSelected ? '600' : '500')
          .attr('fill', isSelected ? 'var(--color-accent-foreground)' : 'var(--color-foreground)')
          .attr('opacity', visible ? (selectedCountries.length === 0 ? 0.7 : (isSelected ? 1 : 0.4)) : 0)
          .attr('pointer-events', 'none')
          .style('text-shadow', '0 0 3px var(--color-background), 0 0 3px var(--color-background)')
          .text(countryName)
      })
  }, [dimensions, radius, selectedCountries])

  const updateFlightPaths = useCallback((
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    projection: d3.GeoProjection,
    features: any[]
  ) => {
    const flightPathsGroup = svg.select('g.flight-paths')
    
    if (selectedCountries.length < 2) {
      flightPathsGroup.selectAll('*').remove()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      return
    }

    const selectedFeatures = features.filter((f: any) => 
      selectedCountries.includes(f.properties?.name || '')
    )

    const countryCoordinates = selectedFeatures.map((f: any) => ({
      name: f.properties?.name,
      coords: d3.geoCentroid(f)
    }))

    const flightPaths = generateFlightPaths(countryCoordinates)
    const pathGenerator = d3.geoPath().projection(projection)
    const center: [number, number] = [dimensions.width / 2, dimensions.height / 2]

    const arcPointsMap = flightPaths.map((d: any) => createGeoInterpolator(d.from, d.to))

    flightPathsGroup.selectAll('path')
      .data(flightPaths, (d: any) => `${d.fromName}-${d.toName}`)
      .join(
        enter => enter.append('path')
          .datum((d, i) => ({ type: 'LineString', coordinates: arcPointsMap[i] } as any))
          .attr('d', pathGenerator as any)
          .attr('fill', 'none')
          .attr('stroke', 'var(--color-accent)')
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0.4)
          .style('pointer-events', 'none')
          .each(function() {
            const totalLength = (this as SVGPathElement).getTotalLength()
            d3.select(this)
              .attr('stroke-dasharray', totalLength + ' ' + totalLength)
              .attr('stroke-dashoffset', totalLength)
              .transition()
              .duration(2000)
              .ease(d3.easeQuadInOut)
              .attr('stroke-dashoffset', 0)
              .on('end', function() {
                d3.select(this).attr('stroke-dasharray', '5,5')
              })
          }),
        update => update,
        exit => exit.remove()
      )
    
    flightPathsGroup.selectAll<SVGCircleElement, any>('circle')
      .data(flightPaths, (d: any) => `${d.fromName}-${d.toName}`)
      .join(
        enter => enter.append('circle')
          .attr('r', 3)
          .attr('fill', 'var(--color-accent)')
          .attr('stroke', 'var(--color-background)')
          .attr('stroke-width', 1.5)
          .style('filter', 'drop-shadow(0 0 4px var(--color-accent))')
          .style('pointer-events', 'none')
          .attr('opacity', 0),
        update => update,
        exit => exit.remove()
      )

    const animateMarkers = () => {
      const now = Date.now()
      
      flightPathsGroup.selectAll<SVGCircleElement, any>('circle')
        .each(function(d: any, i: number) {
          const path = flightPaths[i]
          if (!path) return
          
          const arcPoints = createGeoInterpolator(path.from, path.to)
          const duration = 3000
          const offset = i * 300
          const progress = ((now + offset) % duration) / duration
          
          const point = arcPoints[Math.floor(progress * (arcPoints.length - 1))]
          const projected = projection(point)
          
          if (projected && isPointVisible(point, projection, center)) {
            d3.select(this)
              .attr('cx', projected[0])
              .attr('cy', projected[1])
              .attr('opacity', 0.9)
          } else {
            d3.select(this).attr('opacity', 0)
          }
        })
      
      if (selectedCountries.length >= 2) {
        animationFrameRef.current = requestAnimationFrame(animateMarkers)
      }
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    animateMarkers()
  }, [selectedCountries, dimensions, radius])

  useEffect(() => {
    if (!svgRef.current || !countriesGeoJSON) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const projection = d3.geoOrthographic()
      .scale(radius)
      .translate([dimensions.width / 2, dimensions.height / 2])
      .clipAngle(90)
      .rotate(rotationRef.current)

    projectionRef.current = projection
    scaleRef.current = radius

    const path = d3.geoPath().projection(projection)

    svg.append('path')
      .datum({ type: 'Sphere' } as any)
      .attr('class', 'ocean')
      .attr('d', path as any)
      .attr('fill', 'var(--ocean)')
      .attr('stroke', 'none')

    const countriesGroup = svg.append('g').attr('class', 'countries')
    const flightPathsGroup = svg.append('g').attr('class', 'flight-paths')
    const labelsGroup = svg.append('g').attr('class', 'labels')

    countriesGroup.selectAll('path')
      .data(countriesGeoJSON.features)
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        const countryName = d.properties?.name || ''
        if (selectedCountries.length === 0) return 'var(--land)'
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
          d3.select(this).attr('fill', 'var(--color-accent)').attr('opacity', 0.8)
        }
      })
      .on('mouseleave', function(event, d: any) {
        if (selectedCountries.length === 0) {
          d3.select(this).attr('fill', 'var(--land)').attr('opacity', 1)
        }
      })
      .on('click', function(event, d: any) {
        if (onCountryClick) {
          onCountryClick(d.properties?.name || '')
        }
      })
      .append('title')
      .text((d: any) => d.properties?.name || '')

    updateLabels(svg, projection, path, countriesGeoJSON.features)
    updateFlightPaths(svg, projection, countriesGeoJSON.features)

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([radius * 0.8, radius * 2.5])
      .on('start', () => {
        isZoomingRef.current = true
      })
      .on('zoom', (event) => {
        if (event.sourceEvent?.type === 'wheel') {
          scaleRef.current = event.transform.k
          projection.scale(event.transform.k)
          updateGlobe(svg, projection, path)
          updateLabels(svg, projection, path, countriesGeoJSON.features)
          updateFlightPaths(svg, projection, countriesGeoJSON.features)
        }
      })
      .on('end', () => {
        isZoomingRef.current = false
      })

    zoomBehaviorRef.current = zoom
    svg.call(zoom).on('wheel.zoom', zoom.wheel)

    const drag = d3.drag<SVGSVGElement, unknown>()
      .on('start', () => {
        isDraggingRef.current = true
      })
      .on('drag', (event) => {
        const rotate = projection.rotate()
        const k = 75 / projection.scale()
        const rotation: [number, number, number] = [
          rotate[0] + event.dx * k,
          Math.max(-90, Math.min(90, rotate[1] - event.dy * k)),
          rotate[2]
        ]
        rotationRef.current = rotation
        projection.rotate(rotation)
        updateGlobe(svg, projection, path)
        updateLabels(svg, projection, path, countriesGeoJSON.features)
        updateFlightPaths(svg, projection, countriesGeoJSON.features)
      })
      .on('end', () => {
        isDraggingRef.current = false
      })

    svg.call(drag)

    autoRotateTimerRef.current = d3.interval(() => {
      if (!isDraggingRef.current && !isZoomingRef.current) {
        const currentRotation = rotationRef.current
        rotationRef.current = [currentRotation[0] + 0.2, currentRotation[1], currentRotation[2]]
        projection.rotate(rotationRef.current)
        updateGlobe(svg, projection, path)
        updateLabels(svg, projection, path, countriesGeoJSON.features)
        updateFlightPaths(svg, projection, countriesGeoJSON.features)
      }
    }, 50)

    return () => {
      if (autoRotateTimerRef.current) {
        autoRotateTimerRef.current.stop()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [countriesGeoJSON, dimensions, radius, updateGlobe, updateLabels, updateFlightPaths])

  useEffect(() => {
    if (!svgRef.current || !countriesGeoJSON || !projectionRef.current) return

    const svg = d3.select(svgRef.current)
    const projection = projectionRef.current
    const path = d3.geoPath().projection(projection)

    svg.select('g.countries').selectAll<SVGPathElement, any>('path')
      .attr('fill', (d: any) => {
        const countryName = d.properties?.name || ''
        if (selectedCountries.length === 0) return 'var(--land)'
        return selectedCountries.includes(countryName) ? 'var(--color-accent)' : 'var(--land)'
      })
      .attr('opacity', (d: any) => {
        if (selectedCountries.length === 0) return 1
        const countryName = d.properties?.name || ''
        return selectedCountries.includes(countryName) ? 1 : 0.3
      })

    updateLabels(svg, projection, path, countriesGeoJSON.features)
    updateFlightPaths(svg, projection, countriesGeoJSON.features)
  }, [selectedCountries, countriesGeoJSON, updateLabels, updateFlightPaths])

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (svgRef.current && zoomBehaviorRef.current) {
        d3.select(svgRef.current)
          .transition()
          .duration(300)
          .call(zoomBehaviorRef.current.scaleBy, 1.3)
      }
    },
    zoomOut: () => {
      if (svgRef.current && zoomBehaviorRef.current) {
        d3.select(svgRef.current)
          .transition()
        scaleRef.current = radius
          .call(zoomBehaviorRef.current.scaleBy, 0.7)
      }
    },
    resetView: () => {
      if (svgRef.current && projectionRef.current && zoomBehaviorRef.current) {
        rotationRef.current = [0, 0, 0]
        projectionRef.current.rotate([0, 0, 0])
        scaleRef.current = radius
        
        d3.select(svgRef.current)
          .transition()
          .duration(800)
          .call(zoomBehaviorRef.current.transform, d3.zoomIdentity.scale(radius))
      }
    }
  }))

  if (isLoading || !countriesGeoJSON) {
    return <GlobeLoader />
  }

  return (
    <svg
      ref={svgRef}
      className={className}
      width={dimensions.width}
      height={dimensions.height}
      style={{ cursor: isDraggingRef.current ? 'grabbing' : 'grab' }}
    />
  )
})

Globe.displayName = 'Globe'
