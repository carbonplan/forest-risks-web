import { useEffect, useState, useRef } from 'react'
import CirclePicker from './circle-picker-svg'
import RadiusSlider from './radius-slider'
import {
  INITIAL_RADIUS,
  INITIAL_ZOOM,
  UPDATE_STATS_ON_DRAG,
  UPDATE_STATS_ON_ZOOM,
} from '@constants'

function CircleFilter({ map, onChangeRegion = () => {} }) {
  const circleRef = useRef(null)

  const [circle, setCircle] = useState(null)
  const [zoom, setZoom] = useState(map.getZoom())
  const [center, setCenter] = useState(map.getCenter())
  const [radius, setRadius] = useState(INITIAL_RADIUS)

  // add zoom handler
  useEffect(() => {
    const onZoomEnd = UPDATE_STATS_ON_ZOOM
      ? () => setZoom(map.getZoom())
      : () => {}

    map.on('zoomend', onZoomEnd)

    return function cleanup() {
      map.off('zoomend', onZoomEnd)
    }
  }, [])

  // update stats when zoom or circle changes
  useEffect(() => onChangeRegion(circle), [zoom, circle])

  return (
    <>
      <RadiusSlider
        value={radius}
        onChange={setRadius}
        onIdle={() => setCircle(circleRef.current)}
      />
      <CirclePicker
        map={map}
        center={center}
        radius={radius}
        onSetRadius={(circle) => (circleRef.current = circle)}
        onDrag={(circle) => {
          setRadius(circle.properties.radius)
          if (UPDATE_STATS_ON_DRAG) setCircle(circle)
        }}
        onIdle={setCircle}
      />
    </>
  )
}

export default CircleFilter
