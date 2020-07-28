import { useEffect, useState, useRef } from 'react'
import { Box } from 'theme-ui'
import mapboxgl from 'mapbox-gl'
import useTheme from './use-theme'
import useOptions from './use-options'
import style from './style'
import { RulerButton, rulerStyles } from './ruler'

mapboxgl.accessToken = ''

function Map({ options }) {
  const [loaded, setLoaded] = useState(false)
  const [map, setMap] = useState(null)
  const container = useRef(null)

  useTheme(map)
  useOptions(map, options)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: container.current,
      style: style,
      center: [-120.7, 37.6],
      zoom: 2,
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

  return (
    <Box sx={{ flexBasis: '100%', ...rulerStyles }} ref={container}>
      <RulerButton map={map} />
    </Box>
  )
}

export default Map
