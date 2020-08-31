import { useEffect, useState, useRef, useCallback, useReducer } from 'react'
import CirclePicker from './circle-picker-svg'
import { UPDATE_STATS_ON_DRAG } from '@constants'
import * as turf from '@turf/turf'
import { boundingBox } from '@utils'
import { Instructions, Section } from '../instructions'
import { Box } from 'theme-ui'

function initialRadius(map) {
  const bounds = map.getBounds().toArray()
  const dist = turf.distance(bounds[0], bounds[1], { units: 'miles' })
  return Math.min(Math.round(dist / 15), 300)
}

function CircleFilter({ map, onChangeRegion = () => {}, onChangeReset = () => {} }) {
  const circleRef = useRef(null)
  const initialZoom = useRef(map.getZoom())
  const firstRun = useRef(true)
  const prevCircle = useRef(null)
  const animating = useRef(false)

  const [circle, setCircle] = useState(null)
  const [center, setCenter] = useState(map.getCenter())
  const [radius, setRadius] = useState(initialRadius(map))
  const [bounds, setBounds] = useState(map.getBounds())

  useEffect(() => {
    if (firstRun.current) return
    onChangeRegion(circle)
  }, [circle])

  useEffect(() => {
    if (firstRun.current) return

    if (
      !prevCircle.current ||
      prevCircle.current.properties.radius !== circle.properties.radius
    ) {
      onChangeReset(null)
      prevCircle.current = circle
      return
    }

    const reset = () => {
      animating.current = true
      onChangeReset(null)

      map.easeTo({
        center: circle.properties.center,
        zoom: initialZoom.current,
      })
      map.once('moveend', () => animating.current = false)
    }
    onChangeReset(reset)
  }, [circle, bounds])

  useEffect(() => {
    const onMoveEnd = () => {
      if (!animating.current) setBounds(map.getBounds())
    }
    map.on('moveend', onMoveEnd)
    return function cleanup() {
      map.off('moveend', onMoveEnd)
    }
  }, [])

  useEffect(() => { firstRun.current = false }, [])

  return (
    <CirclePicker
      map={map}
      center={center}
      radius={radius}
      onDrag={UPDATE_STATS_ON_DRAG ? setCircle : undefined}
      onIdle={setCircle}
    />
  )
}

export default CircleFilter
