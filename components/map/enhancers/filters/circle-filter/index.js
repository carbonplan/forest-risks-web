import { useEffect, useState, useRef } from 'react'
import CirclePicker from './circle-picker-svg'
import RadiusSlider from './radius-slider'
import { INITIAL_RADIUS, UPDATE_STATS_ON_DRAG } from '@constants'

function CircleFilter({ map, onChangeRegion = () => {} }) {
  const circleRef = useRef(null)

  const [circle, setCircle] = useState(null)
  const [center, setCenter] = useState(map.getCenter())
  const [radius, setRadius] = useState(INITIAL_RADIUS)

  useEffect(() => onChangeRegion(circle), [circle])

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
