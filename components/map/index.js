import { useEffect, useState, useRef } from 'react'
import { Box } from 'theme-ui'
import mapboxgl from 'mapbox-gl'
import useTheme from './use-theme'
import useOptions from './use-options'
import style from './style'
import { RulerButton } from './ruler'
import CirclePicker from './circle-picker'
import CircleButton from './circle-button'
import RadiusSlider from './radius-slider'

mapboxgl.accessToken = ''

const INITIAL_CENTER = { lng: -100, lat: 40 }
const INITIAL_RADIUS = 300
const INITIAL_ZOOM = 3

/*
Set to true to update the sidebar stats while dragging the circle.
Morphocode does that well, but it's really laggy here because
we need to refilter all of the points every time the mouse moves.
*/
const UPDATE_STATS_ON_DRAG = false

/*
Set to true to update the sidebar stats when zoom changes.

If true, the sidebar stats are always consistent with the vector source
data (which changes based on zoom level). This solves the problem of
the occasional inconsistency between what you see in the circle and what's
shown in the sidebar. But it creates a different problem: the averages (and
counts) in the sidebar change based on zoom level, which doesn't really
make sense.

Note that we could avoid this whole issue by sending the forests and fires
to the client as geojson instead of baking them into the tiles. We could
display them all and there'd be no need to worry about whether to update
the stats on zoom. This approach would also solve two other problems:

  (1) the flickering of the points when zoom changes

  (2) the duplication of points in the return values
  from querySourceFeatures and queryRenderedFeatures. (see
  https://docs.mapbox.com/mapbox-gl-js/api/map/#map#querysourcefeatures)
*/
const UPDATE_STATS_ON_ZOOM = true

function Map({
  options,
  onChangeData = () => {},
  onChangeSelectedRegion = () => {},
}) {
  const container = useRef(null)
  const selectedRegion = useRef(null)

  const [loaded, setLoaded] = useState(false)
  const [map, setMap] = useState(null)
  const [radius, setRadius] = useState(INITIAL_RADIUS)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)
  const [showCircle, setShowCircle] = useState(true)

  useTheme(map)
  useOptions(map, options)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: container.current,
      style: style,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      minZoom: 3,
      maxZoom: 8,
      maxBounds: [
        [-155, 5],
        [-45, 65],
      ],
    })

    map.on('load', () => {
      setLoaded(true)
      setMap(map)
      if (UPDATE_STATS_ON_ZOOM) {
        map.on('zoomend', () => setZoom(map.getZoom()))
      }
    })

    return function cleanup() {
      map.remove()
    }
  }, [])

  useEffect(() => {
    if (!map) {
      return
    }

    onChangeData({
      fires: options.fires
        ? map.querySourceFeatures('fires', { sourceLayer: 'fires' })
        : [],
      forests: options.forests
        ? map.querySourceFeatures('forests', { sourceLayer: 'forests' })
        : [],
    })
  }, [map, options, zoom])

  return (
    <Box sx={{ flexBasis: '100%' }} ref={container}>
      <RulerButton map={map} />
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
            onIdle={() => onChangeSelectedRegion(selectedRegion.current)}
          />
          <CirclePicker
            map={map}
            center={INITIAL_CENTER}
            radius={radius}
            onChange={(circle) => {
              selectedRegion.current = circle
              if (UPDATE_STATS_ON_DRAG) {
                onChangeSelectedRegion(circle)
              }
            }}
            onIdle={(circle) => onChangeSelectedRegion(circle)}
          />
        </>
      )}
    </Box>
  )
}

export default Map
