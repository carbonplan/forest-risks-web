import { useEffect, useState, useRef, useCallback, useReducer } from 'react'
import CirclePicker from './circle-picker-svg-shift'
import RadiusSlider from './radius-slider'
import { UPDATE_STATS_ON_DRAG, CIRCLE_STICKS_TO_CENTER } from '@constants'
import * as turf from '@turf/turf'
import { Instructions, Section } from '../instructions'
import { Box } from 'theme-ui'

function initialRadius(map) {
  const bounds = map.getBounds().toArray()
  const dist = turf.distance(bounds[0], bounds[1], { units: 'miles' })
  return Math.min(Math.round(dist / 15), 300)
}

function CircleFilter({ map, onChangeRegion = () => {} }) {
  const circleRef = useRef(null)

  const [circle, setCircle] = useState(null)
  const [center, setCenter] = useState(map.getCenter())
  const [radius, setRadius] = useState(initialRadius(map))
  const [centered, setCentered] = useState(true)

  useEffect(() => onChangeRegion(circle), [circle])

  useEffect(() => {
    const recenter = () => {
      //map.panTo(circle.properties.center, { animate: false })
      setRadius(initialRadius(map))
      setCenter(map.getCenter())
      setCentered(true)
    }
    map.on('contextmenu', recenter)
    return function cleanup() {
      map.off('contextmenu', recenter)
    }
  }, [circle])

  useEffect(() => {
    map.scrollZoom.disable()
    if (centered)
      map.scrollZoom.enable({ around: 'center' })
    else
      map.scrollZoom.enable()
  }, [centered])

  return (
    <>
      {/*<RadiusSlider
        value={radius}
        onChange={setRadius}
        onIdle={() => setCircle(circleRef.current)}
      />*/}
      <CirclePicker
        map={map}
        center={center}
        radius={radius}
        centered={centered}
        onSetRadius={(circle) => (circleRef.current = circle)}
        onDrag={(circle) => {
          setRadius(circle.properties.radius)
          if (UPDATE_STATS_ON_DRAG) setCircle(circle)
        }}
        onIdle={setCircle}
        onMoveCenter={(center) => setCentered(false)}
      />
      {!centered && (
        <Instructions>
          <Section sx={{ padding: '4px 8px' }}>
            right-click to recenter
          </Section>
        </Instructions>
      )}
    </>
  )
}

export default CircleFilter
