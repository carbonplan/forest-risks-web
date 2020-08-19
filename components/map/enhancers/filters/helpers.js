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

// convert a lng/lat box to x/y coords
function geoBoxToScreenBox(map, geoBox) {
  const southWest = map.project(geoBox[0])
  const northEast = map.project(geoBox[1])
  return [[
    southWest.x,
    southWest.y
  ], [
    northEast.x,
    northEast.y,
  ]]
}

// clamp screenBox to boundaries of viewport
function clampedScreenBox(map, screenBox) {
  const { width, height } = map.getContainer().getBoundingClientRect()
  return [[
    Math.max(screenBox[0][0], 0),
    Math.min(screenBox[0][1], height),
  ], [
    Math.min(screenBox[1][0], width),
    Math.max(screenBox[1][1], 0),
  ]]
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
  const geoBox = boundingBox(selectedRegion)
  const screenBox = geoBoxToScreenBox(map, geoBox)
  const clampedBox = clampedScreenBox(map, screenBox)
  const points = map.queryRenderedFeatures(clampedBox, { layers: [layer] })
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
