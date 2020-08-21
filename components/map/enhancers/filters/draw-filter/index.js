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

  useEffect(function setLineColor() {
    map.setPaintProperty(
      'draw/line',
      'line-color',
      context.theme.colors.primary
    )
  }, [context])

  const handlePoints = useCallback((points) => {
    points = points.map(p => map.unproject(p).toArray())

    if (points.length < 4) {
      setStartingPoint(null)
      return
    }

    const region = turf.polygon([points], {
      source: 'carbonplan.org',
    })

    region.properties = {
      export: turf.featureCollection([JSON.parse(JSON.stringify(region))])
    }

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
            <Button onClick={clearSelection}>
              clear
            </Button>
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
