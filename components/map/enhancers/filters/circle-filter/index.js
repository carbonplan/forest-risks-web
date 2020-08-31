import { useEffect, useState, useRef, useCallback } from 'react'
import CirclePicker from './circle-picker-svg'
import { UPDATE_STATS_ON_DRAG } from '@constants'
import * as turf from '@turf/turf'

function getInitialRadius(map) {
  const bounds = map.getBounds().toArray()
  const dist = turf.distance(bounds[0], bounds[1], { units: 'miles' })
  return Math.min(Math.round(dist / 15), 300)
}

function CircleFilter({
  map,
  onChangeRegion = () => {},
  onChangeReset = () => {}
}) {
  const initialCenter = useRef(map.getCenter())
  const initialRadius = useRef(getInitialRadius(map))
  const initialZoom = useRef(map.getZoom())
  const initialBounds = useRef(map.getBounds())

  const animating = useRef(false)

  const [center, setCenter] = useState(initialCenter.current)
  const [bounds, setBounds] = useState(initialBounds.current)

  useEffect(() => {
    onChangeReset(() => {
      animating.current = true
      onChangeReset(null)

      map.easeTo({
        center: center,
        zoom: initialZoom.current,
      })
      map.once('moveend', () => animating.current = false)
    })
  }, [center, bounds])

  useEffect(() => {
    const onMoveEnd = () => {
      if (!animating.current) setBounds(map.getBounds())
    }
    map.on('moveend', onMoveEnd)
    return function cleanup() {
      map.off('moveend', onMoveEnd)
    }
  }, [])

  const handleCircle = useCallback((circle) => {
    if (!circle) return
    onChangeRegion(circle)
    setCenter(circle.properties.center)
  }, [])

  return (
    <CirclePicker
      map={map}
      center={initialCenter.current}
      radius={initialRadius.current}
      onDrag={UPDATE_STATS_ON_DRAG ? handleCircle : undefined}
      onIdle={handleCircle}
    />
  )
}

export default CircleFilter
