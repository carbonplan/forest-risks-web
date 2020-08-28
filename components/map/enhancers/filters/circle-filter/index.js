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
      <CirclePicker
        map={map}
        center={center}
        radius={radius}
        onDrag={UPDATE_STATS_ON_DRAG ? setCircle : undefined}
        onIdle={setCircle}
      />
      <Instructions>
        <Section sx={{ padding: '2px 4px', cursor: 'grab' }}>
          <Box
            onClick={() =>
              // map.panTo(circle.properties.center, { animate: true })
              map.fitBounds(boundingBox(circle), { padding: {
                top: 300,
                bottom: 300,
              }})
            }
            sx={{ cursor: 'pointer' }}
          >
            recenter
          </Box>
        </Section>
      </Instructions>
    </>
  )
}

export default CircleFilter
