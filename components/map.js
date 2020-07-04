import { useCallback } from 'react'
import { Box } from 'theme-ui'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = ''

function Map () {
  const mapRef = useCallback(node => {
    if (node !== null) {
      const map = new mapboxgl.Map({
        container: node,
        center: [5, 34],
        zoom: 2
      })
    }
  }, [])

  return <Box sx={{ ml: [4], mt: [4], fontSize: [5] }}>
    <Box ref={mapRef}></Box>
  </Box>
}

export default Map