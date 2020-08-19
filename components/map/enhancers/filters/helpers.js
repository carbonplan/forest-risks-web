import { isPointInPolygon, boundingBox } from '@utils'
import { DEDUPE_ON_FILTER } from '@constants'

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

// convert a lng/lat bounding box to x/y coords
function bboxToScreenCoords(map, bbox) {
  const southWest = map.project(bbox[0])
  const northEast = map.project(bbox[1])
  return [
    [southWest.x, southWest.y],
    [northEast.x, northEast.y],
  ]
}

// First filter points by putting a bounding box around the selectedRegion
// and using it in queryRenderedFeatures. Then filter again by checking
// whether each point is in the selectedRegion.
function getFilteredPoints(map, layer, selectedRegion) {
  const bbox = boundingBox(selectedRegion)
  const screenBbox = bboxToScreenCoords(map, bbox)
  const points = map.queryRenderedFeatures(screenBbox, { layers: [layer] })
  return points.filter((p) => isPointInPolygon(p, selectedRegion))
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
    let points = selectedRegion.properties.type === 'Viewport'
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
