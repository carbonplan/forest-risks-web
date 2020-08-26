import * as d3 from 'd3'

import {
  circle as turfCircle,
  mask as turfMask,
  destination as turfDestination,
  distance as turfDistance,
  booleanPointInPolygon,
  bbox,
  rewind,
} from '@turf/turf'

export function circle(
  center,
  radius = 1,
  options = { units: 'miles', steps: 64 }
) {
  const c = turfCircle([center.lng, center.lat], radius, {
    ...options,
    properties: {
      center,
      radius,
    },
  })

  // need to rewind or svg fill is inside-out
  return rewind(c, { reverse: true, mutate: true })
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

// returns southwest/northeast corners as [lng, lat]
export function boundingBox(poly) {
  const bounds = bbox(poly)
  return [
    [bounds[0], bounds[1]],
    [bounds[2], bounds[3]],
  ]
}

// returns a function that converts a geojson feature to an svg path
// this basically ties d3 to mapbox
// 512 is the size of mapbox tiles
// adapted from http://bl.ocks.org/enjalot/0d87f32a1ccb9a720d29ba74142ba365
// export function getPathMaker(map) {
//   const { width, height } = map.getContainer().getBoundingClientRect()
//   const center = map.getCenter()
//   const zoom = map.getZoom()
//   const scale = ((512 * 0.5) / Math.PI) * Math.pow(2, zoom)
//
//   const projection = d3
//     .geoMercator()
//     .center([center.lng, center.lat])
//     .translate([width / 2, height / 2])
//     .scale(scale)
//
//   return d3.geoPath(projection)
// }

// an alternate version adapted from here:
// https://bl.ocks.org/shimizu/5f4cee0fddc7a64b55a9
// this one allows 3-dimensional rotation of the map
// not sure about performance differences between the two
export function getPathMaker(map) {
  const transform = d3.geoTransform({
    point: function (lng, lat) {
      const point = map.project([lng, lat])
      this.stream.point(point.x, point.y)
    },
  })
  return d3.geoPath().projection(transform)
}
