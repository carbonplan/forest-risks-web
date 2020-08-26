import { useEffect, useState, useRef, useCallback, useReducer } from 'react'
import CirclePicker from './circle-picker-svg'
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

  useEffect(() => onChangeRegion(circle), [circle])

  // useEffect(() => {
  //   const recenter = () => {
  //     map.panTo(circle.properties.center, { animate: true })
  //   }
  //   map.on('contextmenu', recenter)
  //   return function cleanup() {
  //     map.off('contextmenu', recenter)
  //   }
  // }, [circle])

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
        onSetRadius={(circle) => (circleRef.current = circle)}
        onDrag={(circle) => {
          setRadius(circle.properties.radius)
          if (UPDATE_STATS_ON_DRAG) setCircle(circle)
        }}
        onIdle={setCircle}
      />
      {!CIRCLE_STICKS_TO_CENTER && (
        <Instructions>
          <Section sx={{ padding: '2px 4px', cursor: 'grab' }}>
            <Box
              onClick={() =>
                map.panTo(circle.properties.center, { animate: true })
              }
              sx={{ cursor: 'pointer' }}
            >
              recenter
            </Box>
          </Section>
        </Instructions>
      )}
    </>
  )
}

export default CircleFilter
