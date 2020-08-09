import { useEffect, useState, useRef } from 'react'
import CirclePicker from './circle-picker'
import CircleButton from './circle-button'
import RadiusSlider from './radius-slider'
import { getSelectedData } from './helpers'
import {
  INITIAL_CENTER,
  INITIAL_RADIUS,
  INITIAL_ZOOM,
  UPDATE_STATS_ON_DRAG,
  UPDATE_STATS_ON_ZOOM,
} from '../../settings'

function CircleFilter({ map, options, onChangeSelectedData }) {
  const initialized = useRef(false)
  const circleRef = useRef(null)

  const [showCircle, setShowCircle] = useState(true)
  const [circle, setCircle] = useState(null)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)
  const [bounds, setBounds] = useState(null)
  const [radius, setRadius] = useState(INITIAL_RADIUS)

  // add zoom/move handler
  useEffect(() => {
    const onZoomEnd = UPDATE_STATS_ON_ZOOM
      ? () => setZoom(map.getZoom())
      : () => {}

    const onMoveEnd = () => setBounds(map.getBounds())

    if (showCircle) map.on('zoomend', onZoomEnd)
    else map.on('moveend', onMoveEnd)

    return function cleanup() {
      if (showCircle) map.off('zoomend', onZoomEnd)
      else map.off('moveend', onMoveEnd)
    }
  }, [showCircle])

  // update stats when zoom, bounds, options, or circle changes
  useEffect(() => {
    // skip first run because circle isn't ready yet
    if (!initialized.current) {
      initialized.current = true
      return
    }

    const layers = Object.keys(options).filter((key) => options[key])
    const selectedData = getSelectedData(map, layers, circle)
    onChangeSelectedData(selectedData)
  }, [zoom, bounds, options, circle])

  return (
    <>
      <CircleButton
        onClick={() => {
          setShowCircle(!showCircle)
          setRadius(INITIAL_RADIUS)
        }}
      />
      {showCircle && (
        <>
          <RadiusSlider
            value={radius}
            onChange={setRadius}
            onIdle={() => setCircle(circleRef.current)}
          />
          <CirclePicker
            map={map}
            center={INITIAL_CENTER}
            radius={radius}
            onSetRadius={(circle) => (circleRef.current = circle)}
            onDrag={UPDATE_STATS_ON_DRAG ? setCircle : undefined}
            onIdle={setCircle}
          />
        </>
      )}
    </>
  )
}

export default CircleFilter
