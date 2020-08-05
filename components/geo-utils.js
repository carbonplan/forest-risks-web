import {
  circle as turfCircle,
  mask as turfMask,
  destination as turfDestination,
  distance as turfDistance,
  booleanPointInPolygon,
} from '@turf/turf'

export function circle(
  center,
  radius = 1,
  options = { units: 'miles', steps: 128 }
) {
  const c = turfCircle([center.lng, center.lat], radius, options)
  c.properties = {
    type: 'Circle',
    center,
    radius,
  }
  return c
}

export function mask(poly, outline) {
  return turfMask(poly, outline)
}

export function destination(
  origin,
  distance,
  bearing,
  options = { units: 'miles' }
) {
  return turfDestination([origin.lng, origin.lat], distance, bearing, options)
}

export function distance(from, to, options = { units: 'miles' }) {
  return turfDistance([from.lng, from.lat], [to.lng, to.lat], options)
}

export function isPointInPolygon(point, poly) {
  return booleanPointInPolygon(point, poly)
}
