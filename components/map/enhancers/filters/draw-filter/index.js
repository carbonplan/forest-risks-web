import { useState, useEffect, useCallback } from 'react'
import * as turf from '@turf/turf'
import { Box, Button, useThemeUI } from 'theme-ui'
import DrawingBoard from './drawing-board'
import { Instructions, Section } from '../instructions'

export default function DrawFilter({ map, onChangeRegion }) {
  const context = useThemeUI()

  const [startingPoint, setStartingPoint] = useState(null)
  const [showClearButton, setShowClearButton] = useState(false)

  useEffect(function init() {
    onChangeRegion(null)

    map.addSource('draw', {
      type: 'geojson',
      data: null,
    })

    map.addLayer({
      id: 'draw/line',
      source: 'draw',
      type: 'line',
      paint: {
        'line-width': 3.0,
      },
    })

    const startDrawing = (e) => {
      clearSelection()
      setStartingPoint(e.originalEvent)
    }

    map.on('contextmenu', startDrawing)

    return function cleanup() {
      map.off('contextmenu', startDrawing)
      map.removeLayer('draw/line')
      map.removeSource('draw')
    }
  }, [])

  useEffect(
    function setLineColor() {
      map.setPaintProperty(
        'draw/line',
        'line-color',
        context.theme.colors.primary
      )
    },
    [context]
  )

  const handlePoints = useCallback((points) => {
    if (points.length < 4) {
      setStartingPoint(null)
      return
    }

    const lngLats = points.map((p) => map.unproject(p).toArray())
    const region = turf.polygon([lngLats])
    // OR
    // const region = unkinkAndCombine(map, points)
    // OR
    // const region = unkinkAndUnion(map, points)

    region.properties = { source: 'carbonplan.org' }
    region.properties = { export: turf.featureCollection([turf.clone(region)]) }

    map.getSource('draw').setData(region)

    map.once('idle', () => {
      onChangeRegion(region)
      setStartingPoint(null)
      setShowClearButton(true)
    })
  }, [])

  const clearSelection = useCallback(() => {
    map.getSource('draw').setData(turf.featureCollection([]))
    onChangeRegion(null)
    setShowClearButton(false)
  }, [])

  return (
    <>
      <Instructions>
        <Section>
          <Box>right-click to start drawing</Box>
          <Box sx={{ marginY: '8px' }}>AND</Box>
          <Box sx={{ marginBottom: '2px' }}>click when you're done</Box>
        </Section>
        {showClearButton && (
          <Section sx={{ padding: '2px' }}>
            <Button onClick={clearSelection}>clear</Button>
          </Section>
        )}
      </Instructions>
      {startingPoint && (
        <DrawingBoard
          map={map}
          lineColor={context.theme.colors.primary}
          startingPoint={startingPoint}
          onComplete={handlePoints}
        />
      )}
    </>
  )
}

////////////// CLEANING GEOJSON /////////////

function dedupedPoints(points) {
  const out = []
  points.slice(0, -1).forEach((point) => {
    if (!out.find((p) => p.x === point.x && p.y === point.y)) out.push(point)
  })
  return [...out, points[points.length - 1]]
}

// does pretty well at getting the entirety of the region inside the outline
// returns a single MultiPolygon
function unkinkAndCombine(map, points) {
  const deduped = dedupedPoints(points)
  const lngLats = deduped.map((p) => map.unproject(p).toArray())
  const poly = turf.polygon([lngLats])
  const unkinked = turf.unkinkPolygon(poly)
  const combined = turf.combine(unkinked)
  return combined.features[0]
}

// even better at finding the outline
// returns either a Polygon or a MultiPolygon, depending on whether
// polygons are contiguous
function unkinkAndUnion(map, points) {
  const deduped = dedupedPoints(points)
  const lngLats = deduped.map((p) => map.unproject(p).toArray())
  const poly = turf.polygon([lngLats])
  const unkinked = turf.unkinkPolygon(poly)
  const union = turf.union.apply(null, unkinked.features)
  return union
}
