import { bbox, booleanPointInPolygon, distance } from '@utils/turf'
import pointInPolygon from 'point-in-polygon'
import { DEDUPE_ON_FILTER, filterTypes } from '@constants'

// dedupe points by lat and lon
function dedupedPoints(points) {
  const deduped = []

  points.forEach((point) => {
    const duplicatePoint = deduped.find(
      (d) =>
        d.properties.lat === point.properties.lat &&
        d.properties.lon === point.properties.lon
    )

    if (duplicatePoint) console.log('duplicate point!')
    else deduped.push(point)
  })

  return deduped
}

/*
These are two implementations of the getSelectedData function, which
extracts data from the map for points lying within a selected region.
The first implementation uses queryRenderedFeatures and the second
uses querySourceFeatures.
*/

////////////// queryRenderedFeatures ////////////////

// convert a lng/lat box to x/y coords
function geoBoxToScreenBox(map, geoBox) {
  const southWest = map.project([geoBox[0], geoBox[1]])
  const northEast = map.project([geoBox[2], geoBox[3]])
  return [
    [southWest.x, southWest.y],
    [northEast.x, northEast.y],
  ]
}

// clamp screenBox to boundaries of viewport
function clampedScreenBox(map, screenBox) {
  const { width, height } = map.getContainer().getBoundingClientRect()
  return [
    [Math.max(screenBox[0][0], 0), Math.min(screenBox[0][1], height)],
    [Math.min(screenBox[1][0], width), Math.max(screenBox[1][1], 0)],
  ]
}

//// Three ways to filter by region ////

function turfPointsInPolygon(points, polygon) {
  return points.filter((p) => booleanPointInPolygon(p, polygon))
}

function substackPointsInPolygon(points, polygon) {
  const poly = polygon.geometry.coordinates[0]
  return points.filter((p) => pointInPolygon(p.geometry.coordinates, poly))
}

function turfPointsInCircle(points, circle) {
  const { radius } = circle.properties
  const { lng, lat } = circle.properties.center
  return points.filter((p) =>
    distance(p.geometry.coordinates, [lng, lat], { units: 'miles' }) <= radius
  )
}

//// Comparison ////

/*
Test three ways to filter points by region:
  (1) turf's booleanPointInPolygon
  (2) substack's pointInPolygon
  (3) turf's distance formula (only works if region is a circle)
*/
// function getPointsInRegion(points, region) {
//   let start, out, duration
//
//   start = performance.now()
//   out = turfPointsInPolygon(points, region)
//   duration = performance.now() - start
//   console.log('turf', 'points:', out.length, 'duration:', duration)
//
//   start = performance.now()
//   out = substackPointsInPolygon(points, region)
//   duration = performance.now() - start
//   console.log('substack', 'points:', out.length, 'duration:', duration)
//
//   start = performance.now()
//   out = turfPointsInCircle(points, region)
//   duration = performance.now() - start
//   console.log('circle', 'points:', out.length, 'duration:', duration)
//
//   console.log(' ')
//   return []
// }

/*
  Results of comparison: substack is faster than turf, and the two always
  produce the same number of points. Problem is, substack can't handle
  multipolygons. Maybe work on this if performance turns out to be
  important.

  Filtering by distance-from-center is faster than both, but only works
  if the region is a circle. It yields a slightly larger number of points,
  but is actually more accurate in that it uses a geodesic circle rather
  than the geojson approximation (a regular polygon with many sides).

  Therefore:
*/
function getPointsInRegion(points, region) {
  if (region.properties.type === filterTypes.CIRCLE)
    return turfPointsInCircle(points, region)
  else
    return turfPointsInPolygon(points, region)
}

/*
First filter points by putting a bounding box around the selectedRegion
and using it in queryRenderedFeatures. (The function requires an x/y
bounding box, not a lngLat bounding box. And that box has to be clamped
to the size of the viewport, otherwise queryRenderedFeatures will sometimes
-- but not always -- include points that are outside the visible area).

Then filter again by checking whether each point is in the selectedRegion.
*/
function getFilteredPoints(map, layer, selectedRegion) {
  const geoBox = bbox(selectedRegion)
  const screenBox = geoBoxToScreenBox(map, geoBox)
  const clampedBox = clampedScreenBox(map, screenBox)
  const points = map.queryRenderedFeatures(clampedBox, { layers: [layer] })
  return getPointsInRegion(points, selectedRegion)
}

// get metadata on the selectedRegion plus, for each layer, and array
// of the points in the selectedRegion
export function getSelectedData(map, layers, selectedRegion) {
  if (!selectedRegion) return null

  const selectedData = {
    region: selectedRegion.properties,
    points: {},
  }

  layers.forEach((layer) => {
    let points =
      selectedRegion.properties.type === filterTypes.VIEWPORT
        ? map.queryRenderedFeatures({ layers: [layer] })
        : getFilteredPoints(map, layer, selectedRegion)

    if (DEDUPE_ON_FILTER) points = dedupedPoints(points)

    selectedData.points[layer] = points
  })

  return selectedData
}

/////////////// querySourceFeatures ///////////////

// export function getSelectedData(map, layers, selectedRegion) {
//   const selectedData = {
//     region: selectedRegion
//       ? selectedRegion.properties
//       : { type: 'Viewport', bounds: map.getBounds().toArray() },
//     points: {}
//   }
//
//   layers.forEach(layer => {
//     let points = map.querySourceFeatures(layer, { sourceLayer: layer })
//
//     points = selectedRegion
//       ? points.filter((p) => isPointInPolygon(p, selectedRegion))
//       : points
//
//     if (DEDUPE_ON_FILTER) points = dedupedPoints(points)
//
//     selectedData.points[layer] = points
//   })
//
//   return selectedData
// }
