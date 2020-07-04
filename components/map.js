import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import { Box } from 'theme-ui'
import style from './style'
import useTheme from '../hooks/use-theme'
import mapboxgl from 'mapbox-gl'
import { useThemeUI } from 'theme-ui'

mapboxgl.accessToken = ''

function Map () {
  const [loaded, setLoaded] = useState(false)
  const [map, setMap] = useState(null)
  const container = useRef(null)
  
  useTheme(map)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: container.current,
      style: style,
      center: [-120.7,37.6],
      zoom: 2
    })

    map.on('load', () => {
      setLoaded(true)
      setMap(map)
      console.log('loaded')
    })

    return function cleanup() {
      map.remove()
    }
  }, [])

  return <Box sx={{ ml: [4], mt: [4], fontSize: [5] }}>
    Hello
    <Box sx={{ width: 500, height: 300 }} ref={container}></Box>
  </Box>
}

export default Map