import { useEffect, useState, useRef } from 'react'
import { Box } from 'theme-ui'
import mapboxgl from 'mapbox-gl'
import style from './style'
import Enhancers from './enhancers'
import { INITIAL_CENTER, INITIAL_ZOOM } from './settings'

mapboxgl.accessToken = ''

function Map({ options, onChangeSelectedData = (selectedData) => {} }) {
  const container = useRef(null)
  const [map, setMap] = useState(null)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: container.current,
      style: style,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      // minZoom: 3,
      // maxZoom: 8,
      // maxBounds: [
      //   [-155, 5],
      //   [-45, 65],
      // ],
    })

    map.on('load', () => setMap(map))

    return function cleanup() {
      setMap(null)
      map.remove()
    }
  }, [])

  return (
    <Box sx={{ flexBasis: '100%' }} ref={container}>
      {map && (
        <Enhancers
          map={map}
          options={options}
          onChangeSelectedData={onChangeSelectedData}
        />
      )}
    </Box>
  )
}

export default Map
