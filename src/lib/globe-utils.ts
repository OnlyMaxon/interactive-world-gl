import * as d3 from 'd3'

export interface FlightPath {
  from: number[]
  to: number[]
  fromName: string
  toName: string
}

export function createGeoInterpolator(start: number[], end: number[], steps = 100): number[][] {
  const interpolator = d3.geoInterpolate(start, end)
  const points: number[][] = []
  for (let i = 0; i <= steps; i++) {
    points.push(interpolator(i / steps))
  }
  return points
}

export function generateFlightPaths(
  countryCoordinates: Array<{ name: string; coords: number[] }>
): FlightPath[] {
  const paths: FlightPath[] = []
  for (let i = 0; i < countryCoordinates.length; i++) {
    for (let j = i + 1; j < countryCoordinates.length; j++) {
      paths.push({
        from: countryCoordinates[i].coords,
        to: countryCoordinates[j].coords,
        fromName: countryCoordinates[i].name,
        toName: countryCoordinates[j].name
      })
    }
  }
  return paths
}

export function isPointVisible(
  point: number[],
  projection: d3.GeoProjection,
  center: [number, number]
): boolean {
  const centerPoint = projection.invert!(center)
  if (!centerPoint) return false
  const distance = d3.geoDistance(point, centerPoint)
  return distance < 1.57
}
